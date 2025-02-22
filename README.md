# simplified.ai

An AI-powered accessibility tool that simplifies complex documents for better understanding.

## Features

- Document simplification with multiple reading levels
- Support for PDF, DOCX, and TXT files
- Text-to-speech functionality
- Multi-language support
- Interactive Q&A with AI
- Privacy-focused processing
- Export options (PDF, TXT, Email)

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Flask/FastAPI
- AI: OpenAI GPT-4 Turbo
- Document Parsing: PDF.js
- Text-to-Speech: Google TTS/ElevenLabs

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm (Node package manager)

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
GOOGLE_APPLICATION_CREDENTIALS=path_to_google_credentials.json
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

1. Visit the landing page
2. Click "Simplify Now!"
3. Upload a document or paste text
4. Choose simplification options
5. View the simplified version
6. Use additional features like text-to-speech or Q&A
7. Export or share the simplified document

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
