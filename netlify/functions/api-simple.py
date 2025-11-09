import json
import os
import sys

def handler(event, context):
    """Netlify function handler for API requests"""
    
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
    
    try:
        # Simple response for testing
        if '/machines' in path:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'Machines API working',
                    'method': http_method,
                    'path': path,
                    'data': []
                })
            }
        elif '/engineers' in path:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'Engineers API working',
                    'method': http_method,
                    'path': path,
                    'data': []
                })
            }
        else:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'API is working',
                    'method': http_method,
                    'path': path
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Internal server error: {str(e)}'})
        }
