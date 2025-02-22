import os
from google.cloud import texttospeech
from elevenlabs import generate, set_api_key
from dotenv import load_dotenv

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
            
        set_api_key(elevenlabs_api_key)
        audio = generate(
            text=text,
            voice="Josh",  # Can be customized
            model="eleven_monolingual_v1"
        )
        
        # TODO: Implement audio file storage and return URL
        return "audio_url_placeholder"
        
    except Exception as e:
        print(f"Error generating speech with ElevenLabs: {str(e)}")
        return generate_speech_google(text)  # Fallback to Google TTS

def generate_speech_google(text):
    """Generate speech using Google Cloud Text-to-Speech"""
    try:
        if not google_credentials:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS not found in environment variables")
            
        client = texttospeech.TextToSpeechClient()
        
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        
        # TODO: Implement audio file storage and return URL
        return "audio_url_placeholder"
        
    except Exception as e:
        print(f"Error generating speech with Google Cloud: {str(e)}")
        raise Exception("Failed to generate speech")
