import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/documentation.css'

export default function DocumentationPage() {
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const tableOfContents = [
    { id: 'overview',      title: 'Project Overview' },
    { id: 'architecture',  title: 'System Architecture' },
    { id: 'frontend',      title: 'Frontend Application' },
    { id: 'backend',       title: 'Backend Application' },
    { id: 'database',      title: 'Database Schema' },
    { id: 'api',           title: 'API Endpoints' },
    { id: 'auth',          title: 'Authentication & Security' },
    { id: 'ai',            title: 'AI Module' },
    { id: 'voice',         title: 'Voice Features (STT & TTS)' },
    { id: 'setup',         title: 'Installation & Setup' },
    { id: 'workflow',      title: 'Development Workflow' },
    { id: 'deployment',    title: 'Deployment' },
  ]

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="documentation-page">
      <header className="doc-header">
        <button className="doc-back-btn" onClick={() => navigate('/')}>← Back to Home</button>
        <h1>MindVarta — Technical Documentation</h1>
        <p>Complete reference guide for developers and stakeholders</p>
      </header>

      <div className="doc-container">
        {/* Sidebar */}
        <aside className="doc-sidebar">
          <h3>Table of Contents</h3>
          <nav className="doc-toc">
            {tableOfContents.map(item => (
              <button key={item.id} className="toc-link" onClick={() => scrollToSection(item.id)}>
                {item.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="doc-content">

          {/* ── Overview ── */}
          <section id="overview" className="doc-section">
            <h2>Project Overview</h2>
            <p>
              <strong>MindVarta</strong> is a confidential, AI-powered mental health support chatbot providing
              24/7 assistance in English, Hindi, and Bengali. It combines a React frontend with a FastAPI
              backend, Groq-powered LLM and STT, gTTS for speech synthesis, and a PostgreSQL database
              hosted on Aiven.
            </p>

            <div className="feature-grid">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <h4>Confidential & Secure</h4>
                <p>Cookie-based auth, bcrypt passwords, session invalidation on signout</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <h4>AI-Powered</h4>
                <p>Groq llama-3.1-8b-instant with cross-session memory summaries</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🗣️</span>
                <h4>Multi-Lingual</h4>
                <p>English, Hindi, and Bengali across LLM, STT, and TTS</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎙️</span>
                <h4>Voice Enabled</h4>
                <p>Whisper STT via Groq + gTTS for spoken responses</p>
              </div>
            </div>

            <div className="tech-stack">
              <h3>Tech Stack</h3>
              <div className="stack-columns">
                <div className="stack-column">
                  <h4>Frontend</h4>
                  <ul>
                    <li>React 19 + Vite</li>
                    <li>React Router v6</li>
                    <li>Context API (Auth, Chat, Theme)</li>
                    <li>CSS3 (dark/light themes)</li>
                  </ul>
                </div>
                <div className="stack-column">
                  <h4>Backend</h4>
                  <ul>
                    <li>FastAPI + Uvicorn</li>
                    <li>PostgreSQL (Aiven)</li>
                    <li>psycopg2 connection pool</li>
                    <li>Groq API (LLM + Whisper STT)</li>
                    <li>gTTS (Text-to-Speech)</li>
                    <li>bcrypt + SMTP</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Architecture ── */}
          <section id="architecture" className="doc-section">
            <h2>System Architecture</h2>
            <p>MindVarta follows a client-server architecture with clear separation of concerns:</p>
            <div className="arch-diagram">
              <div className="arch-box"><h4>Frontend (React)</h4><p>UI, State, Routing</p></div>
              <div className="arch-arrow">→</div>
              <div className="arch-box"><h4>Backend (FastAPI)</h4><p>Auth, AI, STT, TTS</p></div>
              <div className="arch-arrow">→</div>
              <div className="arch-box"><h4>PostgreSQL (Aiven)</h4><p>Persistent Storage</p></div>
            </div>

            <h3>Key Components</h3>
            <div className="components-list">
              <div className="component">
                <h4>Frontend</h4>
                <ul>
                  <li><strong>LandingPage</strong> — Public homepage</li>
                  <li><strong>AuthPage</strong> — Sign in / Sign up</li>
                  <li><strong>ForgotPasswordPage</strong> — Request reset link</li>
                  <li><strong>ResetPasswordPage</strong> — Set new password</li>
                  <li><strong>ChatPage</strong> — Main chat interface</li>
                  <li><strong>SettingsModal</strong> — Theme, language, mute, sign out</li>
                  <li><strong>Sidebar</strong> — Conversation history</li>
                </ul>
              </div>
              <div className="component">
                <h4>Backend Modules</h4>
                <ul>
                  <li><strong>ai_module</strong> — LLM response generation + crisis detection</li>
                  <li><strong>auth</strong> — Cookie sessions, bcrypt, SMTP reset</li>
                  <li><strong>stt_module</strong> — Whisper transcription via Groq</li>
                  <li><strong>tts_module</strong> — gTTS speech synthesis</li>
                  <li><strong>database</strong> — psycopg2 pool, repository pattern</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── Frontend ── */}
          <section id="frontend" className="doc-section">
            <h2>Frontend Application</h2>
            <p>Built with React 19 and Vite. All API calls use <code>credentials: 'include'</code> for cookie-based auth.</p>

            <h3>Directory Structure</h3>
            <pre className="code-block">{`frontend-MindTalk/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatHeader.jsx     (language selector, mute toggle)
│   │   │   ├── ChatInput.jsx      (text + voice input)
│   │   │   ├── MessageList.jsx    (message bubbles)
│   │   │   ├── SettingsModal.jsx  (theme, language, mute, sign out)
│   │   │   └── Sidebar.jsx        (conversation list)
│   │   └── landing/
│   │       └── LandingPage.jsx
│   ├── context/
│   │   ├── AuthContext.jsx        (user, signin, signup, signout)
│   │   ├── ChatContext.jsx        (messages, conversations, clearChat)
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   └── useVoice.js            (MediaRecorder → /transcribe)
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── DocumentationPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── LandingPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── styles/
│   │   ├── auth.css
│   │   ├── chat.css
│   │   ├── global.css
│   │   ├── landing.css
│   │   └── settings.css
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js`}</pre>

            <h3>Context Providers</h3>
            <ul className="feature-list">
              <li><strong>AuthContext</strong> — user state, signin/signup/signout, language preference</li>
              <li><strong>ChatContext</strong> — messages, conversations, conv_id, clearChat on signout</li>
              <li><strong>ThemeContext</strong> — dark/light mode toggle</li>
            </ul>

            <h3>Protected Routes</h3>
            <p>The <code>/chat</code> route is wrapped in a <code>ProtectedRoute</code> component that redirects unauthenticated users to <code>/auth</code>.</p>
          </section>

          {/* ── Backend ── */}
          <section id="backend" className="doc-section">
            <h2>Backend Application</h2>
            <p>FastAPI app with cookie-based auth, in-memory DB fallback, and startup env validation.</p>

            <h3>Directory Structure</h3>
            <pre className="code-block">{`backend-MindTalk/
├── app.py                        (all routes + lifespan)
├── requirements.txt
├── .env                          (never commit)
├── .env.example
├── ai_module/
│   ├── config.py                 (GROQ_API_KEY, model, LANGUAGE_MAP)
│   ├── response_generator.py     (Groq LLM call + crisis detection)
│   └── prompts/
│       └── language_prompts.py   (PromptManagerV2 — multilingual prompts)
├── auth/
│   ├── dependencies.py           (get_current_user cookie dependency)
│   ├── email.py                  (SMTP password reset emails)
│   └── utils.py                  (bcrypt hash/verify, token generation)
├── stt_module/
│   ├── config.py
│   └── transcriber.py            (Groq Whisper — async UploadFile)
├── tts_module/
│   ├── config.py
│   └── synthesizer.py            (gTTS → MP3 bytes)
└── database/
    ├── config.py                 (DSN from .env)
    ├── connection.py             (ThreadedConnectionPool)
    ├── init_db.py                (auto-creates all tables on startup)
    ├── models.py                 (CREATE TABLE SQL)
    └── repository.py             (all DB operations + in-memory fallback)`}</pre>

            <h3>Startup Validation</h3>
            <p>On startup, the app checks for required env vars. If <code>GROQ_API_KEY</code> is missing it prints a clear error and refuses to start.</p>
          </section>

          {/* ── Database ── */}
          <section id="database" className="doc-section">
            <h2>Database Schema</h2>
            <p>PostgreSQL hosted on Aiven. All tables are auto-created on first startup via <code>init_db()</code>.</p>

            <h3>1. users</h3>
            <pre className="code-block">{`id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
name          VARCHAR(100) NOT NULL
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP DEFAULT NOW()`}</pre>

            <h3>2. sessions (auth sessions)</h3>
            <pre className="code-block">{`session_id    UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
language      VARCHAR(20) DEFAULT 'english'
session_token VARCHAR(255) UNIQUE NOT NULL
ip_address    VARCHAR(45)
device_info   VARCHAR(255)
created_at    TIMESTAMP DEFAULT NOW()
expires_at    TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days')`}</pre>

            <h3>3. conversations</h3>
            <pre className="code-block">{`conv_id    UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id    UUID REFERENCES users(id) ON DELETE CASCADE
session_id UUID REFERENCES sessions(session_id) ON DELETE SET NULL
title      VARCHAR(255) DEFAULT 'New Conversation'
msg_count  INTEGER DEFAULT 0
memory     TEXT DEFAULT ''          -- rolling LLM summary
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()`}</pre>

            <h3>4. messages</h3>
            <pre className="code-block">{`msg_id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id UUID REFERENCES conversations(conv_id) ON DELETE CASCADE
role            VARCHAR(10) CHECK (role IN ('user', 'assistant'))
content         TEXT NOT NULL
tokens_used     INTEGER
created_at      TIMESTAMP DEFAULT NOW()`}</pre>

            <h3>5. conversation_summaries</h3>
            <pre className="code-block">{`sum_id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id UUID REFERENCES conversations(conv_id) ON DELETE CASCADE
summary         TEXT NOT NULL
generated_at    TIMESTAMP DEFAULT NOW()`}</pre>

            <h3>6. mood_logs</h3>
            <pre className="code-block">{`id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID REFERENCES users(id) ON DELETE CASCADE
mood_score  INTEGER CHECK (mood_score BETWEEN 1 AND 10)
mood_label  VARCHAR(50)
note        TEXT
logged_at   TIMESTAMP DEFAULT NOW()`}</pre>

            <h3>7. password_reset_tokens</h3>
            <pre className="code-block">{`id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id    UUID REFERENCES users(id) ON DELETE CASCADE
token      VARCHAR(255) UNIQUE NOT NULL
expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '1 hour')
used       BOOLEAN DEFAULT FALSE`}</pre>
          </section>

          {/* ── API Endpoints ── */}
          <section id="api" className="doc-section">
            <h2>API Endpoints</h2>
            <p>Base URL: <code>http://localhost:5000</code> — Interactive docs at <code>/docs</code></p>

            <h3>Authentication</h3>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/auth/signup</div><p>Register — sets HttpOnly session cookie</p></div>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/auth/signin</div><p>Login — sets HttpOnly session cookie</p></div>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/auth/signout</div><p>Logout — deletes session from DB and clears cookie</p></div>
            <div className="endpoint"><div className="endpoint-method get">GET</div><div className="endpoint-path">/auth/me</div><p>Get current authenticated user (requires cookie)</p></div>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/auth/forgot-password</div><p>Send password reset email via SMTP</p></div>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/auth/reset-password</div><p>Reset password using token from email</p></div>

            <h3>Conversations</h3>
            <div className="endpoint"><div className="endpoint-method get">GET</div><div className="endpoint-path">/conversations</div><p>List all conversations for current user</p></div>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/conversations</div><p>Create a new conversation</p></div>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/conversations/{'{conv_id}'}/messages</div><p>Get messages for a conversation</p></div>
            <div className="endpoint"><div className="endpoint-method post">DELETE</div><div className="endpoint-path">/conversations/{'{conv_id}'}</div><p>Delete a conversation</p></div>

            <h3>Chat</h3>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/chat</div><p>Send message — returns AI response with cross-session context</p></div>

            <h3>Voice</h3>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/transcribe</div><p>Multipart audio → text via Groq Whisper</p></div>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/speak</div><p>Text → MP3 audio stream via gTTS</p></div>

            <h3>Mood</h3>
            <div className="endpoint"><div className="endpoint-method post">POST</div><div className="endpoint-path">/mood</div><p>Log a mood entry (score 1–10)</p></div>
            <div className="endpoint"><div className="endpoint-method get">GET</div><div className="endpoint-path">/mood</div><p>Get all mood logs for current user</p></div>

            <h3>Health</h3>
            <div className="endpoint"><div className="endpoint-method get">GET</div><div className="endpoint-path">/health</div><p>Server health check</p></div>
          </section>

          {/* ── Auth & Security ── */}
          <section id="auth" className="doc-section">
            <h2>Authentication & Security</h2>

            <h3>Authentication Flow</h3>
            <ol className="flow-list">
              <li>User registers with name, email, password (min 6 chars)</li>
              <li>Password hashed with bcrypt and stored</li>
              <li>On login, a secure random token is generated and stored in <code>sessions</code> table</li>
              <li>Token set as HttpOnly, SameSite=Lax cookie (7-day expiry)</li>
              <li>Every protected route reads the cookie via <code>get_current_user</code> dependency</li>
              <li>On signout, session row is deleted from DB and cookie is cleared</li>
            </ol>

            <h3>Forgot Password Flow</h3>
            <ol className="flow-list">
              <li>User submits email on <code>/forgot-password</code> page</li>
              <li>Backend generates a secure token, stores in <code>password_reset_tokens</code> (1-hour expiry)</li>
              <li>Reset link emailed via SMTP: <code>{'{FRONTEND_URL}'}/reset-password?token=...</code></li>
              <li>User clicks link, submits new password</li>
              <li>Token validated, password updated, token marked used</li>
            </ol>

            <h3>Security Measures</h3>
            <div className="security-grid">
              <div className="security-item">
                <h4>🔐 Password Security</h4>
                <p>bcrypt hashing, minimum 6 characters</p>
              </div>
              <div className="security-item">
                <h4>🍪 Cookie Sessions</h4>
                <p>HttpOnly, SameSite=Lax, 7-day expiry, deleted on signout</p>
              </div>
              <div className="security-item">
                <h4>🛡️ CORS</h4>
                <p>Restricted to localhost dev ports with credentials support</p>
              </div>
              <div className="security-item">
                <h4>🔑 Reset Tokens</h4>
                <p>Single-use, 1-hour expiry, invalidated on use</p>
              </div>
            </div>

            <h3>Required Environment Variables</h3>
            <pre className="code-block">{`GROQ_API_KEY=your_groq_api_key

DB_HOST=your_aiven_host
DB_PORT=16385
DB_NAME=mind_talk_db
DB_USER=avnadmin
DB_PASSWORD=your_db_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

FRONTEND_URL=http://localhost:5173`}</pre>
          </section>

          {/* ── AI Module ── */}
          <section id="ai" className="doc-section">
            <h2>AI Module</h2>

            <h3>Response Generation Pipeline</h3>
            <div className="pipeline">
              <div className="pipeline-step">1. Crisis keyword detection</div>
              <div className="pipeline-step">2. Load conversation history (last 20 msgs)</div>
              <div className="pipeline-step">3. Load cross-session memory summaries</div>
              <div className="pipeline-step">4. Build multilingual prompt (PromptManagerV2)</div>
              <div className="pipeline-step">5. Groq API call (llama-3.1-8b-instant)</div>
              <div className="pipeline-step">6. Parse JSON response</div>
              <div className="pipeline-step">7. Save summary for future sessions</div>
            </div>

            <h3>Crisis Detection</h3>
            <p>Before hitting the API, user input is scanned for crisis keywords in all three languages. If detected, a pre-written safe response is returned immediately — no API call made.</p>

            <h3>Cross-Session Memory</h3>
            <p>After each message, a <code>summarize_context</code> is saved to <code>conversation_summaries</code>. When a user starts a new conversation, the last 3 summaries from previous sessions are injected as context so the LLM remembers what the user has been going through.</p>

            <h3>Free Tier Limits</h3>
            <div className="limits-box">
              <p>📊 <strong>Messages per conversation:</strong> 10</p>
              <p>📝 <strong>History window:</strong> last 20 messages</p>
              <p>🧠 <strong>Cross-session summaries:</strong> last 3 conversations</p>
            </div>
          </section>

          {/* ── Voice ── */}
          <section id="voice" className="doc-section">
            <h2>Voice Features (STT & TTS)</h2>

            <h3>Speech-to-Text (STT)</h3>
            <div className="voice-feature">
              <h4>📢 Groq Whisper — <code>whisper-large-v3-turbo</code></h4>
              <ul>
                <li>Browser records via <code>MediaRecorder</code> API (webm format)</li>
                <li>Audio blob POSTed as <code>multipart/form-data</code> to <code>/transcribe</code></li>
                <li>Language code passed alongside audio (<code>en</code> / <code>hi</code> / <code>bn</code>)</li>
                <li>Transcript returned and placed in chat input for review before sending</li>
              </ul>
            </div>

            <h3>Text-to-Speech (TTS)</h3>
            <div className="voice-feature">
              <h4>🔊 gTTS (Google Text-to-Speech)</h4>
              <ul>
                <li>Bot reply POSTed to <code>/speak</code> with language</li>
                <li>Returns <code>audio/mpeg</code> stream</li>
                <li>Frontend creates blob URL and plays via <code>Audio</code> API</li>
                <li>Mute toggle in header and Settings modal controls auto-play</li>
              </ul>
            </div>

            <h3>Supported Languages</h3>
            <div className="languages">
              <span className="lang-badge">🇬🇧 English (en)</span>
              <span className="lang-badge">🇮🇳 Hindi (hi)</span>
              <span className="lang-badge">🇧🇩 Bengali (bn)</span>
            </div>
          </section>

          {/* ── Setup ── */}
          <section id="setup" className="doc-section">
            <h2>Installation & Setup</h2>

            <h3>Prerequisites</h3>
            <ul className="feature-list">
              <li>Node.js 18+</li>
              <li>Python 3.12+</li>
              <li>A free Groq API key — <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer">console.groq.com</a></li>
              <li>A free Aiven PostgreSQL instance — <a href="https://aiven.io" target="_blank" rel="noopener noreferrer">aiven.io</a></li>
              <li>A Gmail account with an App Password for SMTP</li>
            </ul>

            <h3>Backend Setup</h3>
            <pre className="code-block">{`cd backend-MindTalk
pip install -r requirements.txt
cp .env.example .env        # fill in your credentials
python app.py`}</pre>

            <h3>Frontend Setup</h3>
            <pre className="code-block">{`cd frontend-MindTalk
npm install
npm run dev`}</pre>

            <h3>Access Points</h3>
            <ul className="access-list">
              <li>🌐 <strong>Frontend:</strong> http://localhost:5173</li>
              <li>🔌 <strong>Backend API:</strong> http://localhost:5000</li>
              <li>📚 <strong>API Docs (Swagger):</strong> http://localhost:5000/docs</li>
            </ul>
          </section>

          {/* ── Workflow ── */}
          <section id="workflow" className="doc-section">
            <h2>Development Workflow</h2>

            <h3>Git Workflow</h3>
            <pre className="code-block">{`git checkout -b feature/feature-name
git add .
git commit -m "feat: description of changes"
git push origin feature/feature-name
# Create Pull Request on GitHub`}</pre>

            <h3>Best Practices</h3>
            <ul className="feature-list">
              <li>Never commit <code>.env</code> — it's in <code>.gitignore</code></li>
              <li>Use <code>.env.example</code> to document required variables</li>
              <li>Run backend on port 5000, frontend on 5173</li>
              <li>Use semantic commit messages (<code>feat:</code>, <code>fix:</code>, <code>chore:</code>)</li>
              <li>Pull with <code>--rebase</code> to keep history clean</li>
            </ul>
          </section>

          {/* ── Deployment ── */}
          <section id="deployment" className="doc-section">
            <h2>Deployment</h2>

            <h3>Frontend — Vercel / Netlify</h3>
            <pre className="code-block">{`cd frontend-MindTalk
npm run build
# Deploy dist/ folder to Vercel or Netlify`}</pre>

            <h3>Backend — Any Python host (Railway, Render, etc.)</h3>
            <pre className="code-block">{`# Set all env vars in your host's dashboard
# Start command:
uvicorn app:app --host 0.0.0.0 --port 5000`}</pre>

            <div className="deployment-checklist">
              <h4>Pre-deployment Checklist</h4>
              <ul>
                <li>All env vars configured on host</li>
                <li>Aiven DB IP allowlist updated for production IP</li>
                <li>CORS origins updated to production frontend URL</li>
                <li>Cookie <code>secure=True</code> enabled for HTTPS</li>
                <li>SMTP credentials verified</li>
                <li><code>FRONTEND_URL</code> set to production domain for reset emails</li>
              </ul>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
