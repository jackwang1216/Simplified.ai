from PyPDF2 import PdfReader
from docx import Document
import os
from PIL import Image
import io
from pdf2image import convert_from_bytes
from .vision import extract_text_from_image

async def parse_document(file):
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
            return await parse_pdf(file)
        elif filename.endswith('.docx'):
            return await parse_docx(file)
        elif filename.endswith('.txt'):
            return await parse_txt(file)
        else:
            raise ValueError("Unsupported file format")
            
    except Exception as e:
        print(f"Error parsing document: {str(e)}")
        raise Exception("Failed to parse document")

async def parse_pdf(file):
    """Extract text from PDF file"""
    try:
        from pdf2image import convert_from_bytes
        import io
        
        print("Starting PDF processing...")
        
        # Read the PDF file into memory
        pdf_data = await file.read()
        file_stream = io.BytesIO(pdf_data)
        
        # First try to extract text directly
        reader = PdfReader(file_stream)
        text = ""
        
        for page_num, page in enumerate(reader.pages):
            print(f"Processing page {page_num + 1}...")
            
            page_text = page.extract_text()
            print(f"Direct text extraction result: {bool(page_text.strip())}")
            
            if page_text.strip():  # If we got some text
                text += page_text + "\n"
            else:  # If no text was extracted, convert page to image and use Azure Vision
                print("No text found, attempting image conversion...")
                try:
                    # Convert PDF page to image
                    print("Converting PDF to image...")
                    images = convert_from_bytes(pdf_data, first_page=page_num + 1, last_page=page_num + 1)
                    
                    if images:
                        print("Successfully converted to image, processing with Azure Vision...")
                        # Convert PIL Image to bytes
                        img_byte_arr = io.BytesIO()
                        images[0].save(img_byte_arr, format='PNG')
                        img_byte_arr = img_byte_arr.getvalue()
                        
                        # Use Azure Vision to extract text
                        image_text = extract_text_from_image(img_byte_arr)
                        print(f"Azure Vision extraction result: {bool(image_text)}")
                        
                        if image_text:
                            text += image_text + "\n"
                except Exception as e:
                    print(f"Error processing page {page_num + 1} as image: {str(e)}")
                    continue
        
        final_text = text.strip()
        print(f"Final extracted text length: {len(final_text)}")
        return final_text
        
    except Exception as e:
        print(f"Error parsing PDF: {str(e)}")
        raise Exception(f"Error parsing PDF: {str(e)}")

async def parse_docx(file):
    """Extract text from DOCX file"""
    try:
        content = await file.read()
        doc = Document(io.BytesIO(content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error parsing DOCX: {str(e)}")

async def parse_txt(file):
    """Extract text from TXT file"""
    try:
        content = await file.read()
        text = content.decode('utf-8')
        return text.strip()
    except Exception as e:
        raise Exception(f"Error parsing TXT: {str(e)}")
