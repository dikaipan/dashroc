from typing import Dict, List, Any
import pandas as pd
from backend.services.base_service import BaseService
from backend.utils.validators import validate_stock_part
from backend.utils.helpers import count_by

class StockPartService(BaseService):
    """Business logic for stock part operations"""
    
    def __init__(self):
        super().__init__(
            file_name="stok_part.csv",
            primary_key="part_number",
            entity_name="stock part"
        )
    
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """Validate stock part data"""
        validate_stock_part(data, is_create=is_create)
    
    def get_by_fsl(self, fsl_name: str) -> List[Dict[str, Any]]:
        """Get all stock parts for specific FSL"""
        df = self._get_dataframe()
        
        if 'fsl' not in df.columns:
            raise ValueError("FSL column not found in data")
        
        fsl_parts = df[df['fsl'] == fsl_name]
        
        if fsl_parts.empty:
            return []
        
        return fsl_parts.to_dict(orient="records")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get stock part statistics"""
        df = self._get_dataframe()
        data = df.to_dict(orient="records")
        
        # Basic stats
        stats = {
            "total_parts": len(df),
            "total_quantity": 0,
            "by_fsl": {},
            "by_region": {},
            "low_stock_count": 0
        }
        
        # Count by FSL
        if 'fsl' in df.columns:
            stats["by_fsl"] = count_by(data, 'fsl')
        
        # Count by region
        if 'region' in df.columns:
            stats["by_region"] = count_by(data, 'region')
        
        # Total quantity and low stock
        if 'qty' in df.columns:
            stats["total_quantity"] = int(df['qty'].sum())
            stats["low_stock_count"] = len(df[df['qty'] < 10])
        
        return stats
    
    def get_low_stock_parts(self, threshold: int = 10) -> List[Dict[str, Any]]:
        """Get parts with stock below threshold"""
        df = self._get_dataframe()
        
        if 'qty' not in df.columns:
            return []
        
        # Filter low stock
        low_stock_df = df[df['qty'] < threshold]
        
        # Sort by quantity ascending
        low_stock_df = low_stock_df.sort_values('qty')
        
        return low_stock_df.to_dict(orient="records")