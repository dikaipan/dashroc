import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import os

# ====================================================================
# KPI CALCULATION ENGINE
# Menghitung Indeks KPI dari Data Mentah sesuai format leveling.csv
# ====================================================================

class KPICalculator:
    """Class untuk menghitung KPI Engineer dari data mentah"""
    
    # Bobot KPI (dari metadata leveling.csv)
    WEIGHTS = {
        'productivity': 40,
        'response_time': 25,
        'resolution_time': 25,
        'competency': 15,
        'qualitative': 20
    }
    
    def __init__(self, so_df: pd.DataFrame, engineer_df: pd.DataFrame, machine_df: pd.DataFrame):
        """
        Initialize KPI Calculator
        
        Args:
            so_df: Service Order DataFrame
            engineer_df: Engineer/CE DataFrame
            machine_df: Machine DataFrame
        """
        self.so_df = so_df.copy()
        self.engineer_df = engineer_df.copy()
        self.machine_df = machine_df.copy()
        
        # Preprocess data
        self._preprocess_data()
    
    def _preprocess_data(self):
        """Preprocess and normalize data"""
        # Normalize CE ID columns
        if 'ce_id' in self.so_df.columns:
            self.so_df['ce_id'] = self.so_df['ce_id'].str.upper().str.strip()
        
        if 'id' in self.engineer_df.columns:
            self.engineer_df['ce_id'] = self.engineer_df['id'].str.upper().str.strip()
        
        # Convert date columns
        date_columns = ['created', 'close', 'last_update']
        for col in date_columns:
            if col in self.so_df.columns:
                self.so_df[col] = pd.to_datetime(self.so_df[col], errors='coerce')
        
        # Convert numeric columns
        numeric_columns = ['ce_response_time', 'response_time', 'resolution_time', 'repair_time']
        for col in numeric_columns:
            if col in self.so_df.columns:
                self.so_df[col] = pd.to_numeric(self.so_df[col], errors='coerce')
    
    def calculate_productivity_kpi(self, ce_id: str, start_date: Optional[datetime] = None, 
                                   end_date: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Calculate Productivity KPI (40% weight)
        
        Metrics:
        - Total Machine: Total mesin yang ditangani
        - Total CE Area: Total area coverage engineer
        - Total SO Area: Total service order area
        - SO Area / CE Area: Rasio coverage
        - Total SO Individual: Total service order individual
        - Index, Score, Percentage, KPI Achievement
        """
        # Filter SO data untuk CE ID dan periode
        so_filtered = self.so_df[self.so_df['ce_id'] == ce_id.upper().strip()]
        
        if start_date:
            so_filtered = so_filtered[so_filtered['created'] >= start_date]
        if end_date:
            so_filtered = so_filtered[so_filtered['created'] <= end_date]
        
        so_closed = so_filtered[so_filtered['so_status'].str.lower() == 'close'].copy()
        
        # Calculate metrics
        total_so_individual = len(so_closed)
        
        # Total unique machines handled
        total_machine = so_closed['wsid'].nunique() if 'wsid' in so_closed.columns else 0
        
        # Total CE Area (area group count)
        total_ce_area = so_closed['area_group'].nunique() if 'area_group' in so_closed.columns else 0
        
        # Total SO Area (branch count)
        total_so_area = so_closed['branch_name'].nunique() if 'branch_name' in so_closed.columns else 0
        
        # SO Area / CE Area ratio
        so_area_per_ce_area = total_so_area / total_ce_area if total_ce_area > 0 else 0
        
        # Calculate Productivity Percentage (need target/baseline)
        # Formula: (Actual SO / Target SO) * 100%
        # Target bisa dari rata-rata atau target khusus
        # Untuk sementara, gunakan formula sederhana
        target_so = self._get_productivity_target(ce_id)
        productivity_percentage = (total_so_individual / target_so * 100) if target_so > 0 else 0
        
        # Calculate Index (0-5 scale, normalized)
        # Index = min(5, productivity_percentage / target_percentage * 5)
        target_percentage = 100
        index = min(5.0, (productivity_percentage / target_percentage) * 5) if target_percentage > 0 else 0
        
        # Score (0-5, rounded)
        score = round(index)
        
        # KPI Achievement (capped at weight)
        kpi_achievement = min(self.WEIGHTS['productivity'], 
                            (productivity_percentage / 100) * self.WEIGHTS['productivity'])
        
        return {
            'total_machine': int(total_machine),
            'total_ce_area': int(total_ce_area),
            'total_so_area': int(total_so_area),
            'so_area_per_ce_area': round(so_area_per_ce_area, 2),
            'total_so_individual': int(total_so_individual),
            'index': round(index, 2),
            'score': int(score),
            'percentage': f"{productivity_percentage:.0f}%",
            'kpi_achievement': f"{kpi_achievement:.2f}%"
        }
    
    def calculate_response_time_kpi(self, ce_id: str, start_date: Optional[datetime] = None,
                                    end_date: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Calculate Response Time KPI (25% weight)
        
        Metrics:
        - Zona 1 <=1.5 Hour: Total waktu response <= 1.5 jam
        - Zona 2 <= 3 Hours: Total waktu response <= 3 jam
        - Zona 3 24 Hours Max: Total waktu response <= 24 jam
        - Index, Score, Percentage, KPI Achievement
        """
        so_filtered = self.so_df[self.so_df['ce_id'] == ce_id.upper().strip()]
        
        if start_date:
            so_filtered = so_filtered[so_filtered['created'] >= start_date]
        if end_date:
            so_filtered = so_filtered[so_filtered['created'] <= end_date]
        
        so_closed = so_filtered[so_filtered['so_status'].str.lower() == 'close'].copy()
        
        # Get response times
        response_times = so_closed['ce_response_time'].dropna()
        response_times = response_times[response_times > 0]
        
        # Categorize by zona (SUM of times, not count)
        zona_1_times = response_times[response_times <= 90]  # <= 1.5 jam (90 menit)
        zona_2_times = response_times[(response_times > 90) & (response_times <= 180)]  # <= 3 jam
        zona_3_times = response_times[(response_times > 180) & (response_times <= 1440)]  # <= 24 jam
        
        # Total time per zona (in minutes, convert to HH:MM)
        zona_1_total_minutes = zona_1_times.sum() if len(zona_1_times) > 0 else 0
        zona_2_total_minutes = zona_2_times.sum() if len(zona_2_times) > 0 else 0
        zona_3_total_minutes = zona_3_times.sum() if len(zona_3_times) > 0 else 0
        
        zona_1_hhmm = self._minutes_to_hhmm(zona_1_total_minutes)
        zona_2_hhmm = self._minutes_to_hhmm(zona_2_total_minutes)
        zona_3_hhmm = self._minutes_to_hhmm(zona_3_total_minutes)
        
        # Calculate Index based on distribution
        # Index calculation: weighted average based on zona performance
        total_response_count = len(response_times)
        if total_response_count > 0:
            zona_1_weight = len(zona_1_times) / total_response_count * 1.0  # Full weight
            zona_2_weight = len(zona_2_times) / total_response_count * 0.5  # Half weight
            zona_3_weight = len(zona_3_times) / total_response_count * 0.25  # Quarter weight
            
            index = (zona_1_weight + zona_2_weight + zona_3_weight) * 5  # Scale to 0-5
        else:
            index = 0
        
        # Score
        score = round(index)
        
        # Percentage
        percentage = (index / 5 * 100) if index > 0 else 0
        
        # KPI Achievement
        kpi_achievement = (percentage / 100) * self.WEIGHTS['response_time']
        
        return {
            'zona_1_time': zona_1_hhmm,
            'zona_2_time': zona_2_hhmm,
            'zona_3_time': zona_3_hhmm,
            'zona_1_index': 1.0 if len(zona_1_times) > len(zona_2_times) + len(zona_3_times) else 0.0,
            'zona_2_index': 1.0 if len(zona_2_times) > len(zona_3_times) else 0.0,
            'zona_3_index': 1.0 if len(zona_3_times) > 0 else 0.0,
            'index': round(index, 2),
            'score': int(score),
            'percentage': f"{percentage:.2f}%",
            'kpi_achievement': f"{kpi_achievement:.2f}%"
        }
    
    def calculate_resolution_time_kpi(self, ce_id: str, start_date: Optional[datetime] = None,
                                      end_date: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Calculate Resolution Time KPI (25% weight)
        
        Metrics:
        - Resolution Time: Average resolution time
        - Index, Score, Percentage, KPI Achievement
        """
        so_filtered = self.so_df[self.so_df['ce_id'] == ce_id.upper().strip()]
        
        if start_date:
            so_filtered = so_filtered[so_filtered['created'] >= start_date]
        if end_date:
            so_filtered = so_filtered[so_filtered['created'] <= end_date]
        
        so_closed = so_filtered[so_filtered['so_status'].str.lower() == 'close'].copy()
        
        # Get resolution times
        resolution_times = so_closed['resolution_time'].dropna()
        resolution_times = resolution_times[resolution_times > 0]
        
        if len(resolution_times) > 0:
            avg_resolution_minutes = resolution_times.mean()
            resolution_time_hhmmss = self._minutes_to_hhmmss(avg_resolution_minutes)
        else:
            avg_resolution_minutes = 0
            resolution_time_hhmmss = "0:00:00"
        
        # Calculate Index based on target resolution time
        # Target: 60 minutes (1 hour) for 100%
        target_resolution = 60  # minutes
        if avg_resolution_minutes > 0:
            # Better resolution (lower time) = higher index
            index = min(5.0, (target_resolution / avg_resolution_minutes) * 5) if avg_resolution_minutes > 0 else 0
            percentage = min(100.0, (target_resolution / avg_resolution_minutes) * 100)
        else:
            index = 0
            percentage = 0
        
        score = round(index)
        kpi_achievement = (percentage / 100) * self.WEIGHTS['resolution_time']
        
        return {
            'resolution_time': resolution_time_hhmmss,
            'index': round(index, 2),
            'score': int(score),
            'percentage': f"{percentage:.2f}%",
            'kpi_achievement': f"{kpi_achievement:.2f}%"
        }
    
    def calculate_competency_kpi(self, ce_id: str, competency_data: Optional[Dict[str, int]] = None) -> Dict[str, Any]:
        """
        Calculate Competency KPI (15% weight)
        
        Metrics:
        - SR, VS, TCR, CASHSHOTER, EDC, UPS, POS, MOBILE APP (1 = mastered, 0 = not)
        - Index, Score, Percentage, KPI Achievement
        """
        # Default competency if not provided
        if competency_data is None:
            competency_data = {
                'SR': 0, 'VS': 0, 'TCR': 0, 'CASHSHOTER': 0,
                'EDC': 0, 'UPS': 0, 'POS': 0, 'MOBILE_APP': 0
            }
        
        total_tools = 8
        tools_mastered = sum(1 for v in competency_data.values() if v == 1)
        
        percentage = (tools_mastered / total_tools) * 100
        index = (tools_mastered / total_tools) * 5  # Scale to 0-5
        score = round(index)
        kpi_achievement = (percentage / 100) * self.WEIGHTS['competency']
        
        return {
            **competency_data,
            'index': round(index, 2),
            'score': int(score),
            'percentage': f"{percentage:.2f}%",
            'kpi_achievement': f"{kpi_achievement:.2f}%"
        }
    
    def calculate_qualitative_kpi(self, ce_id: str, qualitative_scores: Optional[Dict[str, int]] = None) -> Dict[str, Any]:
        """
        Calculate Qualitative Skills KPI (20% weight)
        
        Metrics:
        - Analytical Thinking, Communication & Coordination, SOP, Team Work, 
          Innovation & Willing to Learn, BABY PARTS Usage (0-100 scale)
        - Index, Score, Percentage, KPI Achievement
        """
        # Default scores if not provided
        if qualitative_scores is None:
            qualitative_scores = {
                'analytical_thinking': 75,
                'communication_coordination': 75,
                'sop': 80,
                'team_work': 80,
                'innovation_willing_to_learn': 75,
                'baby_parts_usage': 100
            }
        
        # Calculate average score
        scores = list(qualitative_scores.values())
        avg_score = sum(scores) / len(scores) if len(scores) > 0 else 0
        
        # Calculate percentage (target score = 93-94 based on analysis)
        target_score = 93.5
        percentage = (avg_score / target_score) * 100 if target_score > 0 else 0
        
        # Index (0-5 scale)
        index = min(5.0, (avg_score / 100) * 5)
        score = round(avg_score)
        
        # KPI Achievement
        kpi_achievement = (percentage / 100) * self.WEIGHTS['qualitative']
        
        return {
            **qualitative_scores,
            'index': round(index, 2),
            'score': int(score),
            'percentage': f"{percentage:.2f}%",
            'kpi_achievement': f"{kpi_achievement:.2f}%"
        }
    
    def calculate_total_kpi(self, productivity_kpi: Dict, response_time_kpi: Dict,
                           resolution_time_kpi: Dict, competency_kpi: Dict,
                           qualitative_kpi: Dict) -> Dict[str, Any]:
        """
        Calculate Total KPI Achievement
        
        Returns:
        - Quantitative Index
        - Qualitative Score
        - Total KPI Achievement
        """
        # Extract KPI Achievements (remove % sign and convert to float)
        prod_kpi = float(productivity_kpi['kpi_achievement'].replace('%', ''))
        rt_kpi = float(response_time_kpi['kpi_achievement'].replace('%', ''))
        res_kpi = float(resolution_time_kpi['kpi_achievement'].replace('%', ''))
        comp_kpi = float(competency_kpi['kpi_achievement'].replace('%', ''))
        qual_kpi = float(qualitative_kpi['kpi_achievement'].replace('%', ''))
        
        # Total KPI Achievement = Sum of all KPI Achievements
        total_kpi_achievement = prod_kpi + rt_kpi + res_kpi + comp_kpi + qual_kpi
        
        # Quantitative Index (weighted average of productivity, response, resolution, competency)
        quantitative_index = (
            float(productivity_kpi['index']) * 0.4 +
            float(response_time_kpi['index']) * 0.25 +
            float(resolution_time_kpi['index']) * 0.25 +
            float(competency_kpi['index']) * 0.15
        )
        
        # Qualitative Score (average of qualitative scores)
        qualitative_score = float(qualitative_kpi['score'])
        
        # Determine Result and Assessment
        if total_kpi_achievement >= 95:
            result = "Sangat Baik"
            assessment = "Stay" if total_kpi_achievement >= 98 else "Level Up"
        elif total_kpi_achievement >= 85:
            result = "Baik"
            assessment = "Stay"
        elif total_kpi_achievement >= 70:
            result = "Cukup"
            assessment = "Review"
        else:
            result = "Kurang"
            assessment = "Training"
        
        return {
            'quantitative_index': round(quantitative_index, 2),
            'qualitative_score': round(qualitative_score, 2),
            'total_kpi_achievement': f"{total_kpi_achievement:.2f}%",
            'result': result,
            'assessment': assessment
        }
    
    def calculate_kpi_for_engineer(self, ce_id: str, 
                                   start_date: Optional[datetime] = None,
                                   end_date: Optional[datetime] = None,
                                   competency_data: Optional[Dict[str, int]] = None,
                                   qualitative_scores: Optional[Dict[str, int]] = None) -> Dict[str, Any]:
        """
        Calculate all KPI metrics for a single engineer
        
        Returns complete KPI data in leveling.csv format
        """
        # Get engineer info
        engineer_info = self.engineer_df[self.engineer_df['ce_id'] == ce_id.upper().strip()]
        if len(engineer_info) == 0:
            return {'error': f'Engineer {ce_id} not found'}
        
        eng = engineer_info.iloc[0]
        
        # Calculate all KPI components
        productivity = self.calculate_productivity_kpi(ce_id, start_date, end_date)
        response_time = self.calculate_response_time_kpi(ce_id, start_date, end_date)
        resolution_time = self.calculate_resolution_time_kpi(ce_id, start_date, end_date)
        competency = self.calculate_competency_kpi(ce_id, competency_data)
        qualitative = self.calculate_qualitative_kpi(ce_id, qualitative_scores)
        total = self.calculate_total_kpi(productivity, response_time, resolution_time, 
                                       competency, qualitative)
        
        # Combine all results
        result = {
            'name': eng.get('name', ''),
            'ce_id': ce_id,
            'role': eng.get('role', ''),
            'area_group': eng.get('area_group', ''),
            'region': eng.get('region', ''),
            'vendor': eng.get('vendor', ''),
            'join_date': eng.get('join_date', ''),
            'assessment_date': end_date.strftime('%d-%b-%y') if end_date else datetime.now().strftime('%d-%b-%y'),
            'productivity': productivity,
            'response_time': response_time,
            'resolution_time': resolution_time,
            'competency': competency,
            'qualitative': qualitative,
            'total': total
        }
        
        return result
    
    def _get_productivity_target(self, ce_id: str) -> float:
        """Get productivity target for engineer (baseline or average)"""
        # Simple implementation: return average or fixed target
        # Bisa dikembangkan berdasarkan role, area, atau historical data
        return 500  # Default target
    
    def _minutes_to_hhmm(self, minutes: float) -> str:
        """Convert minutes to HH:MM format"""
        if pd.isna(minutes) or minutes == 0:
            return "0:00"
        hours = int(minutes // 60)
        mins = int(minutes % 60)
        return f"{hours}:{mins:02d}"
    
    def _minutes_to_hhmmss(self, minutes: float) -> str:
        """Convert minutes to HH:MM:SS format"""
        if pd.isna(minutes) or minutes == 0:
            return "0:00:00"
        hours = int(minutes // 60)
        mins = int((minutes % 60) // 1)
        secs = int((minutes % 1) * 60)
        return f"{hours}:{mins:02d}:{secs:02d}"


def generate_leveling_report(so_file: str, engineer_file: str, machine_file: str,
                            output_file: str = 'leveling_calculated.csv',
                            start_date: Optional[str] = None,
                            end_date: Optional[str] = None):
    """
    Generate leveling report (KPI index) from raw data
    
    Args:
        so_file: Path to so.csv
        engineer_file: Path to data_ce.csv
        machine_file: Path to data_mesin.csv
        output_file: Path to output file
        start_date: Start date for period (YYYY-MM-DD)
        end_date: End date for period (YYYY-MM-DD)
    """
    print("=" * 80)
    print("GENERATE KPI LEVELING REPORT FROM RAW DATA")
    print("=" * 80)
    
    # Load data
    print("\n[1/5] Loading data...")
    so_df = pd.read_csv(so_file, low_memory=False)
    engineer_df = pd.read_csv(engineer_file, low_memory=False)
    machine_df = pd.read_csv(machine_file, low_memory=False)
    
    print(f"   - SO records: {len(so_df)}")
    print(f"   - Engineers: {len(engineer_df)}")
    print(f"   - Machines: {len(machine_df)}")
    
    # Initialize calculator
    print("\n[2/5] Initializing KPI Calculator...")
    calculator = KPICalculator(so_df, engineer_df, machine_df)
    
    # Parse dates
    start_dt = pd.to_datetime(start_date) if start_date else None
    end_dt = pd.to_datetime(end_date) if end_date else None
    
    if start_dt:
        print(f"   Period: {start_dt.strftime('%Y-%m-%d')} to {end_dt.strftime('%Y-%m-%d') if end_dt else 'now'}")
    
    # Calculate KPI for each engineer
    print("\n[3/5] Calculating KPI for all engineers...")
    results = []
    
    # Get unique CE IDs from SO data
    ce_ids = so_df['ce_id'].dropna().unique()
    print(f"   Found {len(ce_ids)} engineers with SO data")
    
    for idx, ce_id in enumerate(ce_ids[:10]):  # Limit to 10 for testing
        if pd.isna(ce_id):
            continue
        
        print(f"   [{idx+1}/{min(len(ce_ids), 10)}] Calculating for {ce_id}...")
        kpi_result = calculator.calculate_kpi_for_engineer(
            ce_id, start_dt, end_dt,
            competency_data=None,  # TODO: Load from competency data source
            qualitative_scores=None  # TODO: Load from assessment data source
        )
        
        if 'error' not in kpi_result:
            results.append(kpi_result)
    
    # Convert to DataFrame format matching leveling.csv
    print("\n[4/5] Formatting output...")
    output_data = []
    
    for result in results:
        row = {
            'Name': result['name'],
            'CE Id': result['ce_id'],
            'Role': result['role'],
            'Area Group': result['area_group'],
            'Region': result['region'],
            'Vendor': result['vendor'],
            'Join Date': result['join_date'],
            'Assessment Date': result['assessment_date'],
            
            # Productivity
            'Total Machine': result['productivity']['total_machine'],
            'Total CE Area': result['productivity']['total_ce_area'],
            'Total SO Area': result['productivity']['total_so_area'],
            'SO Area / CE Area': result['productivity']['so_area_per_ce_area'],
            'Total SO Individual': result['productivity']['total_so_individual'],
            'Productivity Index': result['productivity']['index'],
            'Productivity Score': result['productivity']['score'],
            'Productivity Percentage': result['productivity']['percentage'],
            'Productivity KPI': result['productivity']['kpi_achievement'],
            
            # Response Time
            'Zona 1 Time': result['response_time']['zona_1_time'],
            'Zona 2 Time': result['response_time']['zona_2_time'],
            'Zona 3 Time': result['response_time']['zona_3_time'],
            'Response Time Index': result['response_time']['index'],
            'Response Time Score': result['response_time']['score'],
            'Response Time Percentage': result['response_time']['percentage'],
            'Response Time KPI': result['response_time']['kpi_achievement'],
            
            # Resolution Time
            'Resolution Time': result['resolution_time']['resolution_time'],
            'Resolution Time Index': result['resolution_time']['index'],
            'Resolution Time Score': result['resolution_time']['score'],
            'Resolution Time Percentage': result['resolution_time']['percentage'],
            'Resolution Time KPI': result['resolution_time']['kpi_achievement'],
            
            # Competency
            'SR': result['competency'].get('SR', 0),
            'VS': result['competency'].get('VS', 0),
            'TCR': result['competency'].get('TCR', 0),
            'CASHSHOTER': result['competency'].get('CASHSHOTER', 0),
            'EDC': result['competency'].get('EDC', 0),
            'UPS': result['competency'].get('UPS', 0),
            'POS': result['competency'].get('POS', 0),
            'MOBILE APP': result['competency'].get('MOBILE_APP', 0),
            'Competency Index': result['competency']['index'],
            'Competency Score': result['competency']['score'],
            'Competency Percentage': result['competency']['percentage'],
            'Competency KPI': result['competency']['kpi_achievement'],
            
            # Qualitative
            'Analytical Thinking': result['qualitative'].get('analytical_thinking', 0),
            'Communication & Coordination': result['qualitative'].get('communication_coordination', 0),
            'SOP': result['qualitative'].get('sop', 0),
            'Team Work': result['qualitative'].get('team_work', 0),
            'Innovation & Willing to Learn': result['qualitative'].get('innovation_willing_to_learn', 0),
            'BABY PARTS Usage': result['qualitative'].get('baby_parts_usage', 0),
            'Qualitative Index': result['qualitative']['index'],
            'Qualitative Score': result['qualitative']['score'],
            'Qualitative Percentage': result['qualitative']['percentage'],
            'Qualitative KPI': result['qualitative']['kpi_achievement'],
            
            # Total
            'Quantitative Index': result['total']['quantitative_index'],
            'Qualitative Score': result['total']['qualitative_score'],
            'Total KPI Achievement': result['total']['total_kpi_achievement'],
            'Result': result['total']['result'],
            'Assessment': result['total']['assessment']
        }
        output_data.append(row)
    
    output_df = pd.DataFrame(output_data)
    
    # Save to CSV
    print(f"\n[5/5] Saving to {output_file}...")
    output_df.to_csv(output_file, index=False)
    print(f"   ✅ Saved {len(output_df)} records to {output_file}")
    
    print("\n" + "=" * 80)
    print("GENERATION COMPLETE!")
    print("=" * 80)
    
    return output_df


# ====================================================================
# MAIN EXECUTION
# ====================================================================

if __name__ == '__main__':
    # Example usage
    generate_leveling_report(
        so_file='data/so.csv',
        engineer_file='data/data_ce.csv',
        machine_file='data/data_mesin.csv',
        output_file='data/leveling_calculated.csv',
        start_date='2024-01-01',  # Adjust as needed
        end_date='2025-11-13'     # Assessment date from leveling.csv
    )