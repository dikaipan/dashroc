from typing import Dict, List, Any, Optional
import re
import pandas as pd
from backend.services.base_service import BaseService


def normalize_area_group_name(area_name: str) -> str:
    """
    Normalize area group names to fix typos and inconsistencies
    
    Args:
        area_name: Original area group name
        
    Returns:
        Normalized area group name
    """
    if not isinstance(area_name, str):
        return str(area_name) if area_name is not None else ""
    
    original = area_name
    area_lower = area_name.strip().lower()
    
    # Fix Jakarta variations (including "Jakarat" typo)
    if "jakarat" in area_lower and "jakarta" not in area_lower:
        # Replace "Jakarat" with "Jakarta" (case-insensitive), but handle "Jakarata" -> "Jakarta"
        area_name = re.sub(r'[Jj]akarat', 'Jakarta', area_name, flags=re.IGNORECASE)
        # Also fix "Jakarata" -> "Jakarta" (remove extra 'a')
        area_name = re.sub(r'[Jj]akartaa', 'Jakarta', area_name, flags=re.IGNORECASE)
    
    # Fix other city names - specific corrections
    city_corrections = {
        "semarang": "Semarang",
        "bandung": "Bandung",
        "bandung": "Bandung",  # For "BAndung"
        "padang": "Padang",
        "depok": "Depok",
        "medan": "Medan",
        "solo": "Solo",
        "yogyakarta": "Yogyakarta",
        "kendari": "Kendari",
        "bali": "Bali",
        "jakarat 3": "Jakarta 3",
        "jakarat 2": "Jakarta 2",
        "jakarat 1": "Jakarta 1"
    }
    
    # Check if the area name matches any correction pattern (case-insensitive)
    for wrong, correct in city_corrections.items():
        if area_lower == wrong.lower():
            return correct
        # Also check if it starts with the wrong name
        if area_lower.startswith(wrong.lower()) and wrong != "jakarta":
            # Replace the wrong part with correct one, preserving rest
            if area_name.lower().startswith(wrong.lower()):
                remaining = area_name[len(wrong):]
                return correct + remaining
    
    # Capitalize first letter if it's all lowercase (but preserve Jakarta with numbers)
    if area_name and not area_lower.startswith("jakarta"):
        # If it starts with lowercase and no other uppercase in first word, capitalize first letter
        first_space = area_name.find(' ')
        if first_space > 0:
            first_word = area_name[:first_space]
            if first_word and first_word.islower():
                area_name = first_word.capitalize() + area_name[first_space:]
        elif area_name[0].islower():
            area_name = area_name[0].upper() + area_name[1:]
    
    return area_name


class SOService(BaseService):
    """Business logic for Service Order (SO) operations from so_apr_spt.csv"""
    
    def __init__(self):
        super().__init__(
            file_name="so_apr_spt.csv",
            primary_key="so_number",
            entity_name="service_order"
        )
    
    def get_all_so_data(self) -> List[Dict[str, Any]]:
        """
        Get all SO data from CSV
        
        Returns:
            List of dictionaries with SO data
        """
        df = self._get_dataframe()
        
        # Convert dataframe to list of dictionaries
        result = []
        for _, row in df.iterrows():
            result.append(row.to_dict())
        
        return result
    
    def get_customer_intelligence_data(self) -> Dict[str, Any]:
        """
        Get customer intelligence data: aggregated by area_group with customer and service_type info
        
        Returns:
            Dictionary with:
            - total_so: total number of service orders
            - total_customers: unique customer count
            - total_area_groups: unique area group count
            - area_groups: list of area groups with customer and service type details
        """
        df = self._get_dataframe()
        
        # Normalize area_group names
        df['area_group_normalized'] = df['area_group'].apply(normalize_area_group_name)
        
        # Group by normalized area_group
        area_groups = []
        for area_name, group_df in df.groupby('area_group_normalized'):
            # Get unique customers and service types for this area
            customers = group_df['customer'].dropna().unique().tolist() if 'customer' in group_df.columns else []
            service_types = group_df['service_type'].dropna().unique().tolist() if 'service_type' in group_df.columns else []
            
            area_groups.append({
                'name': area_name,
                'total_so': len(group_df),
                'customers': customers,
                'customer_count': len(customers),
                'service_types': service_types,
                'service_type_count': len(service_types),
                'region': group_df['region'].iloc[0] if 'region' in group_df.columns and len(group_df) > 0 else 'Unknown'
            })
        
        # Sort by total_so descending
        area_groups.sort(key=lambda x: x['total_so'], reverse=True)
        
        # Calculate totals
        total_so = len(df)
        unique_customers = df['customer'].dropna().unique().tolist() if 'customer' in df.columns else []
        
        return {
            'total_so': total_so,
            'total_customers': len(unique_customers),
            'total_area_groups': len(area_groups),
            'area_groups': area_groups,
            'top_5_area_groups': area_groups[:5]
        }
    
    def get_engineer_customer_relationships(self) -> Dict[str, Any]:
        """
        Get engineer-customer relationship data from SO records
        
        Returns:
            Dictionary with:
            - total_engineers: unique engineer count
            - total_customers: unique customer count
            - engineer_customer_matrix: list of engineer-customer pairs with SO count
            - top_pairs: top 10 engineer-customer pairs
            - coverage_stats: coverage statistics
            - risk_analysis: customers with single engineer
        """
        df = self._get_dataframe()
        
        # Filter out rows with missing engineer or customer
        df_filtered = df[
            df['engineer'].notna() & 
            df['customer'].notna() &
            (df['engineer'].astype(str).str.strip() != '') &
            (df['customer'].astype(str).str.strip() != '')
        ].copy()
        
        # Group by engineer and customer
        engineer_customer_groups = df_filtered.groupby(['engineer', 'customer']).agg({
            'so_number': 'count',
            'resolution_time': 'mean'
        }).reset_index()
        
        engineer_customer_groups.columns = ['engineer', 'customer', 'so_count', 'avg_resolution_time']
        
        # Convert to list of dictionaries
        matrix = []
        for _, row in engineer_customer_groups.iterrows():
            matrix.append({
                'engineer': row['engineer'],
                'customer': row['customer'],
                'so_count': int(row['so_count']),
                'avg_resolution_time': float(row['avg_resolution_time']) if pd.notna(row['avg_resolution_time']) else None
            })
        
        # Sort by SO count descending
        matrix.sort(key=lambda x: x['so_count'], reverse=True)
        
        # Get top 10 pairs
        top_pairs = matrix[:10]
        
        # Calculate coverage stats
        unique_engineers = df_filtered['engineer'].nunique()
        unique_customers = df_filtered['customer'].nunique()
        
        # Engineers per customer
        customers_per_engineer = df_filtered.groupby('engineer')['customer'].nunique().to_dict()
        avg_customers_per_engineer = sum(customers_per_engineer.values()) / len(customers_per_engineer) if customers_per_engineer else 0
        
        # Customers per engineer
        engineers_per_customer = df_filtered.groupby('customer')['engineer'].nunique().to_dict()
        avg_engineers_per_customer = sum(engineers_per_customer.values()) / len(engineers_per_customer) if engineers_per_customer else 0
        
        # Risk analysis: customers with only 1 engineer
        single_engineer_customers = [
            {'customer': customer, 'engineer': df_filtered[df_filtered['customer'] == customer]['engineer'].iloc[0], 'so_count': count}
            for customer, count in engineers_per_customer.items() if count == 1
        ]
        
        # Add SO count for single engineer customers
        for item in single_engineer_customers:
            item['so_count'] = int(df_filtered[
                (df_filtered['customer'] == item['customer']) & 
                (df_filtered['engineer'] == item['engineer'])
            ].shape[0])
        
        # Top engineers by customer diversity (filter out empty/null engineers)
        top_diverse_engineers = sorted(
            [{'engineer': eng, 'customer_count': count} 
             for eng, count in customers_per_engineer.items() 
             if eng and str(eng).strip() != '' and str(eng).lower() != 'nan'],
            key=lambda x: x['customer_count'],
            reverse=True
        )[:10]
        
        # Top customers by engineer coverage
        top_covered_customers = sorted(
            [{'customer': cust, 'engineer_count': count} for cust, count in engineers_per_customer.items()],
            key=lambda x: x['engineer_count'],
            reverse=True
        )[:10]
        
        return {
            'total_engineers': unique_engineers,
            'total_customers': unique_customers,
            'total_so': len(df_filtered),
            'engineer_customer_matrix': matrix,
            'top_pairs': top_pairs,
            'coverage_stats': {
                'avg_customers_per_engineer': round(avg_customers_per_engineer, 2),
                'avg_engineers_per_customer': round(avg_engineers_per_customer, 2),
                'max_customers_per_engineer': max(customers_per_engineer.values()) if customers_per_engineer else 0,
                'max_engineers_per_customer': max(engineers_per_customer.values()) if engineers_per_customer else 0
            },
            'risk_analysis': {
                'single_engineer_customers': single_engineer_customers,
                'risk_count': len(single_engineer_customers)
            },
            'top_diverse_engineers': top_diverse_engineers,
            'top_covered_customers': top_covered_customers
        }
    
    def get_resolution_times_by_engineer(self, months: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Calculate average response time, repair time, and resolution time by engineer for specified months
        
        Args:
            months: List of month names to filter (e.g., ['April', 'May', 'June', 'July', 'August', 'September'])
                   If None, includes all months
        
        Returns:
            Dictionary with:
            - avg_by_engineer: List of {engineer, avg_response_time, avg_repair_time, avg_resolution_time, count}
            - avg_response_time_overall: Overall average response time (in hours)
            - avg_repair_time_overall: Overall average repair time (in hours)
            - avg_resolution_time_overall: Overall average resolution time (in hours)
            - total_so: Total number of SOs
            - by_month: Average times per month (response_time, repair_time, resolution_time)
            - by_region: Average times per region
            - by_area: Average times per area_group
        """
        df = self._get_dataframe()
        
        # Remove duplicate columns (keep first occurrence)
        df = df.loc[:, ~df.columns.duplicated()]
        
        # Normalize area_group names to fix typos
        if 'area_group' in df.columns:
            df['area_group'] = df['area_group'].astype(str).apply(normalize_area_group_name)
        
        # Determine column names (after normalization)
        month_col = None
        if 'month' in df.columns:
            month_col = 'month'
        elif 'Month' in df.columns:
            month_col = 'Month'
        
        # Filter by months if specified
        if months and month_col:
            df = df[df[month_col].isin(months)]
        
        # Filter only SOs with valid engineer (no status column in CSV, just use engineer + times)
        df = df[
            (df['engineer'].notna()) &
            (df['engineer'].astype(str) != '') &
            (df['engineer'].astype(str).str.strip() != '') &
            (df['engineer'].astype(str).str.strip().str.lower() != 'nan')
        ].copy()
        
        # Convert times to numeric (handle string values)
        # Response time from ce_response_time (CE response time)
        if 'ce_response_time' in df.columns:
            df['ce_response_time'] = pd.to_numeric(df['ce_response_time'], errors='coerce')
        else:
            df['ce_response_time'] = 0.0
        
        # Repair time from repair_time
        if 'repair_time' in df.columns:
            df['repair_time'] = pd.to_numeric(df['repair_time'], errors='coerce')
        else:
            df['repair_time'] = 0.0
        
        # Resolution time from resolution_time
        if 'resolution_time' in df.columns:
            df['resolution_time'] = pd.to_numeric(df['resolution_time'], errors='coerce')
        else:
            df['resolution_time'] = 0.0
        
        # Filter out invalid times (must be > 0 for at least one time metric)
        # Also ensure we have valid numeric values
        df = df[
            ((df['ce_response_time'].notna() & (df['ce_response_time'] > 0)) |
             (df['repair_time'].notna() & (df['repair_time'] > 0)) |
             (df['resolution_time'].notna() & (df['resolution_time'] > 0))) &
            (df['engineer'].astype(str).str.strip() != '') &
            (df['engineer'].astype(str).str.strip() != 'nan')
        ].copy()
        
        # Debug: print info if no data
        if len(df) == 0:
            original_df = self._get_dataframe()
            print(f"[DEBUG SO Service] No valid data after filtering. Original shape: {original_df.shape}")
            print(f"[DEBUG SO Service] Columns with time/month/engineer: {[c for c in original_df.columns if any(x in c.lower() for x in ['time', 'month', 'engineer', 'so_'])]}")
            if 'engineer' in original_df.columns:
                print(f"[DEBUG SO Service] Sample engineer values: {original_df['engineer'].head(10).tolist()}")
                print(f"[DEBUG SO Service] Engineer non-null count: {original_df['engineer'].notna().sum()}")
                print(f"[DEBUG SO Service] Engineer empty count: {(original_df['engineer'].astype(str).str.strip() == '').sum()}")
            if month_col and month_col in original_df.columns:
                print(f"[DEBUG SO Service] Sample month values: {original_df[month_col].unique()[:10].tolist()}")
            if 'ce_response_time' in original_df.columns:
                response_valid = (pd.to_numeric(original_df['ce_response_time'], errors='coerce') > 0).sum()
                print(f"[DEBUG SO Service] CE Response time valid count: {response_valid}")
            if 'repair_time' in original_df.columns:
                repair_valid = (pd.to_numeric(original_df['repair_time'], errors='coerce') > 0).sum()
                print(f"[DEBUG SO Service] Repair time valid count: {repair_valid}")
            if 'resolution_time' in original_df.columns:
                resolution_valid = (pd.to_numeric(original_df['resolution_time'], errors='coerce') > 0).sum()
                print(f"[DEBUG SO Service] Resolution time valid count: {resolution_valid}")
        
        if len(df) == 0:
            return {
                'avg_by_engineer': [],
                'avg_response_time_overall': 0,
                'avg_repair_time_overall': 0,
                'avg_resolution_time_overall': 0,
                'total_so': 0,
                'by_month': {},
                'by_region': {},
                'by_area': {}
            }
        
        # Calculate average by engineer (all three metrics)
        # Response time from ce_response_time, repair time from repair_time
        engineer_stats = df.groupby('engineer').agg({
            'ce_response_time': 'mean',
            'repair_time': 'mean',
            'resolution_time': 'mean',
            'so_number': 'count'
        }).reset_index()
        
        engineer_stats.columns = ['engineer', 'avg_response_time', 'avg_repair_time', 'avg_resolution_time', 'count']
        
        # Fill NaN with 0 and round values, convert to Python float
        engineer_stats['avg_response_time'] = engineer_stats['avg_response_time'].fillna(0).round(2).astype(float)
        engineer_stats['avg_repair_time'] = engineer_stats['avg_repair_time'].fillna(0).round(2).astype(float)
        engineer_stats['avg_resolution_time'] = engineer_stats['avg_resolution_time'].fillna(0).round(2).astype(float)
        engineer_stats['count'] = engineer_stats['count'].astype(int)
        
        # Sort by resolution time (ascending - fastest first)
        avg_by_engineer = engineer_stats.sort_values('avg_resolution_time').to_dict('records')
        
        # Convert numpy types to Python native types for JSON serialization
        for eng in avg_by_engineer:
            eng['engineer'] = str(eng['engineer'])  # Ensure string type
            eng['avg_response_time'] = float(eng['avg_response_time'])
            eng['avg_repair_time'] = float(eng['avg_repair_time'])
            eng['avg_resolution_time'] = float(eng['avg_resolution_time'])
            eng['count'] = int(eng['count'])
        
        # Overall averages - Weighted average based on SO count per engineer
        # This ensures engineers with more SOs contribute more to overall average
        # Formula: Weighted Average = Σ(avg_time_per_engineer × so_count_per_engineer) / Σ(so_count_per_engineer)
        # This is different from simple average of all engineers, giving proper weight to volume
        total_so_count = len(df)
        if total_so_count > 0 and len(avg_by_engineer) > 0:
            # Calculate weighted average from engineer stats (weighted by SO count)
            total_response_weighted = 0.0
            total_repair_weighted = 0.0
            total_resolution_weighted = 0.0
            total_weight = 0
            
            for eng in avg_by_engineer:
                weight = eng['count']  # Number of SOs for this engineer (the weight)
                total_response_weighted += eng['avg_response_time'] * weight
                total_repair_weighted += eng['avg_repair_time'] * weight
                total_resolution_weighted += eng['avg_resolution_time'] * weight
                total_weight += weight
            
            # Calculate weighted averages (engineers with more SOs have more influence)
            if total_weight > 0:
                avg_response_time_overall = round(total_response_weighted / total_weight, 2)
                avg_repair_time_overall = round(total_repair_weighted / total_weight, 2)
                avg_resolution_time_overall = round(total_resolution_weighted / total_weight, 2)
            else:
                # Fallback: Calculate directly from all SOs
                avg_response_time_overall = round(float(df['ce_response_time'].mean()), 2) if df['ce_response_time'].notna().any() else 0.0
                avg_repair_time_overall = round(float(df['repair_time'].mean()), 2) if df['repair_time'].notna().any() else 0.0
                avg_resolution_time_overall = round(float(df['resolution_time'].mean()), 2) if df['resolution_time'].notna().any() else 0.0
        else:
            avg_response_time_overall = 0.0
            avg_repair_time_overall = 0.0
            avg_resolution_time_overall = 0.0
        
        # By month - Weighted average based on engineer SO count (consistent with overall average)
        by_month = {}
        month_col = None
        if 'month' in df.columns:
            month_col = 'month'
        elif 'Month' in df.columns:
            month_col = 'Month'
        
        if month_col:
            # Calculate average by engineer within each month (for weighted average)
            month_engineer_stats = df.groupby([month_col, 'engineer']).agg({
                'ce_response_time': 'mean',
                'repair_time': 'mean',
                'resolution_time': 'mean',
                'so_number': 'count'
            }).reset_index()
            
            month_engineer_stats.columns = [month_col, 'engineer', 'avg_response_time', 'avg_repair_time', 'avg_resolution_time', 'count']
            
            # Fill NaN with 0 and round values
            month_engineer_stats['avg_response_time'] = month_engineer_stats['avg_response_time'].fillna(0).round(2).astype(float)
            month_engineer_stats['avg_repair_time'] = month_engineer_stats['avg_repair_time'].fillna(0).round(2).astype(float)
            month_engineer_stats['avg_resolution_time'] = month_engineer_stats['avg_resolution_time'].fillna(0).round(2).astype(float)
            month_engineer_stats['count'] = month_engineer_stats['count'].astype(int)
            
            # Calculate weighted average per month (weighted by SO count per engineer)
            for month_name in df[month_col].unique():
                if pd.isna(month_name):
                    continue
                
                month_name_str = str(month_name)
                month_engineers = month_engineer_stats[month_engineer_stats[month_col] == month_name]
                
                if len(month_engineers) == 0:
                    continue
                
                # Calculate total SO count for this month
                total_so_count = month_engineers['count'].sum()
                
                if total_so_count > 0:
                    # Weighted average = Σ(avg_time_per_engineer × so_count_per_engineer) / Σ(so_count_per_engineer)
                    total_response_weighted = (month_engineers['avg_response_time'] * month_engineers['count']).sum()
                    total_repair_weighted = (month_engineers['avg_repair_time'] * month_engineers['count']).sum()
                    total_resolution_weighted = (month_engineers['avg_resolution_time'] * month_engineers['count']).sum()
                    
                    by_month[month_name_str] = {
                        'avg_response_time': float(round(total_response_weighted / total_so_count, 2)),
                        'avg_repair_time': float(round(total_repair_weighted / total_so_count, 2)),
                        'avg_resolution_time': float(round(total_resolution_weighted / total_so_count, 2)),
                        'count': int(total_so_count)
                    }
                else:
                    by_month[month_name_str] = {
                        'avg_response_time': 0.0,
                        'avg_repair_time': 0.0,
                        'avg_resolution_time': 0.0,
                        'count': 0
                    }
        
        # By region - Weighted average based on engineer SO count (consistent with overall average)
        by_region = {}
        if 'region' in df.columns:
            # Calculate average by engineer within each region (for weighted average)
            region_engineer_stats = df.groupby(['region', 'engineer']).agg({
                'ce_response_time': 'mean',
                'repair_time': 'mean',
                'resolution_time': 'mean',
                'so_number': 'count'
            }).reset_index()
            
            region_engineer_stats.columns = ['region', 'engineer', 'avg_response_time', 'avg_repair_time', 'avg_resolution_time', 'count']
            
            # Fill NaN with 0 and round values
            region_engineer_stats['avg_response_time'] = region_engineer_stats['avg_response_time'].fillna(0).round(2).astype(float)
            region_engineer_stats['avg_repair_time'] = region_engineer_stats['avg_repair_time'].fillna(0).round(2).astype(float)
            region_engineer_stats['avg_resolution_time'] = region_engineer_stats['avg_resolution_time'].fillna(0).round(2).astype(float)
            region_engineer_stats['count'] = region_engineer_stats['count'].astype(int)
            
            # Calculate weighted average per region (weighted by SO count per engineer)
            for region_name in df['region'].unique():
                if pd.isna(region_name):
                    continue
                
                region_name_str = str(region_name)
                region_engineers = region_engineer_stats[region_engineer_stats['region'] == region_name]
                
                if len(region_engineers) == 0:
                    continue
                
                # Calculate total SO count for this region
                total_so_count = region_engineers['count'].sum()
                
                if total_so_count > 0:
                    # Weighted average = Σ(avg_time_per_engineer × so_count_per_engineer) / Σ(so_count_per_engineer)
                    total_response_weighted = (region_engineers['avg_response_time'] * region_engineers['count']).sum()
                    total_repair_weighted = (region_engineers['avg_repair_time'] * region_engineers['count']).sum()
                    total_resolution_weighted = (region_engineers['avg_resolution_time'] * region_engineers['count']).sum()
                    
                    by_region[region_name_str] = {
                        'avg_response_time': float(round(total_response_weighted / total_so_count, 2)),
                        'avg_repair_time': float(round(total_repair_weighted / total_so_count, 2)),
                        'avg_resolution_time': float(round(total_resolution_weighted / total_so_count, 2)),
                        'count': int(total_so_count)
                    }
                else:
                    by_region[region_name_str] = {
                        'avg_response_time': 0.0,
                        'avg_repair_time': 0.0,
                        'avg_resolution_time': 0.0,
                        'count': 0
                    }
        
        # By area_group - Weighted average based on engineer SO count (consistent with overall average)
        by_area = {}
        if 'area_group' in df.columns:
            # Calculate average by engineer within each area (for weighted average)
            area_engineer_stats = df.groupby(['area_group', 'engineer']).agg({
                'ce_response_time': 'mean',
                'repair_time': 'mean',
                'resolution_time': 'mean',
                'so_number': 'count'
            }).reset_index()
            
            area_engineer_stats.columns = ['area_group', 'engineer', 'avg_response_time', 'avg_repair_time', 'avg_resolution_time', 'count']
            
            # Fill NaN with 0 and round values
            area_engineer_stats['avg_response_time'] = area_engineer_stats['avg_response_time'].fillna(0).round(2).astype(float)
            area_engineer_stats['avg_repair_time'] = area_engineer_stats['avg_repair_time'].fillna(0).round(2).astype(float)
            area_engineer_stats['avg_resolution_time'] = area_engineer_stats['avg_resolution_time'].fillna(0).round(2).astype(float)
            area_engineer_stats['count'] = area_engineer_stats['count'].astype(int)
            
            # Calculate weighted average per area (weighted by SO count per engineer)
            for area_name in df['area_group'].unique():
                if pd.isna(area_name):
                    continue
                
                area_name_str = str(area_name)
                area_engineers = area_engineer_stats[area_engineer_stats['area_group'] == area_name]
                
                if len(area_engineers) == 0:
                    continue
                
                # Calculate total SO count for this area
                total_so_count = area_engineers['count'].sum()
                
                if total_so_count > 0:
                    # Weighted average = Σ(avg_time_per_engineer × so_count_per_engineer) / Σ(so_count_per_engineer)
                    total_response_weighted = (area_engineers['avg_response_time'] * area_engineers['count']).sum()
                    total_repair_weighted = (area_engineers['avg_repair_time'] * area_engineers['count']).sum()
                    total_resolution_weighted = (area_engineers['avg_resolution_time'] * area_engineers['count']).sum()
                    
                    by_area[area_name_str] = {
                        'avg_response_time': float(round(total_response_weighted / total_so_count, 2)),
                        'avg_repair_time': float(round(total_repair_weighted / total_so_count, 2)),
                        'avg_resolution_time': float(round(total_resolution_weighted / total_so_count, 2)),
                        'count': int(total_so_count)
                    }
                else:
                    by_area[area_name_str] = {
                        'avg_response_time': 0.0,
                        'avg_repair_time': 0.0,
                        'avg_resolution_time': 0.0,
                        'count': 0
                    }
        
        return {
            'avg_by_engineer': avg_by_engineer,
            'avg_response_time_overall': avg_response_time_overall,
            'avg_repair_time_overall': avg_repair_time_overall,
            'avg_resolution_time_overall': avg_resolution_time_overall,
            'total_so': len(df),
            'total_engineers': len(avg_by_engineer),  # Add total engineers count
            'by_month': by_month,
            'by_region': by_region,
            'by_area': by_area
        }
    
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """Not used for this read-only service"""
        pass

