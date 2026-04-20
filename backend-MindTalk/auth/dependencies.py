from fastapi import Cookie, HTTPException
from database import repository as db

COOKIE_NAME = "mindtalk_session"


def get_current_user(mindtalk_session: str = Cookie(default=None)) -> dict:
    """
    FastAPI dependency — reads session cookie and returns the current user.
    Raises 401 if not authenticated.
    """
    if not mindtalk_session:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = db.get_auth_session_by_token(mindtalk_session)
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    user = db.get_user_by_id(session["user_id"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    user["session_id"] = session["session_id"]
    user["language"] = session["language"]
    return user
