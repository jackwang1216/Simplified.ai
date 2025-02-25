import os
from google.cloud import texttospeech
import elevenlabs
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Get API keys from environment variables
elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

def generate_speech(text):
    """
    Generate speech from text using either Google Cloud TTS or ElevenLabs.
    Falls back to Google Cloud TTS if ElevenLabs API key is not available.
    
    Args:
        text (str): Text to convert to speech
    
    Returns:
        str: URL to the generated audio file
    """
    if not elevenlabs_api_key and not google_credentials:
        raise ValueError("Neither ELEVENLABS_API_KEY nor GOOGLE_APPLICATION_CREDENTIALS found in environment variables")
    
    if elevenlabs_api_key:
        return generate_speech_elevenlabs(text)
    else:
        return generate_speech_google(text)

def generate_speech_elevenlabs(text):
    """Generate speech using ElevenLabs API"""
    try:
        if not elevenlabs_api_key:
            raise ValueError("ELEVENLABS_API_KEY not found in environment variables")
            
        elevenlabs.set_api_key(elevenlabs_api_key)
        
        # Use voice ID for Rachel
        voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice ID
        
        audio = elevenlabs.generate(
            text=text,
            voice=voice_id,
            model="eleven_monolingual_v1"
        )
        
        # Create output directory if it doesn't exist
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'audio')
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate unique filename
        filename = f"speech_{hash(text)}.mp3"
        filepath = os.path.join(output_dir, filename)
        
        # Save audio file
        with open(filepath, 'wb') as f:
            f.write(audio)
        
        # Return relative URL path to the audio file
        return f"/static/audio/{filename}"
        
    except Exception as e:
        print(f"Error generating speech with ElevenLabs: {str(e)}")
        return generate_speech_google(text)  # Fallback to Google TTS

def generate_speech_google(text):
    """Generate speech using Google Cloud Text-to-Speech"""
    try:
        if not google_credentials:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS not found in environment variables")
            
        # Initialize the client
        client = texttospeech.TextToSpeechClient()
        
        # Set the text input to be synthesized
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        # Build the voice request
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Standard-C",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        
        # Select the type of audio file
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        
        # Perform the text-to-speech request
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        
        # TODO: Implement audio file storage and return URL
        return "audio_url_placeholder"
        
    except Exception as e:
        print(f"Error generating speech with Google Cloud TTS: {str(e)}")
        raise
