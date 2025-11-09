from flask import Blueprint, jsonify
from backend.services.fsl_service import FSLLocationService

fsl_bp = Blueprint('fsl_locations', __name__)
service = FSLLocationService()

@fsl_bp.route('/fsl-locations', methods=['GET'])
def fsl_locations():
    """
    GET: Retrieve all FSL locations
    """
    try:
        data = service.get_all()
        return jsonify(data), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get FSL locations: {e}")
        return jsonify({"error": "Internal server error processing FSL location data"}), 500