from flask import Blueprint, jsonify, request
from backend.services.machine_service import MachineService

machine_bp = Blueprint('machines', __name__)
service = MachineService()

@machine_bp.route('/machines', methods=['GET', 'POST'])
def machines():
    """
    GET: Retrieve all machines
    POST: Create new machine
    """
    if request.method == 'GET':
        try:
            data = service.get_all()
            return jsonify(data), 200
        except FileNotFoundError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to get machines: {e}")
            return jsonify({"error": "Internal server error processing machine data"}), 500
    
    elif request.method == 'POST':
        try:
            new_machine = request.get_json()
            if not new_machine:
                return jsonify({"error": "No data provided"}), 400
            result = service.create(new_machine)
            return jsonify(result), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except PermissionError as e:
            print(f"[ERROR] Permission denied when creating machine: {e}")
            return jsonify({"error": f"Tidak dapat menyimpan data. Pastikan file CSV tidak sedang dibuka di aplikasi lain (Excel, Notepad, dll). Detail: {str(e)}"}), 403
        except IOError as e:
            print(f"[ERROR] IO error when creating machine: {e}")
            return jsonify({"error": f"Tidak dapat menulis ke file. Pastikan file CSV tidak sedang dibuka dan Anda memiliki permission untuk menulis. Detail: {str(e)}"}), 500
        except Exception as e:
            print(f"[ERROR] Failed to create machine: {e}")
            error_msg = str(e)
            if "Permission denied" in error_msg or "Errno 13" in error_msg:
                return jsonify({"error": "Tidak dapat menyimpan data. Pastikan file 'data_mesin.csv' tidak sedang dibuka di aplikasi lain (Excel, Notepad, dll) dan tutup aplikasi tersebut terlebih dahulu."}), 403
            return jsonify({"error": error_msg}), 500

@machine_bp.route('/machines/<wsid>', methods=['GET', 'PUT', 'DELETE'])
def machine_by_id(wsid):
    """
    GET: Get specific machine
    PUT: Update machine
    DELETE: Delete machine
    """
    if request.method == 'GET':
        try:
            data = service.get_by_id(wsid)
            return jsonify(data), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'PUT':
        try:
            updated_machine = request.get_json()
            if not updated_machine:
                return jsonify({"error": "No data provided"}), 400
            result = service.update(wsid, updated_machine)
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to update machine: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            result = service.delete(wsid)
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            print(f"[ERROR] Failed to delete machine: {e}")
            return jsonify({"error": str(e)}), 500

@machine_bp.route('/machines/stats', methods=['GET'])
def machine_stats():
    """Get machine statistics"""
    try:
        stats = service.get_statistics()
        return jsonify(stats), 200
    except Exception as e:
        print(f"[ERROR] Failed to get machine stats: {e}")
        return jsonify({"error": str(e)}), 500