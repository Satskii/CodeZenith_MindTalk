from fastapi import UploadFile
from openai import OpenAI
from stt_module.config import GROQ_API_KEY, STT_BASE_URL, STT_MODEL, STT_DEFAULT_LANGUAGE
from ai_module.config import LANGUAGE_MAP

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url=STT_BASE_URL,
)


async def transcribe_audio(upload_file: UploadFile, language: str = STT_DEFAULT_LANGUAGE) -> str:
    """
    Transcribes audio using Groq's Whisper endpoint.
    upload_file: FastAPI UploadFile from request
    Returns the transcribed text string.
    """
    print(f"[STT] transcribe_audio called: file={upload_file.filename}, language={language}")
    
    lang_code = LANGUAGE_MAP.get(language.lower(), "en")
    print(f"[STT] Mapped language '{language}' -> '{lang_code}'")
    
    try:
        audio_bytes = await upload_file.read()
        print(f"[STT] Read {len(audio_bytes)} bytes from upload file")
        
        print(f"[STT] Calling Groq API with model={STT_MODEL}, language={lang_code}")
        transcription = client.audio.transcriptions.create(
            model=STT_MODEL,
            file=(upload_file.filename or "audio.webm", audio_bytes, upload_file.content_type),
            language=lang_code,
            response_format="text",
        )
        
        result = transcription.strip() if isinstance(transcription, str) else transcription.text.strip()
        print(f"[STT] Groq returned: {len(result)} chars")
        return result
        
    except Exception as e:
        print(f"[STT] ❌ Error in transcribe_audio: {type(e).__name__}: {e}")
        import traceback
        print(f"[STT] Traceback: {traceback.format_exc()}")
        raise
