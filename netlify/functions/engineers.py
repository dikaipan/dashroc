import json
import os
import sys
from typing import Dict, Any

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from services.engineer_service import EngineerService

def handler(event, context):
    """Netlify function for engineers API"""
    
    # Get HTTP method and path
    http_method = event.get('httpMethod', 'GET')
    path = event.get('path', '')
    
    # Parse query parameters
    query_params = event.get('queryStringParameters', {}) or {}
    
    # Parse body for POST/PUT requests
    body = None
    if http_method in ['POST', 'PUT']:
        try:
            body = json.loads(event.get('body', '{}'))
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid JSON in request body'})
            }
    
    service = EngineerService()
    
    try:
        if path.endswith('/engineers') and http_method == 'GET':
            data = service.get_all()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(data)
            }
            
        elif path.endswith('/engineers') and http_method == 'POST':
            if not body:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'No data provided'})
                }
            result = service.create(body)
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(result)
            }
            
        elif '/engineers/' in path and http_method == 'PUT':
            engineer_id = path.split('/engineers/')[-1]
            if not body:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'No data provided'})
                }
            result = service.update(engineer_id, body)
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(result)
            }
            
        elif '/engineers/' in path and http_method == 'DELETE':
            engineer_id = path.split('/engineers/')[-1]
            result = service.delete(engineer_id)
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(result)
            }
            
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Endpoint not found'})
            }
            
    except FileNotFoundError as e:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
    except ValueError as e:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Internal server error'})
        }
