from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from api.simplification import simplify_text
import PyPDF2
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimplificationRequest(BaseModel):
    text: str
    reading_level: str
    text_to_speech: Optional[bool] = False

class SimplificationResponse(BaseModel):
    simplified_text: str
    original_text: Optional[str] = None

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
        
        return SimplificationResponse(
            simplified_text=simplified,
            original_text=request.text
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
        content = await file.read()
        
        if file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        else:
            text = content.decode()
        
        simplified_text = simplify_text(
            text,
            reading_level,
        )
        
        return SimplificationResponse(
            simplified_text=simplified_text,
            original_text=text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/question")
async def question(request: dict):
    try:
        answer = answer_question(request["question"], request["context"])
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
