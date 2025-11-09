from typing import Dict, List, Any
from backend.services.base_service import BaseService


class FSLLocationService(BaseService):
    """Business logic for FSL location operations"""
    
    def __init__(self):
        super().__init__(
            file_name="alamat_fsl.csv",
            primary_key="fsl",  # Assuming FSL name is the primary key
            entity_name="FSL location"
        )
    
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """Validate FSL location data - no validation needed for read-only service"""
        pass