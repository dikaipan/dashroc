"""
Pytest configuration and fixtures
"""
import pytest
import os
import sys
import tempfile
import shutil
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from app import create_app


@pytest.fixture
def app():
    """Create and configure a test Flask application"""
    # Create temporary directory for test data
    test_data_dir = tempfile.mkdtemp()
    
    # Create test app with test configuration
    app = create_app()
    app.config['TESTING'] = True
    app.config['DATA_DIR'] = test_data_dir
    
    yield app
    
    # Cleanup: remove temporary directory
    shutil.rmtree(test_data_dir, ignore_errors=True)


@pytest.fixture
def client(app):
    """Create a test client for the Flask application"""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Create a test CLI runner for the Flask application"""
    return app.test_cli_runner()


@pytest.fixture
def sample_engineer_data():
    """Sample engineer data for testing"""
    return {
        'id': 'ENG001',
        'name': 'John Doe',
        'region': 'Jakarta',
        'area_group': 'Jakarta 1',
        'vendor': 'Vendor A',
        'latitude': -6.2088,
        'longitude': 106.8456,
        'years_experience': '5'
    }


@pytest.fixture
def sample_machine_data():
    """Sample machine data for testing"""
    return {
        'wsid': 'WS001',
        'branch_name': 'Branch Jakarta',
        'customer': 'Customer A',
        'region': 'Jakarta',
        'area_group': 'Jakarta 1',
        'machine_type': 'Type A',
        'latitude': -6.2088,
        'longitude': 106.8456
    }


@pytest.fixture
def sample_stock_part_data():
    """Sample stock part data for testing"""
    return {
        'part_number': 'PART001',
        'part_name': 'Part Name',
        'fsl': 'FSL001',
        'grand_total': 100,
        'min_stock': 10,
        'max_stock': 200
    }

