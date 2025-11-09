from typing import Optional
from flask import Flask, send_from_directory, Response
from flask_cors import CORS
from config import Config
from backend.routes import register_routes
import os

def create_app() -> Flask:
    """
    Application factory
    
    Returns:
        Configured Flask application instance
    """
    app = Flask(__name__)
    
    app.config.from_object(Config)
    CORS(app)
    
    # Register all API routes FIRST (with /api prefix)
    register_routes(app)
    
    # Serve React frontend - CATCH-ALL route (must be LAST)
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path: str) -> Response:
        """
        Serve React frontend static files with SPA fallback
        
        This route handles:
        1. Static assets (JS, CSS, images) from dist/assets/
        2. All SPA routes (dashboard, engineers, etc.) -> return index.html
        
        Args:
            path: Requested file path
            
        Returns:
            Static file response or index.html for SPA routes
        """
        # Check if dist folder exists
        if not os.path.exists(Config.DIST_DIR):
            return """
            <html>
              <head><meta charset="utf-8"><title>ROC Dashboard - Setup</title></head>
              <body style="font-family: Arial, sans-serif; padding:30px;">
                <h2>ROC Dashboard</h2>
                <p>The frontend build was not found.</p>
                <p>Please build the React frontend first:</p>
                <pre>cd frontend\nnpm install\nnpm run build</pre>
                <p>Then refresh this page.</p>
              </body>
            </html>
            """
        
        # If requesting a file that exists (JS, CSS, images, etc.), serve it
        if path != "":
            file_path = os.path.join(Config.DIST_DIR, path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                return send_from_directory(Config.DIST_DIR, path)
        
        # For all other requests (SPA routes), return index.html
        # This handles: /, /dashboard, /engineers, /stockpart, etc.
        return send_from_directory(Config.DIST_DIR, "index.html")
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)