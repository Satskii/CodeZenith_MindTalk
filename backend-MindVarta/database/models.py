"""
SQL schema — all 6 tables.
Run init_db() on startup to create tables if they don't exist.
"""

# ── 1. Users ─────────────────────────────────────────────────────────────────
CREATE_USERS_TABLE = """
CREATE TABLE IF NOT EXISTS users (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);
"""

# ── 2. Sessions (auth sessions — cookie based) ───────────────────────────────
CREATE_SESSIONS_TABLE = """
CREATE TABLE IF NOT EXISTS sessions (
    session_id    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language      VARCHAR(20) NOT NULL DEFAULT 'english',
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address    VARCHAR(45),
    device_info   VARCHAR(255),
    created_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    expires_at    TIMESTAMP   NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);
"""

# ── 3. Conversations ──────────────────────────────────────────────────────────
CREATE_CONVERSATIONS_TABLE = """
CREATE TABLE IF NOT EXISTS conversations (
    conv_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id   UUID        REFERENCES sessions(session_id) ON DELETE SET NULL,
    language     VARCHAR(20) NOT NULL DEFAULT 'english',
    title        VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
    msg_count    INTEGER     NOT NULL DEFAULT 0,
    memory       TEXT        NOT NULL DEFAULT '',
    created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);
"""

# ── 4. Messages ───────────────────────────────────────────────────────────────
CREATE_MESSAGES_TABLE = """
CREATE TABLE IF NOT EXISTS messages (
    msg_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID        NOT NULL REFERENCES conversations(conv_id) ON DELETE CASCADE,
    role            VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    content         TEXT        NOT NULL,
    tokens_used     INTEGER,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);
"""

# ── 5. Conversation Summaries ─────────────────────────────────────────────────
CREATE_SUMMARIES_TABLE = """
CREATE TABLE IF NOT EXISTS conversation_summaries (
    sum_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID        NOT NULL REFERENCES conversations(conv_id) ON DELETE CASCADE,
    summary         TEXT        NOT NULL,
    generated_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);
"""

# ── 5b. Detailed Context Summaries (NEW) ──────────────────────────────────────
CREATE_DETAILED_CONTEXT_TABLE = """
CREATE TABLE IF NOT EXISTS user_detailed_contexts (
    context_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID        REFERENCES conversations(conv_id) ON DELETE SET NULL,
    context_data    JSONB       NOT NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);
"""

# ── 6. Mood Logs (optional) ───────────────────────────────────────────────────
CREATE_MOOD_LOGS_TABLE = """
CREATE TABLE IF NOT EXISTS mood_logs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mood_score  INTEGER     NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
    mood_label  VARCHAR(50),
    note        TEXT,
    logged_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);
"""

# ── 7. Password Reset Tokens ──────────────────────────────────────────────────
CREATE_PASSWORD_RESET_TABLE = """
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMP   NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
    used        BOOLEAN     NOT NULL DEFAULT FALSE
);
"""

# ── Auto-update updated_at trigger ───────────────────────────────────────────
CREATE_UPDATED_AT_TRIGGER = """
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_set_updated_at') THEN
        CREATE TRIGGER users_set_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'conversations_set_updated_at') THEN
        CREATE TRIGGER conversations_set_updated_at
        BEFORE UPDATE ON conversations
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
END;
$$;
"""

# ── Migration: Add language column to conversations if it doesn't exist ────────
ADD_LANGUAGE_COLUMN_TO_CONVERSATIONS = """
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conversations' AND column_name = 'language'
    ) THEN
        ALTER TABLE conversations ADD COLUMN language VARCHAR(20) NOT NULL DEFAULT 'english';
    END IF;
END;
$$ LANGUAGE plpgsql;
"""


