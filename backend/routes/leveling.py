"""
Leveling API Routes
Handles GET operations for leveling/assessment data
"""
from flask import Blueprint, jsonify
from backend.services.leveling_service import LevelingService

leveling_bp = Blueprint('leveling', __name__)
service = LevelingService()

@leveling_bp.route('/leveling', methods=['GET'])
def leveling():
    """
    GET: Retrieve all leveling data
    """
    try:
        data = service.get_all()
        return jsonify(data), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get leveling data: {e}")
        return jsonify({"error": "Internal server error processing leveling data"}), 500

@leveling_bp.route('/leveling/statistics', methods=['GET'])
def leveling_statistics():
    """
    GET: Retrieve leveling statistics
    """
    try:
        stats = service.get_statistics()
        return jsonify(stats), 200
    except Exception as e:
        print(f"[ERROR] Failed to get leveling statistics: {e}")
        return jsonify({"error": "Internal server error processing leveling statistics"}), 500

