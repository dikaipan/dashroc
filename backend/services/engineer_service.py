from typing import Dict, List, Any
import pandas as pd
from backend.services.base_service import BaseService
from backend.utils.validators import validate_engineer


class EngineerService(BaseService):
    """Business logic for engineer operations"""
    
    def __init__(self):
        super().__init__(
            file_name="data_ce.csv",
            primary_key="id",
            entity_name="engineer"
        )
    
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """Validate engineer data"""
        validate_engineer(data, is_create=is_create)
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get engineer statistics"""
        df = self._get_dataframe()
        
        stats = {
            "total_engineers": len(df),
            "by_region": df['region'].value_counts().to_dict() if 'region' in df.columns else {},
            "by_vendor": df['vendor'].value_counts().to_dict() if 'vendor' in df.columns else {},
            "by_area_group": df['area_group'].value_counts().to_dict() if 'area_group' in df.columns else {},
        }
        
        return stats