import os
from dotenv import load_dotenv
from ai_module.config import LANGUAGE_MAP

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
STT_BASE_URL = "https://api.groq.com/openai/v1"
STT_MODEL = "whisper-large-v3-turbo"
STT_DEFAULT_LANGUAGE = "english"
