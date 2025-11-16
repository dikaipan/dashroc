from typing import Dict, List, Any
import pandas as pd
import os
from backend.services.base_service import BaseService
from config import Config


class LevelingService(BaseService):
    """Business logic for leveling data operations"""
    
    def __init__(self):
        super().__init__(
            file_name="leveling.csv",
            primary_key="ce_id",
            entity_name="leveling"
        )
    
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """
        Validate leveling data (read-only, so validation not needed for CRUD)
        
        Args:
            data: Data to validate
            is_create: Whether this is a create operation
            
        Raises:
            ValueError: If validation fails
        """
        # Leveling data is read-only from CSV, so validation is minimal
        # If needed in the future, add validation logic here
        pass
    
    def _get_dataframe(self) -> pd.DataFrame:
        """
        Get normalized dataframe from leveling.csv
        Skips first 3 metadata rows
        
        Returns:
            Normalized DataFrame
            
        Raises:
            FileNotFoundError: If file doesn't exist
        """
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"{self.entity_name.capitalize()} data not found")
        
        # Read CSV with skiprows to skip metadata (first 3 rows)
        encodings = ["utf-8", "utf-8-sig", "latin1", "cp1252"]
        df = None
        
        for enc in encodings:
            try:
                df = pd.read_csv(self.file_path, encoding=enc, skiprows=3, low_memory=False)
                break
            except UnicodeDecodeError:
                continue
        
        if df is None:
            raise Exception(f"Cannot read file {self.file_path}")
        
        # Normalize columns to snake_case
        from backend.utils.helpers import to_snake
        df.columns = [to_snake(c) for c in df.columns]
        
        # Important text columns that should not be converted to numeric
        important_text_cols = [
            'name', 'ce_id', 'role', 'area_group', 'region', 'vendor',
            'join_date', 'assesment_date', 'experience', 'result', 'assesment', 'consifrm'
        ]
        
        # Convert numerics (except important text columns)
        for col in df.columns:
            if col not in important_text_cols:
                try:
                    df[col] = pd.to_numeric(df[col], errors="ignore", downcast="float")
                except Exception:
                    pass
        
        # Fill NaN
        for col in df.columns:
            df[col] = df[col].fillna("")
        
        return df
    
    def get_all(self) -> List[Dict[str, Any]]:
        """
        Get all leveling records
        
        Returns:
            List of leveling records as dictionaries
        """
        df = self._get_dataframe()
        return df.to_dict('records')
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get leveling statistics"""
        df = self._get_dataframe()
        
        stats = {
            "total_engineers": len(df),
            "by_region": df['region'].value_counts().to_dict() if 'region' in df.columns else {},
            "by_role": df['role'].value_counts().to_dict() if 'role' in df.columns else {},
            "by_vendor": df['vendor'].value_counts().to_dict() if 'vendor' in df.columns else {},
        }
        
        return stats

