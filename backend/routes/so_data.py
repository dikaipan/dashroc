from flask import Blueprint, jsonify, request
from backend.services.so_service import SOService

so_bp = Blueprint('so_data', __name__)
service = SOService()

@so_bp.route('/so-data', methods=['GET'])
def get_so_data():
    """
    GET: Retrieve SO data with optional month filter
    Query params:
        months: Comma-separated list of months (e.g., "April,May,June")
    """
    try:
        months_param = request.args.get('months', None)
        months = None
        if months_param:
            months = [m.strip() for m in months_param.split(',')]
        
        data = service.get_resolution_times_by_engineer(months=months)
        return jsonify(data), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get SO data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error processing SO data: {str(e)}"}), 500

@so_bp.route('/so-data/raw', methods=['GET'])
def get_raw_so_data():
    """
    GET: Retrieve raw SO records
    Note: Month filter tidak digunakan karena field Month kosong di CSV
    Returns:
        List of raw SO records with all fields including customer, area_group, service_type
    """
    try:
        # Get all raw SO data (field Month kosong di CSV, jadi tidak bisa filter by month)
        all_data = service.get_all_so_data()
        
        return jsonify({'data': all_data, 'total': len(all_data)}), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get raw SO data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error processing raw SO data: {str(e)}"}), 500

@so_bp.route('/so-data/customer-intelligence', methods=['GET'])
def get_customer_intelligence():
    """
    GET: Retrieve customer intelligence data (aggregated by area_group)
    Returns:
        Aggregated data with customer and service_type info per area_group
    """
    try:
        data = service.get_customer_intelligence_data()
        return jsonify(data), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get customer intelligence data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error processing customer intelligence data: {str(e)}"}), 500

@so_bp.route('/so-data/engineer-customer-relationships', methods=['GET'])
def get_engineer_customer_relationships():
    """
    GET: Retrieve engineer-customer relationship data
    Returns:
        Engineer-customer matrix with SO counts, coverage stats, and risk analysis
    """
    try:
        data = service.get_engineer_customer_relationships()
        return jsonify(data), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get engineer-customer relationships: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error processing engineer-customer relationships: {str(e)}"}), 500

