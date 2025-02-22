from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def answer_question(question: str, context: str) -> str:
    """
    Answer a question about the given context using OpenAI's GPT model.
    
    Args:
        question (str): The question to answer
        context (str): The context to answer the question from
        
    Returns:
        str: The answer to the question
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant that answers questions about text. Use the provided context to answer questions accurately and concisely."},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error in question answering: {str(e)}")
        raise Exception("Failed to answer question")
