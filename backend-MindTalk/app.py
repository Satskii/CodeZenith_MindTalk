import uuid
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from ai_module.response_generator import generate_response
from ai_module.config import FREE_CHAT_LIMIT
from stt_module.transcriber import transcribe_audio
from tts_module.synthesizer import synthesize_speech

app = Flask(__name__)
app.secret_key = "mindtalk-secret-key-change-in-prod"
CORS(app, supports_credentials=True)

# In-memory session store: { session_id: { "history": [], "memory": str, "count": int, "language": str } }
sessions: dict = {}

SUPPORTED_LANGUAGES = {"english", "hindi", "bengali", "en", "hi", "bn"}


def get_session_id(data: dict) -> str:
    """Get or create a session ID from the request data."""
    sid = request.headers.get("X-Session-ID") or data.get("session_id")
    if not sid or sid not in sessions:
        sid = str(uuid.uuid4())
        sessions[sid] = {"history": [], "memory": "", "count": 0, "language": "english"}
    return sid


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    user_input = data.get("message", "").strip()
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    sid = get_session_id(data)
    sess = sessions[sid]

    # Update language if provided in this request
    requested_lang = data.get("language", "").strip().lower()
    if requested_lang and requested_lang in SUPPORTED_LANGUAGES:
        sess["language"] = requested_lang
    language = sess["language"]

    # Check free chat limit
    if sess["count"] >= FREE_CHAT_LIMIT:
        return jsonify({
            "error": "free_limit_reached",
            "message": f"You've reached the free limit of {FREE_CHAT_LIMIT} messages. Please start a new chat to continue.",
            "session_id": sid,
        }), 429

    try:
        result = generate_response(
            user_input=user_input,
            conversation_history=sess["history"],
            language=language,
            memory_summary=sess["memory"],
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"[ERROR] generate_response failed: {e}")
        return jsonify({"error": "Failed to get a response. Please try again."}), 500

    bot_reply = result["actual_response"]
    new_summary = result.get("summarize_context", "")

    # Update session history (cap at last 20 messages to avoid token overflow)
    sess["history"].append({"role": "user", "content": user_input})
    sess["history"].append({"role": "assistant", "content": bot_reply})
    if len(sess["history"]) > 20:
        sess["history"] = sess["history"][-20:]

    if new_summary:
        sess["memory"] = new_summary

    sess["count"] += 1
    remaining = FREE_CHAT_LIMIT - sess["count"]

    return jsonify({
        "response": bot_reply,
        "session_id": sid,
        "language": language,
        "messages_used": sess["count"],
        "messages_remaining": remaining,
    })


@app.route("/session/reset", methods=["POST"])
def reset_session():
    """Reset a session (clears history, memory, and count)."""
    data = request.get_json() or {}
    sid = data.get("session_id")
    lang = data.get("language", "english")
    if sid and sid in sessions:
        sessions[sid] = {"history": [], "memory": "", "count": 0, "language": lang}
        return jsonify({"message": "Session reset successfully", "session_id": sid})
    new_sid = str(uuid.uuid4())
    sessions[new_sid] = {"history": [], "memory": "", "count": 0, "language": lang}
    return jsonify({"message": "New session created", "session_id": new_sid})


@app.route("/session/status", methods=["GET"])
def session_status():
    """Check remaining messages for a session."""
    sid = request.args.get("session_id")
    if not sid or sid not in sessions:
        return jsonify({"messages_used": 0, "messages_remaining": FREE_CHAT_LIMIT, "limit": FREE_CHAT_LIMIT})
    sess = sessions[sid]
    return jsonify({
        "session_id": sid,
        "messages_used": sess["count"],
        "messages_remaining": FREE_CHAT_LIMIT - sess["count"],
        "limit": FREE_CHAT_LIMIT,
        "language": sess["language"],
    })


@app.route("/speak", methods=["POST"])
def speak():
    """
    Converts text to speech using gTTS.
    Body: { "text": "...", "language": "english" }
    Returns MP3 audio stream.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400

    language = data.get("language", "english").strip().lower()

    try:
        audio_bytes = synthesize_speech(text, language)
    except Exception as e:
        print(f"[ERROR] TTS failed: {e}")
        return jsonify({"error": "Speech synthesis failed. Please try again."}), 500

    return Response(audio_bytes, mimetype="audio/mpeg")


@app.route("/transcribe", methods=["POST"])
def transcribe():
    """
    Accepts an audio file and returns the transcribed text.
    Form fields:
      - audio: audio file (webm / wav / mp3 etc.)
      - language: optional, defaults to 'english'
    """
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    language = request.form.get("language", "english").strip().lower()

    try:
        transcript = transcribe_audio(audio_file, language)
    except Exception as e:
        print(f"[ERROR] transcribe failed: {e}")
        return jsonify({"error": "Transcription failed. Please try again."}), 500

    return jsonify({"transcript": transcript})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
