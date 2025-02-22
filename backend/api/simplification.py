import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

def simplify_text(text, reading_level):
    """
    Simplify text using OpenAI's GPT-4 model.
    
    Args:
        text (str): Original text to simplify
        reading_level (str): Desired reading level (beginner, intermediate, expert)
    
    Returns:
        str: Simplified text
    """
    level_prompts = {
        'beginner': 'Simplify this text for a grade school student. Use simple words and short sentences.',
        'intermediate': 'Simplify this text for a high school student. Balance clarity with some technical terms.',
        'expert': 'Maintain technical accuracy while making the text more readable for a college-educated audience.'
    }
    
    prompt = level_prompts.get(reading_level, level_prompts['intermediate'])
    
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error in simplification: {str(e)}")
        raise Exception("Failed to simplify text")
