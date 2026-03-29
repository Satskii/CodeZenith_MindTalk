# MindTalk Backend

Flask-based backend for the MindTalk mental health chat application.
Powered by Groq's free API for LLM (Llama 3.1 8B), STT (Whisper), and gTTS for text-to-speech.

## Tech Stack

- Python + Flask
- Groq API — `llama-3.1-8b-instant` (chat) + `whisper-large-v3-turbo` (STT)
- gTTS — text-to-speech (English, Hindi, Bengali)
- OpenAI-compatible SDK pointed at Groq's base URL
- In-memory session management with per-session chat history

## Project Structure

```
backend-MindTalk/
├── app.py                              # Flask app — all routes
├── requirements.txt
├── .env                                # API keys (never commit)
├── .env.example                        # Template
│
├── ai_module/
│   ├── config.py                       # Groq API key, model, limits, shared LANGUAGE_MAP
│   ├── response_generator.py           # Groq LLM call + JSON parsing + crisis detection
│   └── prompts/
│       ├── language_prompts.py         # PromptManager — multilingual system prompts + crisis handling
│       ├── behavior_prompt.txt         # Reference behavior guidelines
│       └── formatting_prompt.txt       # Reference formatting guidelines
│
├── stt_module/
│   ├── __init__.py
│   ├── config.py                       # STT model, base URL, default language
│   └── transcriber.py                  # Whisper transcription via Groq
│
└── tts_module/
    ├── __init__.py
    ├── config.py                       # TTS default language, speed setting
    └── synthesizer.py                  # gTTS speech synthesis → MP3 bytes
```

## Setup

**1. Install dependencies**
```bash
pip install -r requirements.txt
```

**2. Get a free Groq API key**

Sign up at [console.groq.com](https://console.groq.com) — free tier covers LLM + Whisper.

**3. Add your key to `.env`**
```
GROQ_API_KEY=your_groq_api_key_here
```

**4. Run the server**
```bash
python app.py
```

Server starts at `http://localhost:5000`

---

## API Endpoints

### `POST /chat`
Send a user message and get an AI response.

Request:
```json
{
  "message": "I'm feeling really stressed today",
  "language": "english",
  "session_id": "optional-existing-session-id"
}
```

Response:
```json
{
  "response": "That sounds really tough...",
  "session_id": "uuid",
  "language": "english",
  "messages_used": 3,
  "messages_remaining": 7
}
```

Returns `429` with `"error": "free_limit_reached"` when the session hits the free message limit.

---

### `POST /speak`
Convert text to speech using gTTS. Returns an MP3 audio stream.

Request:
```json
{
  "text": "That sounds really tough...",
  "language": "hindi"
}
```

Response: `audio/mpeg` binary stream

---

### `POST /transcribe`
Transcribe an audio recording using Groq Whisper.

Request: `multipart/form-data`
- `audio` — audio file (webm / wav / mp3)
- `language` — `english` / `hindi` / `bengali`

Response:
```json
{ "transcript": "मुझे बहुत तनाव हो रहा है" }
```

---

### `POST /session/reset`
Reset a session — clears history, memory, and message count.

Request:
```json
{ "session_id": "existing-uuid", "language": "english" }
```

Response:
```json
{ "message": "Session reset successfully", "session_id": "uuid" }
```

---

### `GET /session/status?session_id=<id>`
Check remaining messages for a session.

Response:
```json
{
  "session_id": "uuid",
  "messages_used": 3,
  "messages_remaining": 7,
  "limit": 10,
  "language": "english"
}
```

---

### `GET /health`
Basic health check.

Response:
```json
{ "status": "ok" }
```

---

## Configuration

### `ai_module/config.py`

| Variable | Default | Description |
|---|---|---|
| `GROQ_API_KEY` | from `.env` | Groq API key (used by LLM + STT) |
| `AI_MODEL` | `llama-3.1-8b-instant` | LLM model |
| `TEMPERATURE` | `0.7` | Response creativity |
| `MAX_TOKENS` | `512` | Max tokens per LLM response |
| `FREE_CHAT_LIMIT` | `10` | Messages allowed per session |
| `LANGUAGE_MAP` | `{english: en, ...}` | Shared language code map |

### `stt_module/config.py`

| Variable | Default | Description |
|---|---|---|
| `STT_MODEL` | `whisper-large-v3-turbo` | Whisper model via Groq |
| `STT_BASE_URL` | Groq endpoint | API base URL |
| `STT_DEFAULT_LANGUAGE` | `english` | Fallback language |

### `tts_module/config.py`

| Variable | Default | Description |
|---|---|---|
| `TTS_DEFAULT_LANGUAGE` | `english` | Fallback language |
| `TTS_SLOW` | `False` | Slower speech for clarity |

## Supported Languages

| Language | Code | LLM | STT | TTS |
|---|---|---|---|---|
| English | `english` | ✅ | ✅ | ✅ |
| Hindi | `hindi` | ✅ | ✅ | ✅ |
| Bengali | `bengali` | ✅ | ✅ | ✅ |

## Notes

- Session data is stored in-memory — resets when the server restarts.
- Conversation history is capped at the last 20 messages per session to stay within token limits.
- Crisis keywords are detected before hitting the LLM — a pre-written safe response is returned immediately.
- The same `GROQ_API_KEY` is used for both LLM and Whisper STT — no extra keys needed.
