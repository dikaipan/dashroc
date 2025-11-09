"""
Unit tests for backend/utils/validators.py
"""
import pytest
from backend.utils.validators import (
    validate_engineer,
    validate_machine,
    validate_stock_part,
)


class TestValidateEngineer:
    """Test validate_engineer function"""
    
    def test_valid_engineer(self):
        data = {
            'id': 'ENG001',
            'name': 'John Doe',
            'latitude': -6.2088,
            'longitude': 106.8456
        }
        assert validate_engineer(data) is True
    
    def test_missing_required_fields(self):
        with pytest.raises(ValueError, match="ID and name are required"):
            validate_engineer({})
        
        with pytest.raises(ValueError, match="ID and name are required"):
            validate_engineer({'id': 'ENG001'})
        
        with pytest.raises(ValueError, match="ID and name are required"):
            validate_engineer({'name': 'John Doe'})
    
    def test_invalid_latitude(self):
        data = {
            'id': 'ENG001',
            'name': 'John Doe',
            'latitude': 100,  # Invalid: > 90
            'longitude': 106.8456
        }
        # Validator raises "Latitude must be between -90 and 90" for out of range values
        with pytest.raises(ValueError) as exc_info:
            validate_engineer(data)
        assert "Latitude must be between -90 and 90" in str(exc_info.value) or "Invalid latitude format" in str(exc_info.value)
        
        data['latitude'] = -100  # Invalid: < -90
        with pytest.raises(ValueError) as exc_info:
            validate_engineer(data)
        assert "Latitude must be between -90 and 90" in str(exc_info.value) or "Invalid latitude format" in str(exc_info.value)
    
    def test_invalid_longitude(self):
        data = {
            'id': 'ENG001',
            'name': 'John Doe',
            'latitude': -6.2088,
            'longitude': 200  # Invalid: > 180
        }
        # Validator raises "Longitude must be between -180 and 180" for out of range values
        with pytest.raises(ValueError) as exc_info:
            validate_engineer(data)
        assert "Longitude must be between -180 and 180" in str(exc_info.value) or "Invalid longitude format" in str(exc_info.value)
        
        data['longitude'] = -200  # Invalid: < -180
        with pytest.raises(ValueError) as exc_info:
            validate_engineer(data)
        assert "Longitude must be between -180 and 180" in str(exc_info.value) or "Invalid longitude format" in str(exc_info.value)
    
    def test_invalid_latitude_format(self):
        data = {
            'id': 'ENG001',
            'name': 'John Doe',
            'latitude': 'invalid',
            'longitude': 106.8456
        }
        with pytest.raises(ValueError, match="Invalid latitude format"):
            validate_engineer(data)
    
    def test_invalid_longitude_format(self):
        data = {
            'id': 'ENG001',
            'name': 'John Doe',
            'latitude': -6.2088,
            'longitude': 'invalid'
        }
        with pytest.raises(ValueError, match="Invalid longitude format"):
            validate_engineer(data)


class TestValidateMachine:
    """Test validate_machine function"""
    
    def test_valid_machine(self):
        data = {
            'wsid': 'WS001',
            'branch_name': 'Branch 1',
            'customer': 'Customer 1'
        }
        assert validate_machine(data) is True
    
    def test_missing_required_fields(self):
        with pytest.raises(ValueError):
            validate_machine({})
        
        with pytest.raises(ValueError):
            validate_machine({'wsid': 'WS001'})


class TestValidateStockPart:
    """Test validate_stock_part function"""
    
    def test_valid_stock_part(self):
        data = {
            'part_number': 'PART001',
            'part_name': 'Part Name',
            'fsl': 'FSL001'
        }
        assert validate_stock_part(data) is True
    
    def test_missing_required_fields(self):
        # validate_stock_part only requires part_number
        with pytest.raises(ValueError, match="Part number is required"):
            validate_stock_part({})
        
        # part_number is the only required field, so this should pass
        assert validate_stock_part({'part_number': 'PART001'}) is True

