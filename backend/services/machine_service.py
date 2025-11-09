from typing import Dict, List, Any
import pandas as pd
from backend.services.base_service import BaseService
from backend.utils.validators import validate_machine


class MachineService(BaseService):
    """Business logic for machine operations"""
    
    def __init__(self):
        super().__init__(
            file_name="data_mesin.csv",
            primary_key="wsid",
            entity_name="machine"
        )
    
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """Validate machine data"""
        validate_machine(data, is_create=is_create)
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get machine statistics"""
        df = self._get_dataframe()
        
        stats = {
            "total_machines": len(df),
            "by_region": df['region'].value_counts().to_dict() if 'region' in df.columns else {},
            "by_status": df['machine_status'].value_counts().to_dict() if 'machine_status' in df.columns else {},
            "by_type": df['machine_type'].value_counts().to_dict() if 'machine_type' in df.columns else {},
        }
        
        return stats