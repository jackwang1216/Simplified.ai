import os
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
from PIL import Image
import io
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Azure credentials
AZURE_VISION_KEY = os.getenv('AZURE_VISION_KEY')
AZURE_VISION_ENDPOINT = os.getenv('AZURE_VISION_ENDPOINT')

if not AZURE_VISION_KEY or not AZURE_VISION_ENDPOINT:
    raise ValueError("Azure Vision credentials not found in environment variables")

# Initialize Azure client
try:
    vision_client = ComputerVisionClient(
        AZURE_VISION_ENDPOINT,
        CognitiveServicesCredentials(AZURE_VISION_KEY)
    )
    # Test the client
    vision_client.list_models()  # This will fail early if credentials are wrong
    print("Azure Vision client initialized successfully")
except Exception as e:
    print(f"Failed to initialize Azure Vision client: {str(e)}")
    raise Exception(f"Azure Vision initialization failed: {str(e)}")

def extract_text_from_image(image_data):
    """
    Extract text from an image using Azure Computer Vision.
    
    Args:
        image_data (bytes): Image data in bytes
        
    Returns:
        str: Extracted text from the image
    """
    try:
        print("Starting Azure Vision processing...")
        
        # Read the image
        image_stream = io.BytesIO(image_data)
        
        # Call API with the image and extract text
        print("Calling Azure Vision API...")
        read_response = vision_client.read_in_stream(image_stream, raw=True)
        
        # Get the operation location (URL with an ID at the end)
        read_operation_location = read_response.headers["Operation-Location"]
        operation_id = read_operation_location.split("/")[-1]
        print(f"Got operation ID: {operation_id}")

        # Wait for the operation to complete
        attempts = 0
        while True:
            read_result = vision_client.get_read_result(operation_id)
            print(f"Operation status: {read_result.status}")
            
            if read_result.status not in ['notStarted', 'running']:
                break
                
            attempts += 1
            if attempts > 30:  # Timeout after 30 seconds
                raise Exception("Azure Vision operation timed out")
                
            time.sleep(1)

        # Extract the text
        if read_result.status == OperationStatusCodes.succeeded:
            text = ""
            for text_result in read_result.analyze_result.read_results:
                for line in text_result.lines:
                    text += line.text + "\n"
            print(f"Successfully extracted text, length: {len(text)}")
            return text.strip()
        else:
            print(f"Azure Vision operation failed with status: {read_result.status}")
            raise Exception("Failed to extract text from image")

    except Exception as e:
        print(f"Error in Azure Vision text extraction: {str(e)}")
        raise Exception(f"Failed to process image: {str(e)}")
