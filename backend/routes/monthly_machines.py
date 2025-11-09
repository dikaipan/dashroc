from flask import Blueprint, jsonify
from backend.services.monthly_machine_service import MonthlyMachineService

monthly_machine_bp = Blueprint('monthly_machines', __name__)
service = MonthlyMachineService()

@monthly_machine_bp.route('/monthly-machines', methods=['GET'])
def get_monthly_machines():
    """
    GET: Retrieve all monthly machine activation data
    """
    try:
        data = service.get_all_monthly_data()
        return jsonify({"rows": data}), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get monthly machines: {e}")
        return jsonify({"error": "Internal server error processing monthly machine data"}), 500