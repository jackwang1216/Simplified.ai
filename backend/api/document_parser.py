from PyPDF2 import PdfReader
from docx import Document
import os
from PIL import Image
import io
from .vision import extract_text_from_image

def parse_document(file):
    """
    Parse different document formats and extract text.
    
    Args:
        file: File object from request
    
    Returns:
        str: Extracted text from document
    """
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.pdf'):
            return parse_pdf(file)
        elif filename.endswith('.docx'):
            return parse_docx(file)
        elif filename.endswith('.txt'):
            return parse_txt(file)
        else:
            raise ValueError("Unsupported file format")
            
    except Exception as e:
        print(f"Error parsing document: {str(e)}")
        raise Exception("Failed to parse document")

def parse_pdf(file):
    """Extract text from PDF file"""
    try:
        # First try to extract text directly
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text.strip():  # If we got some text
                text += page_text + "\n"
            else:  # If page has no text, it might be an image
                # Get the page as an image
                if '/XObject' in page['/Resources']:
                    x_objects = page['/Resources']['/XObject'].get_object()
                    for obj in x_objects:
                        if x_objects[obj]['/Subtype'] == '/Image':
                            # Extract image
                            image = x_objects[obj]
                            try:
                                image_data = image._data
                                # Use Azure Vision to extract text from image
                                image_text = extract_text_from_image(image_data)
                                text += image_text + "\n"
                            except Exception as e:
                                print(f"Error processing image in PDF: {str(e)}")
                                continue
        
        return text.strip()
        
    except Exception as e:
        raise Exception(f"Error parsing PDF: {str(e)}")

def parse_docx(file):
    """Extract text from DOCX file"""
    try:
        doc = Document(file)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error parsing DOCX: {str(e)}")

def parse_txt(file):
    """Extract text from TXT file"""
    try:
        text = file.read().decode('utf-8')
        return text.strip()
    except Exception as e:
        raise Exception(f"Error parsing TXT: {str(e)}")
