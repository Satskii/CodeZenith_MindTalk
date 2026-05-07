# MindTalk Backend

FastAPI-based backend for the MindTalk mental health chat application.
Powered by Groq API for LLM (Llama 3.1 8B) and STT (Whisper), gTTS for text-to-speech, and PostgreSQL (Aiven) for persistent storage.

## Tech Stack

- Python + FastAPI + Uvicorn
- Groq API — `llama-3.1-8b-instant` (chat) + `whisper-large-v3-turbo` (STT)
- gTTS — text-to-speech (English, Hindi, Bengali)
- PostgreSQL (Aiven) — persistent session and chat history storage
- psycopg2 — PostgreSQL driver with connection pooling
- In-memory fallback — app runs without DB if connection fails

## Project Structure

```
backend-MindTalk/
├── app.py                              # FastAPI app — all routes + lifespan
├── requirements.txt
├── .env                                # API keys + DB credentials (never commit)
├── .env.example                        # Template
│
├── ai_module/
│   ├── config.py                       # Groq key, model settings, shared LANGUAGE_MAP
│   ├── response_generator.py           # Groq LLM call + JSON parsing + crisis detection
│   └── prompts/
│       ├── language_prompts.py         # PromptManagerV2 — multilingual prompts + crisis handling
│       ├── behavior_prompt.txt         # Reference behavior guidelines
│       └── formatting_prompt.txt       # Reference formatting guidelines
│
├── stt_module/
│   ├── __init__.py
│   ├── config.py                       # STT model, base URL, default language
│   └── transcriber.py                  # Whisper transcription via Groq (async)
│
├── tts_module/
│   ├── __init__.py
│   ├── config.py                       # TTS default language, speed setting
│   └── synthesizer.py                  # gTTS speech synthesis → MP3 bytes
│
└── database/
    ├── __init__.py
    ├── config.py                       # DB credentials from .env, builds DSN string
    ├── connection.py                   # ThreadedConnectionPool (min 1, max 10)
    ├── models.py                       # SQL CREATE TABLE statements
    ├── init_db.py                      # Runs on startup, creates tables if missing
    └── repository.py                   # All DB operations + in-memory fallback
```

## Setup

**1. Install dependencies**
```bash
pip install -r requirements.txt
```

**2. Get a free Groq API key**

Sign up at [console.groq.com](https://console.groq.com) — free tier covers LLM + Whisper.

**3. Set up PostgreSQL on Aiven**

Sign up at [aiven.io](https://aiven.io) and create a free PostgreSQL service.
Go to your service → Overview tab → Allowed IP addresses → add `0.0.0.0/0` for development.

**4. Configure `.env`**
```
GROQ_API_KEY=your_groq_api_key_here

DB_HOST=your_aiven_host
DB_PORT=16385
DB_NAME=mind_talk_db
DB_USER=avnadmin
DB_PASSWORD=your_db_password
```

**5. Run the server**
```bash
python app.py
```

Server starts at `http://localhost:5000`
Interactive API docs at `http://localhost:5000/docs`

---

## Database

Tables are created automatically on first startup via `init_db()`.

### `sessions`
| Column | Type | Description |
|---|---|---|
| `session_id` | VARCHAR(36) PK | Unique session identifier |
| `language` | VARCHAR(20) | Selected language for the session |
| `memory` | TEXT | Rolling summary of conversation context |
| `msg_count` | INTEGER | Number of messages used (for free limit) |
| `created_at` | TIMESTAMP | Session creation time |
| `updated_at` | TIMESTAMP | Auto-updated on every change |

### `messages`
| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PK | Auto-increment message ID |
| `session_id` | VARCHAR(36) FK | References `sessions.session_id` |
| `role` | VARCHAR(10) | `user` or `assistant` |
| `content` | TEXT | Message text |
| `created_at` | TIMESTAMP | Message timestamp |

If the DB is unreachable on startup, the app falls back to in-memory storage automatically and logs a warning.

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

Returns `429` when the session hits the free message limit.

---

### `POST /speak`
Convert text to speech using gTTS. Returns an MP3 audio stream.

Request:
```json
{ "text": "That sounds really tough...", "language": "hindi" }
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
| `GROQ_API_KEY` | from `.env` | Groq API key (LLM + STT) |
| `AI_MODEL` | `llama-3.1-8b-instant` | LLM model |
| `TEMPERATURE` | `0.7` | Response creativity |
| `MAX_TOKENS` | `512` | Max tokens per response |
| `FREE_CHAT_LIMIT` | `10` | Messages allowed per session |
| `LANGUAGE_MAP` | `{english: en, ...}` | Shared language code map |

### `stt_module/config.py`
| Variable | Default | Description |
|---|---|---|
| `STT_MODEL` | `whisper-large-v3-turbo` | Whisper model via Groq |
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

- Tables are auto-created on startup — no manual migration needed.
- Conversation history is capped at the last 20 messages per session for LLM context.
- Crisis keywords are detected before hitting the LLM — a pre-written safe response is returned immediately.
- The same `GROQ_API_KEY` covers both LLM and Whisper — no extra keys needed.
- If the Aiven DB is powered off or unreachable, the app starts with in-memory fallback automatically.
- Aiven free-tier services auto-power-off after inactivity — power them on from [console.aiven.io](https://console.aiven.io).
