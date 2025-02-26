from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
from api.simplification import simplify_text
from api.text_to_speech import generate_speech
from api.document_parser import parse_document
from api.question import answer_question
import PyPDF2
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for serving audio files
app.mount("/static", StaticFiles(directory="static"), name="static")

class SimplificationRequest(BaseModel):
    text: str
    reading_level: str
    text_to_speech: Optional[bool] = False

class SimplificationResponse(BaseModel):
    simplified_text: str
    original_text: Optional[str] = None
    audio_url: Optional[str] = None

@app.get("/api/test")
async def test():
    return {"status": "ok", "message": "Backend server is running"}

@app.post("/api/simplify", response_model=SimplificationResponse)
async def simplify(request: SimplificationRequest):
    try:
        simplified = simplify_text(
            request.text,
            request.reading_level,
        )
        
        # Generate audio if text-to-speech is requested
        audio_url = None
        if request.text_to_speech:
            audio_url = generate_speech(simplified)
        
        return SimplificationResponse(
            simplified_text=simplified,
            original_text=request.text,
            audio_url=audio_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload(
    file: UploadFile = File(...),
    reading_level: str = Form(...),
    text_to_speech: bool = Form(False)
) -> SimplificationResponse:
    try:
        # Pass the file directly to the document parser
        text = await parse_document(file)
        
        if not text.strip():
            raise Exception("No text could be extracted from the document")
            
        simplified_text = simplify_text(
            text,
            reading_level,
        )
        
        # Generate audio if text-to-speech is requested
        audio_url = None
        if text_to_speech:
            audio_url = generate_speech(simplified_text)
        
        return SimplificationResponse(
            simplified_text=simplified_text,
            original_text=text,
            audio_url=audio_url
        )
    except Exception as e:
        print(f"Error processing upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-pdf")
async def generate_pdf(request: SimplificationRequest):
    try:
        # Create a bytes buffer for the PDF
        buffer = io.BytesIO()
        
        # Create the PDF document
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        
        # Add title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, "Simplified Document")
        
        # Add original and simplified text
        y_position = height - 100
        text_width = width - 100  # Margins on both sides
        
        c.setFont("Helvetica", 12)
        
        # Write the simplified text
        c.drawString(50, y_position, "Simplified Text:")
        y_position -= 30
        
        # Split text into lines that fit the page width
        words = request.text.split()
        line = []
        for word in words:
            line.append(word)
            if c.stringWidth(" ".join(line), "Helvetica", 12) > text_width:
                line.pop()  # Remove last word that made line too long
                c.drawString(50, y_position, " ".join(line))
                y_position -= 20
                line = [word]  # Start new line with the word that didn't fit
                
                # Check if we need a new page
                if y_position < 50:
                    c.showPage()
                    y_position = height - 50
                    c.setFont("Helvetica", 12)
        
        # Write any remaining text
        if line:
            c.drawString(50, y_position, " ".join(line))
        
        c.save()
        
        # Get the value from the buffer
        pdf_value = buffer.getvalue()
        buffer.close()
        
        # Return the PDF
        return Response(
            content=pdf_value,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment;filename=simplified-document.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/question")
async def question(request: dict):
    """
    Answer a question about the provided context.
    
    Args:
        request (dict): Dictionary containing:
            - question (str): The question to answer
            - context (str): The context to use for answering
            
    Returns:
        dict: Dictionary containing the answer
    """
    try:
        if "question" not in request or "context" not in request:
            raise HTTPException(
                status_code=400,
                detail="Request must include both 'question' and 'context'"
            )
            
        answer = answer_question(request["question"], request["context"])
        return {"answer": answer}
    except Exception as e:
        print(f"Error in question endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
