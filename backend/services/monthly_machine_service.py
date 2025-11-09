from typing import Dict, List, Any
import pandas as pd
from backend.services.base_service import BaseService


class MonthlyMachineService(BaseService):
    """Business logic for monthly machine activation operations"""
    
    # Month number to name mapping
    MONTH_NAMES = {
        1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
        5: 'Mei', 6: 'Jun', 7: 'Jul', 8: 'Agu',
        9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Des'
    }
    
    def __init__(self):
        super().__init__(
            file_name="data_mesin_perbulan.csv",
            primary_key="Month",
            entity_name="monthly_machine"
        )
    
    def get_all_monthly_data(self) -> List[Dict[str, Any]]:
        """
        Get all monthly machine activation data
        
        Returns:
            List of dictionaries with month, year, and total_activation
        """
        df = self._get_dataframe()
        
        # Print columns for debugging
        print(f"[DEBUG] CSV columns: {df.columns.tolist()}")
        print(f"[DEBUG] First row: {df.iloc[0].to_dict() if len(df) > 0 else 'Empty'}")
        
        # Normalize column names (handle different cases)
        df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
        
        print(f"[DEBUG] Normalized columns: {df.columns.tolist()}")
        
        # Convert dataframe to list of dictionaries
        result = []
        for _, row in df.iterrows():
            month_num = int(row['month'])
            year = int(row['year'])
            total = int(row['total_machine'])
            
            result.append({
                'month': self.MONTH_NAMES.get(month_num, str(month_num)),
                'year': year,
                'total_activation': total
            })
        
        return result
    
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """Not used for this read-only service"""
        pass