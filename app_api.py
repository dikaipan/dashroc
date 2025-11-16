"""
ROC Dashboard - API Server Only
For production deployment (Railway/Render)
Frontend is served separately on Vercel
"""
from flask import Flask, Response
from flask_cors import CORS
from config import Config
from backend.routes import register_routes
import os

def create_app() -> Flask:
    """
    Application factory for API-only server
    
    Returns:
        Configured Flask application instance
    """
    app = Flask(__name__)
    
    app.config.from_object(Config)
    
    # Enable CORS for Vercel frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "https://rocdashboard.vercel.app",
                "http://localhost:5173",
                "http://localhost:3000"
            ]
        }
    })
    
    # Register all API routes with /api prefix
    register_routes(app)
    
    # Root endpoint - API info
    @app.route("/")
    def root() -> Response:
        """Root endpoint with API information"""
        return Response(
            '{"status": "ok", "service": "ROC Dashboard API", "version": "1.0", "endpoints": ["/api/engineers", "/api/leveling", "/api/so-data", "/api/tools", "/api/machines", "/api/stock-parts"]}',
            mimetype='application/json'
        )
    
    # Health check endpoint
    @app.route("/health")
    @app.route("/healthcheck")
    def health_check() -> Response:
        """Health check endpoint for deployment platforms"""
        return Response(
            '{"status": "healthy", "service": "ROC Dashboard API"}',
            mimetype='application/json'
        )
    
    return app

if __name__ == "__main__":
    app = create_app()
    # Get port from environment variable (for Railway, Render, etc.)
    port = int(os.environ.get('PORT', Config.PORT))
    # Bind to 0.0.0.0 for production deployment
    host = os.environ.get('HOST', '0.0.0.0')
    
    print(f"Starting ROC Dashboard API Server on {host}:{port}")
    print("API endpoints available at /api/*")
    
    app.run(host=host, port=port, debug=False)
