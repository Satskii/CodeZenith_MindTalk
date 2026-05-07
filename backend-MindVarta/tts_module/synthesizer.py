import io
from gtts import gTTS
from tts_module.config import TTS_DEFAULT_LANGUAGE, TTS_SLOW
from ai_module.config import LANGUAGE_MAP


def synthesize_speech(text: str, language: str = TTS_DEFAULT_LANGUAGE) -> bytes:
    """
    Converts text to speech using gTTS.
    Returns MP3 audio as bytes.
    """
    lang_code = LANGUAGE_MAP.get(language.lower(), "en")
    tts = gTTS(text=text, lang=lang_code, slow=TTS_SLOW)
    buf = io.BytesIO()
    tts.write_to_fp(buf)
    buf.seek(0)
    return buf.read()
