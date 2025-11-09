import os
from typing import Set

class Config:
    """Application configuration"""
    BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    FRONTEND_DIR: str = os.path.join(BASE_DIR, "frontend")
    DIST_DIR: str = os.path.join(FRONTEND_DIR, "dist")
    
    ALLOWED_EXTENSIONS: Set[str] = {"csv"}
    
    # Flask config
    SECRET_KEY: str = os.environ.get('SECRET_KEY', 'dev-secret-key')
    DEBUG: bool = os.environ.get('DEBUG', 'True') == 'True'
    HOST: str = os.environ.get('HOST', '0.0.0.0')
    PORT: int = int(os.environ.get('PORT', 5000))