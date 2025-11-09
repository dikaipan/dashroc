from flask import Blueprint, jsonify, request
from backend.services.stock_service import StockPartService

stock_part_bp = Blueprint('stock_parts', __name__)
service = StockPartService()

@stock_part_bp.route('/stock-parts', methods=['GET', 'POST'])
def stock_parts():
    """
    GET: Retrieve all stock parts with optional filtering and pagination
    POST: Create new stock part
    """
    if request.method == 'GET':
        try:
            # Get query parameters
            page = request.args.get('page', type=int)
            per_page = request.args.get('per_page', type=int)
            search = request.args.get('search', '')
            fsl = request.args.get('fsl', '')
            region = request.args.get('region', '')
            
            # Get all data
            data = service.get_all()
            
            # Apply filters
            if search:
                from backend.utils.helpers import search_dict_list
                data = search_dict_list(data, search, ['part_number', 'part_name', 'fsl'])
            
            if fsl:
                data = [item for item in data if item.get('fsl') == fsl]
            
            if region:
                data = [item for item in data if item.get('region') == region]
            
            # Apply pagination if requested
            if page and per_page:
                from backend.utils.helpers import paginate
                result = paginate(data, page, per_page)
                return jsonify(result), 200
            
            return jsonify(data), 200
            
        except FileNotFoundError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to get stock parts: {e}")
            return jsonify({"error": "Internal server error"}), 500
    
    elif request.method == 'POST':
        try:
            new_part = request.get_json()
            if not new_part:
                return jsonify({"error": "No data provided"}), 400
            result = service.create(new_part)
            return jsonify(result), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"[ERROR] Failed to create stock part: {e}")
            return jsonify({"error": str(e)}), 500

@stock_part_bp.route('/stock-parts/<part_number>', methods=['GET', 'PUT', 'DELETE'])
def stock_part_by_number(part_number):
    """
    GET: Get specific stock part by part number
    PUT: Update stock part
    DELETE: Delete stock part
    """
    if request.method == 'GET':
        try:
            data = service.get_by_id(part_number)
            return jsonify(data), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'PUT':
        try:
            updated_part = request.get_json()
            if not updated_part:
                return jsonify({"error": "No data provided"}), 400
            result = service.update(part_number, updated_part)
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to update stock part: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            result = service.delete(part_number)
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to delete stock part: {e}")
            return jsonify({"error": str(e)}), 500

@stock_part_bp.route('/stock-parts/bulk-upsert', methods=['POST'])
def bulk_upsert_stock_parts():
    """
    Bulk insert or update stock parts (untuk CSV import)
    """
    try:
        parts_data = request.get_json()
        
        if not isinstance(parts_data, list):
            return jsonify({"error": "Data must be an array of stock parts"}), 400
        
        result = service.bulk_upsert(parts_data)
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"[ERROR] Bulk upsert failed: {e}")
        return jsonify({"error": str(e)}), 500

@stock_part_bp.route('/stock-parts/stats', methods=['GET'])
def stock_part_stats():
    """
    Get stock part statistics
    - Total parts
    - Parts by FSL
    - Parts by region
    - Low stock alerts
    """
    try:
        stats = service.get_statistics()
        return jsonify(stats), 200
    except Exception as e:
        print(f"[ERROR] Failed to get stock part stats: {e}")
        return jsonify({"error": str(e)}), 500

@stock_part_bp.route('/stock-parts/low-stock', methods=['GET'])
def low_stock_parts():
    """
    Get parts with low stock (below threshold)
    """
    try:
        threshold = request.args.get('threshold', 10, type=int)
        low_stock = service.get_low_stock_parts(threshold)
        return jsonify(low_stock), 200
    except Exception as e:
        print(f"[ERROR] Failed to get low stock parts: {e}")
        return jsonify({"error": str(e)}), 500

@stock_part_bp.route('/stock-parts/by-fsl/<fsl_name>', methods=['GET'])
def stock_parts_by_fsl(fsl_name):
    """
    Get all stock parts for specific FSL
    """
    try:
        parts = service.get_by_fsl(fsl_name)
        return jsonify(parts), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Failed to get parts by FSL: {e}")
        return jsonify({"error": str(e)}), 500