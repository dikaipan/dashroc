from flask import Blueprint, jsonify, request
from backend.services.engineer_service import EngineerService

engineer_bp = Blueprint('engineers', __name__)
service = EngineerService()

@engineer_bp.route('/engineers', methods=['GET', 'POST'])
def engineers():
    """
    GET: Retrieve all engineers
    POST: Create new engineer
    """
    if request.method == 'GET':
        try:
            data = service.get_all()
            return jsonify(data), 200
        except FileNotFoundError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to get engineers: {e}")
            return jsonify({"error": "Internal server error processing engineer data"}), 500
    
    elif request.method == 'POST':
        try:
            new_engineer = request.get_json()
            if not new_engineer:
                return jsonify({"error": "No data provided"}), 400
            result = service.create(new_engineer)
            return jsonify(result), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"[ERROR] Failed to create engineer: {e}")
            return jsonify({"error": str(e)}), 500

@engineer_bp.route('/engineers/<engineer_id>', methods=['PUT', 'DELETE'])
def engineer_by_id(engineer_id):
    """
    PUT: Update engineer
    DELETE: Delete engineer
    """
    if request.method == 'PUT':
        try:
            updated_data = request.get_json()
            if not updated_data:
                return jsonify({"error": "No data provided"}), 400
            result = service.update(engineer_id, updated_data)
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to update engineer: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            result = service.delete(engineer_id)
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to delete engineer: {e}")
            return jsonify({"error": str(e)}), 500