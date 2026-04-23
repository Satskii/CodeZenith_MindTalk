import os
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Header, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from ai_module.response_generator import generate_response
from ai_module.context_extractor import extract_detailed_context, format_context_for_llm
from ai_module.config import FREE_CHAT_LIMIT
from stt_module.transcriber import transcribe_audio
from tts_module.synthesizer import synthesize_speech
from database.init_db import init_db
from database.connection import close_pool
from database import repository as db
from auth.utils import hash_password, verify_password, generate_token
from auth.dependencies import get_current_user, COOKIE_NAME
from auth.email import send_reset_email

COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days
SUPPORTED_LANGUAGES = {"english", "hindi", "bengali", "en", "hi", "bn"}


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Validate required environment variables on startup
    missing = []
    if not os.getenv("GROQ_API_KEY"):
        missing.append("GROQ_API_KEY")
    if missing:
        print("\n" + "="*60)
        print("  MISSING ENVIRONMENT VARIABLES:")
        for var in missing:
            print(f"    - {var}")
        print("\n  Copy backend-MindVarta/.env.example to backend-MindVarta/.env")
        print("  and fill in your credentials before starting the server.")
        print("="*60 + "\n")
        raise RuntimeError(f"Missing required env vars: {', '.join(missing)}")

    try:
        init_db()
        print("[DB] Connected successfully.")
    except Exception as e:
        print(f"[DB WARNING] Could not connect: {e}")
        print("[DB WARNING] Running with in-memory fallback.")
    yield
    close_pool()


app = FastAPI(title="MindVarta API", lifespan=lifespan)

# In development allow all localhost origins dynamically
def is_allowed_origin(origin: str) -> bool:
    return origin.startswith("http://localhost") or origin.startswith("http://127.0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ───────────────────────────────────────────────────────────

class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str

class SignInRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "english"
    conv_id: Optional[str] = None

class SpeakRequest(BaseModel):
    text: str
    language: Optional[str] = "english"

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class MoodLogRequest(BaseModel):
    mood_score: int
    mood_label: Optional[str] = None
    note: Optional[str] = None


# ── Security Helpers ──────────────────────────────────────────────────────────

def verify_conversation_ownership(conv_id: str, user_id: str) -> dict:
    """
    Verifies that a conversation belongs to the current user.
    Raises 403 if user is not the owner, 404 if conversation doesn't exist.
    
    Args:
        conv_id: Conversation ID to verify
        user_id: Current user's ID
    
    Returns:
        dict: The conversation object if ownership is verified
    
    Raises:
        HTTPException: 404 if not found, 403 if not owner
    """
    if not conv_id:
        raise HTTPException(status_code=400, detail="Conversation ID is required")
    
    conv = db.get_conversation(conv_id)
    
    if not conv:
        print(f"[SECURITY] Attempt to access non-existent conversation {conv_id} by user {user_id}")
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if str(conv["user_id"]) != str(user_id):
        print(f"[SECURITY] UNAUTHORIZED ACCESS: User {user_id} tried to access conv {conv_id} (owner: {conv['user_id']})")
        raise HTTPException(status_code=403, detail="Access denied")
    
    return conv


# ── Auth routes ───────────────────────────────────────────────────────────────

@app.post("/auth/signup")
async def signup(body: SignUpRequest, request: Request, response: Response):
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing = db.get_user_by_email(body.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    pw_hash = hash_password(body.password)
    user = db.create_user(body.name.strip(), body.email, pw_hash)

    token = generate_token()
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")[:255]
    sid = db.create_auth_session(user["id"], token, "english", ip, ua)

    response.set_cookie(
        key=COOKIE_NAME, value=token,
        httponly=True, samesite="lax",
        max_age=COOKIE_MAX_AGE, secure=False,  # set secure=True in production
    )
    return {"message": "Account created", "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}


@app.post("/auth/signin")
async def signin(body: SignInRequest, request: Request, response: Response):
    user = db.get_user_by_email(body.email)
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = generate_token()
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")[:255]
    db.create_auth_session(user["id"], token, "english", ip, ua)

    response.set_cookie(
        key=COOKIE_NAME, value=token,
        httponly=True, samesite="lax",
        max_age=COOKIE_MAX_AGE, secure=False,
    )
    return {"message": "Signed in", "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}


@app.post("/auth/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    # Always return 200 to avoid email enumeration
    user = db.get_user_by_email(body.email.strip().lower())
    if user:
        token = generate_token()
        db.create_reset_token(user["id"], token)
        try:
            send_reset_email(user["email"], token, user["name"])
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")
            raise HTTPException(status_code=500, detail="Failed to send reset email. Check SMTP settings.")
    return {"message": "If that email is registered, a reset link has been sent."}


@app.post("/auth/reset-password")
async def reset_password(body: ResetPasswordRequest):
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    record = db.get_valid_reset_token(body.token)
    if not record:
        raise HTTPException(status_code=400, detail="Reset link is invalid or has expired")

    pw_hash = hash_password(body.new_password)
    db.update_user_password(record["user_id"], pw_hash)
    db.consume_reset_token(body.token)
    return {"message": "Password reset successfully. You can now sign in."}


@app.post("/auth/signout")
async def signout(request: Request, response: Response):
    token = request.cookies.get(COOKIE_NAME)
    if token:
        session = db.get_auth_session_by_token(token)
        if session:
            print(f"[SECURITY] User {session['user_id']} signed out at {token[:20]}...")
            db.delete_auth_session(token)
        else:
            print(f"[SECURITY] Signout attempt with invalid token")
    response.delete_cookie(COOKIE_NAME)
    return {"message": "Signed out"}


@app.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {"user": {k: v for k, v in current_user.items() if k not in ("password_hash",)}}


# ── Conversation routes ───────────────────────────────────────────────────────

@app.get("/conversations")
async def list_conversations(current_user: dict = Depends(get_current_user)):
    convs = db.get_user_conversations(current_user["id"])
    return {"conversations": convs}


@app.post("/conversations")
async def new_conversation(current_user: dict = Depends(get_current_user)):
    from datetime import datetime
    title = f"Session on {datetime.now().strftime('%b %d')}"
    conv_id = db.create_conversation(current_user["id"], current_user["session_id"], title)
    return {"conv_id": conv_id, "title": title}


@app.delete("/conversations/{conv_id}")
async def delete_conversation(conv_id: str, current_user: dict = Depends(get_current_user)):
    # Verify ownership before deleting
    verify_conversation_ownership(conv_id, current_user["id"])
    db.delete_conversation(conv_id)
    print(f"[INFO] User {current_user['id']} deleted conversation {conv_id}")
    return {"message": "Deleted"}


# ── Chat ──────────────────────────────────────────────────────────────────────

@app.post("/chat")
async def chat(body: ChatRequest, current_user: dict = Depends(get_current_user)):
    user_input = body.message.strip()
    if not user_input:
        raise HTTPException(status_code=400, detail="No message provided")

    language = (body.language or "english").strip().lower()
    if language not in SUPPORTED_LANGUAGES:
        language = "english"

    # Get or create conversation
    conv_id = body.conv_id
    if conv_id:
        # SECURITY: Verify ownership of existing conversation
        # This will raise 403 if user doesn't own the conversation
        conv = verify_conversation_ownership(conv_id, current_user["id"])
    else:
        # Create new conversation
        from datetime import datetime
        title = f"Session on {datetime.now().strftime('%b %d')}"
        conv_id = db.create_conversation(current_user["id"], current_user["session_id"], title)
        conv = db.get_conversation(conv_id)
        print(f"[INFO] User {current_user['id']} created new conversation {conv_id}")

    if conv["count"] >= FREE_CHAT_LIMIT:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "free_limit_reached",
                "message": f"You've reached the free limit of {FREE_CHAT_LIMIT} messages. Please start a new conversation.",
                "conv_id": conv_id,
            }
        )

    history = db.get_recent_history(conv_id)

    # Get detailed context from previous conversations
    # This captures specific information the user shared in past sessions
    detailed_context = db.get_user_detailed_context(
        current_user["id"], 
        exclude_conv_id=conv_id
    )
    
    # Format detailed context for the LLM
    formatted_detailed_context = format_context_for_llm(detailed_context)
    
    # Always combine all available context sources for the LLM
    memory = conv["memory"]
    
    # Get context summary as additional context source
    context_summary = db.get_user_context_summary(current_user["id"], exclude_conv_id=conv_id)
    
    # Build comprehensive memory: detailed context + summary context + current conversation memory
    memory_parts = []
    if formatted_detailed_context:
        memory_parts.append(formatted_detailed_context)
    if context_summary:
        memory_parts.append(context_summary)
    if memory:
        memory_parts.append(memory)
    
    # Combine all parts with clear separation
    memory = "\n\n".join(memory_parts) if memory_parts else ""
    
    # Log for debugging context retrieval for all users
    if not memory:
        print(f"[INFO] No prior context found for user {current_user['id']} in conv {conv_id}")
    else:
        print(f"[INFO] Loaded context for user {current_user['id']}: {len(memory)} chars")

    try:
        result = generate_response(
            user_input=user_input,
            conversation_history=history,
            language=language,
            memory_summary=memory,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"[ERROR] generate_response failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get a response. Please try again.")

    bot_reply = result["actual_response"]
    new_summary = result.get("summarize_context", "") or conv["memory"]
    new_count = conv["count"] + 1

    db.save_message(conv_id, "user", user_input)
    db.save_message(conv_id, "assistant", bot_reply)
    db.update_conversation(conv_id, new_summary, new_count)
    if new_summary:
        db.save_summary(conv_id, new_summary)
    
    # Extract and save detailed context from this conversation
    # Do this for ALL messages, not just after 2+ messages, so context is available from the start
    try:
        full_history = history + [{"role": "user", "content": user_input}, {"role": "assistant", "content": bot_reply}]
        if len(full_history) > 0:  # Extract from first message onwards
            new_detailed_context = extract_detailed_context(full_history, language)
            if new_detailed_context:
                db.update_detailed_context(
                    current_user["id"],
                    new_detailed_context,
                    conversation_id=conv_id
                )
                print(f"[INFO] Saved detailed context for user {current_user['id']} from conv {conv_id}")
            else:
                print(f"[DEBUG] No detailed context extracted (might be too short): {len(full_history)} messages")
    except Exception as e:
        print(f"[WARN] Detailed context extraction failed for user {current_user['id']}: {e}")
        # Don't fail the chat request if context extraction fails

    # Sync language on auth session
    if language != current_user.get("language"):
        db.update_session_language(current_user["session_id"], language)

    return {
        "response": bot_reply,
        "conv_id": conv_id,
        "language": language,
        "messages_used": new_count,
        "messages_remaining": FREE_CHAT_LIMIT - new_count,
    }


# ── TTS / STT ─────────────────────────────────────────────────────────────────

@app.post("/speak")
async def speak(body: SpeakRequest, current_user: dict = Depends(get_current_user)):
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    try:
        audio_bytes = synthesize_speech(text, body.language or "english")
    except Exception as e:
        print(f"[ERROR] TTS failed: {e}")
        raise HTTPException(status_code=500, detail="Speech synthesis failed.")
    from fastapi.responses import Response as FResponse
    return FResponse(content=audio_bytes, media_type="audio/mpeg")


@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = Form(default="english"),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("id", "unknown")
    lang = language.strip().lower()
    
    try:
        # Log incoming request
        print(f"[STT] /transcribe called by user {user_id}")
        print(f"[STT] Audio file: {audio.filename}, Content-Type: {audio.content_type}, Language: {lang}")
        
        # Get file size
        audio_content = await audio.read()
        file_size = len(audio_content)
        print(f"[STT] Audio size: {file_size} bytes")
        
        # Reset file pointer for transcriber
        await audio.seek(0)
        
        # Transcribe
        transcript = await transcribe_audio(audio, lang)
        
        if not transcript or not transcript.strip():
            print(f"[STT] Empty transcription from audio ({file_size} bytes)")
            return {"transcript": ""}
        
        print(f"[STT] Transcription success ({file_size} bytes -> {len(transcript)} chars): {transcript[:100]}...")
        return {"transcript": transcript}
        
    except Exception as e:
        print(f"[STT] Transcription failed for user {user_id}: {type(e).__name__}: {e}")
        import traceback
        print(f"[STT] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


# ── Mood Logs ─────────────────────────────────────────────────────────────────

@app.post("/mood")
async def log_mood(body: MoodLogRequest, current_user: dict = Depends(get_current_user)):
    if not (1 <= body.mood_score <= 10):
        raise HTTPException(status_code=400, detail="mood_score must be between 1 and 10")
    db.log_mood(current_user["id"], body.mood_score, body.mood_label, body.note)
    return {"message": "Mood logged"}


@app.get("/mood")
async def get_mood_logs(current_user: dict = Depends(get_current_user)):
    logs = db.get_mood_logs(current_user["id"])
    return {"mood_logs": logs}


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok"}
