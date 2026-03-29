from openai import OpenAI
from stt_module.config import GROQ_API_KEY, STT_BASE_URL, STT_MODEL, STT_DEFAULT_LANGUAGE
from ai_module.config import LANGUAGE_MAP

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url=STT_BASE_URL,
)


def transcribe_audio(file_storage, language: str = STT_DEFAULT_LANGUAGE) -> str:
    """
    Transcribes audio using Groq's Whisper endpoint.
    file_storage: Flask FileStorage object from request.files
    Returns the transcribed text string.
    """
    lang_code = LANGUAGE_MAP.get(language.lower(), "en")

    transcription = client.audio.transcriptions.create(
        model=STT_MODEL,
        file=(file_storage.filename or "audio.webm", file_storage.stream, file_storage.mimetype),
        language=lang_code,
        response_format="text",
    )

    return transcription.strip() if isinstance(transcription, str) else transcription.text.strip()
