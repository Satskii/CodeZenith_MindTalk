"""
Creates all tables on first run. Called automatically on app startup.
"""
from database.connection import get_connection, release_connection
from database.models import (
    CREATE_USERS_TABLE,
    CREATE_SESSIONS_TABLE,
    CREATE_CONVERSATIONS_TABLE,
    CREATE_MESSAGES_TABLE,
    CREATE_SUMMARIES_TABLE,
    CREATE_DETAILED_CONTEXT_TABLE,
    CREATE_MOOD_LOGS_TABLE,
    CREATE_PASSWORD_RESET_TABLE,
    CREATE_UPDATED_AT_TRIGGER,
    ADD_LANGUAGE_COLUMN_TO_CONVERSATIONS,
)
from database import repository


def init_db():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(CREATE_USERS_TABLE)
            cur.execute(CREATE_SESSIONS_TABLE)
            cur.execute(CREATE_CONVERSATIONS_TABLE)
            cur.execute(CREATE_MESSAGES_TABLE)
            cur.execute(CREATE_SUMMARIES_TABLE)
            cur.execute(CREATE_DETAILED_CONTEXT_TABLE)
            cur.execute(CREATE_MOOD_LOGS_TABLE)
            cur.execute(CREATE_PASSWORD_RESET_TABLE)
            cur.execute(CREATE_UPDATED_AT_TRIGGER)
            cur.execute(ADD_LANGUAGE_COLUMN_TO_CONVERSATIONS)
        conn.commit()
        repository.set_db_available(True)
        print("[DB] All tables ready.")
    except Exception as e:
        conn.rollback()
        repository.set_db_available(False)
        print(f"[DB ERROR] init_db failed: {e}")
        raise
    finally:
        release_connection(conn)
