from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

def answer_question(question: str, context: str) -> str:
    """
    Answer a question about the given context using GPT-4.
    
    Args:
        question (str): The question to answer
        context (str): The context to use for answering the question
        
    Returns:
        str: The answer to the question
    """
    try:
        # Create a system message that instructs the model to focus on the context
        system_message = """You are a helpful assistant that answers questions about documents. 
        Only use the provided context to answer questions. If you cannot answer the question 
        based on the context alone, say so."""
        
        # Create the conversation with the context and question
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Error answering question: {str(e)}")
        raise Exception("Failed to get answer")
