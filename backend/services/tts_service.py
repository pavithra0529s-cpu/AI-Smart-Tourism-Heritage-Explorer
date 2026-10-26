# services/tts_service.py

from gtts import gTTS
import os
import uuid

def text_to_speech(text):
    tts = gTTS(text)
    filename = f"static/{uuid.uuid4()}.mp3"
    os.makedirs('static', exist_ok=True)
    tts.save(filename)
    return f"/{filename}"

