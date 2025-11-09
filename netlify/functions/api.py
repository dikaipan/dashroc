import json
import os
from typing import Dict, Any
from flask import Flask, request, jsonify
from serverless_wsgi import handle_request

# Import backend modules
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from routes import register_routes
from config import Config

def create_flask_app():
    """Create Flask app for Netlify Functions"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Register all API routes
    register_routes(app)
    
    return app

app = create_flask_app()

def handler(event, context):
    """Netlify function handler"""
    return handle_request(app, event, context)
