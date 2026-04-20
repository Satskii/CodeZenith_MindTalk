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
    lang_code = LANGUAGE_MAP.get(language.lower(), "en")
    audio_bytes = await upload_file.read()

    transcription = client.audio.transcriptions.create(
        model=STT_MODEL,
        file=(upload_file.filename or "audio.webm", audio_bytes, upload_file.content_type),
        language=lang_code,
        response_format="text",
    )

    return transcription.strip() if isinstance(transcription, str) else transcription.text.strip()
