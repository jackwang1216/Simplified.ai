from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.simplification import simplify_text
from api.document_parser import parse_document
from api.text_to_speech import generate_speech
from api.question_answering import answer_question
from utils.error_handler import handle_error
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimplifyRequest(BaseModel):
    text: str
    reading_level: Optional[str] = "intermediate"

class QuestionRequest(BaseModel):
    question: str
    context: str

@app.get("/api/test")
async def test():
    return {"status": "ok", "message": "Backend server is running"}

@app.post("/api/simplify")
async def simplify(request: SimplifyRequest):
    try:
        simplified = simplify_text(request.text, request.reading_level)
        return {"simplified_text": simplified}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload(
    file: UploadFile = File(...),
    reading_level: str = Form("intermediate")
):
    try:
        contents = await file.read()
        # Create a temporary file-like object
        from io import BytesIO
        file_obj = BytesIO(contents)
        file_obj.filename = file.filename  # Add filename attribute for compatibility
        
        # Parse the document
        original_text = parse_document(file_obj)
        
        # Simplify the text
        simplified_text = simplify_text(original_text, reading_level)
        
        return {
            "original_text": original_text,
            "simplified_text": simplified_text
        }
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/question")
async def question(request: QuestionRequest):
    try:
        answer = answer_question(request.question, request.context)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
