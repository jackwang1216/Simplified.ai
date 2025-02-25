import os
from openai import OpenAI
from dotenv import load_dotenv
import json
from typing import Tuple, List, Optional
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

class GlossaryItem(BaseModel):
    word: str
    definition: str
    examples: Optional[str] = None

def simplify_text(text: str, reading_level: str, generate_glossary: bool = False) -> Tuple[str, Optional[List[GlossaryItem]]]:
    """
    Simplify text using OpenAI's GPT-4 model and optionally generate a glossary.
    
    Args:
        text (str): Original text to simplify
        reading_level (str): Desired reading level (beginner, intermediate, expert)
        generate_glossary (bool): Whether to generate a glossary of complex terms
    
    Returns:
        Tuple[str, Optional[List[GlossaryItem]]]: Simplified text and optional glossary
    """
    level_prompts = {
        'beginner': 'Simplify this text for a grade school student. Use simple words and short sentences.',
        'intermediate': 'Simplify this text for a high school student. Balance clarity with some technical terms.',
        'expert': 'Maintain technical accuracy while making the text more readable for a college-educated audience.'
    }
    
    prompt = level_prompts.get(reading_level, level_prompts['intermediate'])
    
    try:
        # First, get the simplified text
        simplification_response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        simplified_text = simplification_response.choices[0].message.content

        # If glossary is not needed, return early
        if not generate_glossary:
            return simplified_text, None

        # Generate glossary for complex terms
        glossary_prompt = """
        Analyze the original text and the simplified version, then create a glossary of complex terms.
        For each complex term:
        1. Provide a simple definition
        2. Include a brief example of usage (if relevant)
        
        Return the glossary as a JSON array with this structure:
        [
            {
                "word": "complex_term",
                "definition": "simple explanation",
                "examples": "example usage (optional)"
            }
        ]
        
        Include only truly complex terms that would benefit from explanation.
        Original text:
        {original_text}
        
        Simplified text:
        {simplified_text}
        """.format(original_text=text, simplified_text=simplified_text)

        glossary_response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates glossaries. Always respond with valid JSON."},
                {"role": "user", "content": glossary_prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )

        # Parse the glossary JSON response
        try:
            glossary_text = glossary_response.choices[0].message.content
            # Clean up the response to ensure it's valid JSON
            glossary_text = glossary_text.strip()
            if glossary_text.startswith('```json'):
                glossary_text = glossary_text[7:-3]  # Remove ```json and ``` markers
            glossary_items = json.loads(glossary_text)
            
            # Convert to GlossaryItem objects
            glossary = [GlossaryItem(**item) for item in glossary_items]
            return simplified_text, glossary

        except json.JSONDecodeError as e:
            print(f"Error parsing glossary JSON: {str(e)}")
            return simplified_text, None
            
    except Exception as e:
        print(f"Error in simplification: {str(e)}")
        raise Exception("Failed to simplify text")
