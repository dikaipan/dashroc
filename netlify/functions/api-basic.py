import json
import csv
import os

def handler(event, context):
    """Basic Netlify function using only built-in modules"""
    
    # Get HTTP method and path
    http_method = event.get('httpMethod', 'GET')
    path = event.get('path', '')
    
    try:
        # Simple response for testing
        if '/machines' in path:
            # Try to read CSV with built-in csv module
            machines_data = []
            try:
                csv_path = os.path.join(os.path.dirname(__file__), 'data', 'data_mesin.csv')
                if os.path.exists(csv_path):
                    with open(csv_path, 'r', encoding='utf-8') as file:
                        reader = csv.DictReader(file)
                        machines_data = list(reader)[:10]  # Limit to 10 records for testing
            except Exception as e:
                print(f"CSV read error: {e}")
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'Machines API working',
                    'total_records': len(machines_data),
                    'data': machines_data
                })
            }
            
        elif '/engineers' in path:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'Engineers API working',
                    'method': http_method,
                    'path': path
                })
            }
            
        else:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'API is working',
                    'method': http_method,
                    'path': path,
                    'available_endpoints': ['/api/machines', '/api/engineers']
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Internal server error: {str(e)}'})
        }
