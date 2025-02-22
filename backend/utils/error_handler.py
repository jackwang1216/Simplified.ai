from flask import jsonify

def handle_error(error):
    """
    Standardized error handling for API endpoints
    
    Args:
        error: Exception object
    
    Returns:
        tuple: (JSON response, HTTP status code)
    """
    error_message = str(error)
    
    if isinstance(error, ValueError):
        return jsonify({
            'error': 'Invalid input',
            'message': error_message
        }), 400
        
    elif isinstance(error, FileNotFoundError):
        return jsonify({
            'error': 'File not found',
            'message': error_message
        }), 404
        
    else:
        return jsonify({
            'error': 'Internal server error',
            'message': error_message
        }), 500
