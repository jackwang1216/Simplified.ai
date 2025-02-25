from fastapi import HTTPException
from fastapi.responses import JSONResponse

def handle_error(error):
    """
    Standardized error handling for API endpoints
    
    Args:
        error: Exception object
    
    Returns:
        JSONResponse: JSON response with error details
    """
    if isinstance(error, ValueError):
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid input", "message": str(error)}
        )
        
    elif isinstance(error, FileNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"error": "File not found", "message": str(error)}
        )
        
    elif isinstance(error, HTTPException):
        return JSONResponse(
            status_code=error.status_code,
            content={"error": error.detail}
        )
        
    else:
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "message": str(error)}
        )
