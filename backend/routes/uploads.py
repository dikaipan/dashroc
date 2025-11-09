from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename
from backend.services.upload_service import UploadService
import os

upload_bp = Blueprint('uploads', __name__)
service = UploadService()

ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload():
    """Upload CSV file"""
    if 'file' not in request.files or 'target' not in request.form:
        return jsonify({"error": "file and target required"}), 400
    
    file = request.files['file']
    target = request.form['target']
    
    if file.filename == '':
        return jsonify({"error": "empty filename"}), 400
    
    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        return jsonify({"error": "only csv allowed"}), 400
    
    if target not in ('machines', 'engineers', 'stock-parts'):
        return jsonify({"error": "target must be machines, engineers, or stock-parts"}), 400
    
    try:
        result = service.upload_csv(file, target)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"[ERROR] File upload failed: {e}")
        return jsonify({"error": str(e)}), 500

@upload_bp.route('/export', methods=['GET'])
def export():
    """Export data to Excel"""
    try:
        excel_file = service.export_to_excel()
        return send_file(
            excel_file,
            download_name="summary_export.xlsx",
            as_attachment=True,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        print(f"[ERROR] Export failed: {e}")
        return jsonify({"error": str(e)}), 500