import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import '../styles/documentation.css'

export default function DocumentationPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const tableOfContents = [
    { id: 'overview', title: 'Project Overview' },
    { id: 'architecture', title: 'System Architecture' },
    { id: 'frontend', title: 'Frontend Application' },
    { id: 'backend', title: 'Backend Application' },
    { id: 'database', title: 'Database Schema' },
    { id: 'api', title: 'API Endpoints' },
    { id: 'auth', title: 'Authentication & Security' },
    { id: 'ai', title: 'AI Module' },
    { id: 'voice', title: 'Voice Features' },
    { id: 'setup', title: 'Installation & Setup' },
    { id: 'workflow', title: 'Development Workflow' },
    { id: 'deployment', title: 'Deployment' },
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="documentation-page">
      {/* Header */}
      <header className="doc-header">
        <button className="doc-back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>MindVarta - Technical Documentation</h1>
        <p>Complete reference guide for developers and stakeholders</p>
      </header>

      <div className="doc-container">
        {/* Sidebar Navigation */}
        <aside className="doc-sidebar">
          <h3>Table of Contents</h3>
          <nav className="doc-toc">
            {tableOfContents.map(item => (
              <button
                key={item.id}
                className="toc-link"
                onClick={() => scrollToSection(item.id)}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="doc-content">
          {/* Overview */}
          <section id="overview" className="doc-section">
            <h2>Project Overview</h2>
            <p>
              <strong>MindVarta</strong> is a confidential, AI-powered mental health support chatbot that provides 24/7 assistance in multiple languages. The platform combines modern web technologies with advanced AI capabilities to create a safe, accessible space for students to discuss their thoughts and feelings.
            </p>

            <div className="feature-grid">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <h4>Confidential & Secure</h4>
                <p>End-to-end encryption and secure data storage</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <h4>AI-Powered</h4>
                <p>Leverages Groq's LLM API for intelligent responses</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🗣️</span>
                <h4>Multi-Lingual</h4>
                <p>English, Hindi, and Bengali language support</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎙️</span>
                <h4>Voice Enabled</h4>
                <p>Speech-to-Text and Text-to-Speech capabilities</p>
              </div>
            </div>

            <div className="tech-stack">
              <h3>Tech Stack</h3>
              <div className="stack-columns">
                <div className="stack-column">
                  <h4>Frontend</h4>
                  <ul>
                    <li>React 19</li>
                    <li>React Router</li>
                    <li>Vite</li>
                    <li>Context API</li>
                    <li>CSS3</li>
                  </ul>
                </div>
                <div className="stack-column">
                  <h4>Backend</h4>
                  <ul>
                    <li>FastAPI</li>
                    <li>PostgreSQL</li>
                    <li>SQLAlchemy</li>
                    <li>Groq API(LLM + STT)</li>
                    <li>Google TTS</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="doc-section">
            <h2>System Architecture</h2>
            <p>MindVarta follows a client-server architecture with clear separation of concerns:</p>
            <div className="arch-diagram">
              <div className="arch-box">
                <h4>Frontend (React)</h4>
                <p>User Interface & State Management</p>
              </div>
              <div className="arch-arrow">→</div>
              <div className="arch-box">
                <h4>Backend (FastAPI)</h4>
                <p>API, Auth, AI Processing</p>
              </div>
              <div className="arch-arrow">→</div>
              <div className="arch-box">
                <h4>Database (PostgreSQL)</h4>
                <p>Data Persistence</p>
              </div>
            </div>

            <h3>Key Components</h3>
            <div className="components-list">
              <div className="component">
                <h4>Frontend Components</h4>
                <ul>
                  <li><strong>LandingPage</strong> - Public homepage</li>
                  <li><strong>AuthPage</strong> - User authentication</li>
                  <li><strong>ChatPage</strong> - Main chat interface</li>
                  <li><strong>SettingsModal</strong> - User preferences</li>
                </ul>
              </div>
              <div className="component">
                <h4>Backend Modules</h4>
                <ul>
                  <li><strong>AI Module</strong> - Response generation</li>
                  <li><strong>Auth Module</strong> - User authentication</li>
                  <li><strong>Database Module</strong> - Data persistence</li>
                  <li><strong>STT/TTS Modules</strong> - Voice processing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Frontend */}
          <section id="frontend" className="doc-section">
            <h2>Frontend Application</h2>
            <p>Built with React 19 and Vite for a fast, modern user experience.</p>

            <h3>Directory Structure</h3>
            <pre className="code-block">{`frontend-MindTalk/
├── src/
│   ├── components/
│   │   ├── chat/          (Chat interface components)
│   │   └── landing/       (Landing page components)
│   ├── context/           (Context API providers)
│   ├── hooks/             (Custom React hooks)
│   ├── pages/             (Page components)
│   ├── styles/            (CSS stylesheets)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json`}</pre>

            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>1. Context API for state management</li>
              <li>2. React Router for navigation</li>
              <li>3. Dark/Light theme support</li>
              <li>4. Voice input/output support</li>
              <li>5. Responsive design</li>
              <li>6. Real-time message updates</li>
            </ul>
          </section>

          {/* Backend */}
          <section id="backend" className="doc-section">
            <h2>Backend Application</h2>
            <p>High-performance REST API built with FastAPI, handling authentication, AI responses, and voice processing.</p>

            <h3>Core Modules</h3>
            <div className="modules-grid">
              <div className="module-card">
                <h4>🤖 AI Module</h4>
                <p>Response generation with context awareness and multi-language support</p>
              </div>
              <div className="module-card">
                <h4>🔐 Auth Module</h4>
                <p>User authentication with JWT tokens and password reset</p>
              </div>
              <div className="module-card">
                <h4>💾 Database Module</h4>
                <p>SQLAlchemy ORM for data persistence</p>
              </div>
              <div className="module-card">
                <h4>🎙️ Voice Modules</h4>
                <p>STT and TTS for voice interaction</p>
              </div>
            </div>

            <h3>Technologies</h3>
            <ul className="feature-list">
              <li>1. FastAPI - Modern web framework</li>
              <li>2. PostgreSQL - Reliable database</li>
              <li>3. Groq API - LLM and STT integration</li>
              <li>4. gTTS - Text-to-speech synthesis</li>
              <li>5. bcrypt - Secure password hashing</li>
            </ul>
          </section>

          {/* Database */}
          <section id="database" className="doc-section">
            <h2>Database Schema</h2>
            <p>PostgreSQL database with three main tables:</p>

            <h3>Users Table</h3>
            <pre className="code-block">{`CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);`}</pre>

            <h3>Chat Messages Table</h3>
            <pre className="code-block">{`CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    user_id UUID FOREIGN KEY REFERENCES users(id),
    message_text TEXT NOT NULL,
    response_text TEXT,
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sentiment_analysis JSONB
);`}</pre>

            <h3>User Preferences Table</h3>
            <pre className="code-block">{`CREATE TABLE user_preferences (
    id UUID PRIMARY KEY,
    user_id UUID FOREIGN KEY REFERENCES users(id),
    language VARCHAR(10) DEFAULT 'english',
    theme VARCHAR(10) DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    voice_input_enabled BOOLEAN DEFAULT TRUE,
    voice_output_enabled BOOLEAN DEFAULT TRUE
);`}</pre>
          </section>

          {/* API Endpoints */}
          <section id="api" className="doc-section">
            <h2>API Endpoints</h2>

            <h3>Authentication</h3>
            <div className="endpoint">
              <div className="endpoint-method post">POST</div>
              <div className="endpoint-path">/auth/register</div>
              <p>Register a new user account</p>
            </div>

            <div className="endpoint">
              <div className="endpoint-method post">POST</div>
              <div className="endpoint-path">/auth/login</div>
              <p>Login and receive authentication token</p>
            </div>

            <div className="endpoint">
              <div className="endpoint-method post">POST</div>
              <div className="endpoint-path">/auth/logout</div>
              <p>Logout and invalidate current session</p>
            </div>

            <h3>Chat</h3>
            <div className="endpoint">
              <div className="endpoint-method post">POST</div>
              <div className="endpoint-path">/chat/message</div>
              <p>Send a chat message and get AI response</p>
            </div>

            <div className="endpoint">
              <div className="endpoint-method get">GET</div>
              <div className="endpoint-path">/chat/history</div>
              <p>Get user's chat message history</p>
            </div>

            <div className="endpoint">
              <div className="endpoint-method post">POST</div>
              <div className="endpoint-path">/chat/voice</div>
              <p>Send voice message and get voice response</p>
            </div>

            <h3>User</h3>
            <div className="endpoint">
              <div className="endpoint-method get">GET</div>
              <div className="endpoint-path">/user/profile</div>
              <p>Get current user's profile information</p>
            </div>

            <div className="endpoint">
              <div className="endpoint-method put">PUT</div>
              <div className="endpoint-path">/user/preferences</div>
              <p>Update user preferences and settings</p>
            </div>
          </section>

          {/* Authentication */}
          <section id="auth" className="doc-section">
            <h2>Authentication & Security</h2>

            <h3>Authentication Flow</h3>
            <ol className="flow-list">
              <li>User creates account with email/password</li>
              <li>Password hashed using bcrypt (10 rounds)</li>
              <li>User logs in with email/password</li>
              <li>JWT token generated and stored in HttpOnly cookie</li>
              <li>Protected routes require valid JWT token</li>
            </ol>

            <h3>Security Measures</h3>
            <div className="security-grid">
              <div className="security-item">
                <h4>🔐 Password Security</h4>
                <p>Bcrypt hashing, minimum 8 characters, complex requirements</p>
              </div>
              <div className="security-item">
                <h4>🔑 JWT Tokens</h4>
                <p>7-day expiration, HttpOnly cookies, automatic refresh</p>
              </div>
              <div className="security-item">
                <h4>🛡️ CORS Protection</h4>
                <p>Limited to authorized domains only</p>
              </div>
              <div className="security-item">
                <h4>⚠️ Rate Limiting</h4>
                <p>Prevent brute force and abuse attacks</p>
              </div>
            </div>

            <h3>Environment Variables Required</h3>
            <pre className="code-block">{`GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://user:password@host:5432/mindvarta
SECRET_KEY=your_jwt_secret
SMTP_SERVER=your_smtp_server
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_email_password`}</pre>
          </section>

          {/* AI Module */}
          <section id="ai" className="doc-section">
            <h2>AI Module</h2>

            <h3>Response Generation Pipeline</h3>
            <div className="pipeline">
              <div className="pipeline-step">1. Language Detection</div>
              <div className="pipeline-step">2. Context Extraction</div>
              <div className="pipeline-step">3. Prompt Engineering</div>
              <div className="pipeline-step">4. Groq API Call</div>
              <div className="pipeline-step">5. Response Post-Processing</div>
            </div>

            <h3>Features</h3>
            <ul className="feature-list">
              <li>1. Multi-language support (English, Hindi, Bengali)</li>
              <li>2. Context-aware responses</li>
              <li>3. Sentiment analysis integration</li>
              <li>4. Free tier usage limits (5 messages/day)</li>
              <li>5. Conversation history consideration</li>
              <li>6. Empathetic response generation</li>
            </ul>

            <h3>Free Tier Limits</h3>
            <div className="limits-box">
              <p>📊 <strong>Messages per day:</strong> 5</p>
              <p>⏱️ <strong>Response timeout:</strong> 30 seconds</p>
              <p>📝 <strong>Max context length:</strong> 10 previous messages</p>
            </div>
          </section>

          {/* Voice Features */}
          <section id="voice" className="doc-section">
            <h2>Voice Features (STT & TTS)</h2>

            <h3>Speech-to-Text (STT)</h3>
            <div className="voice-feature">
              <h4>📢 Transcriber Module</h4>
              <ul>
                <li>Converts audio files to text</li>
                <li>Supported formats: WAV, MP3, OGG</li>
                <li>Automatic language detection</li>
                <li>Audio preprocessing and normalization</li>
              </ul>
            </div>

            <h3>Text-to-Speech (TTS)</h3>
            <div className="voice-feature">
              <h4>🔊 Synthesizer Module</h4>
              <ul>
                <li>Converts response text to audio</li>
                <li>Multi-language support</li>
                <li>Natural pronunciation</li>
                <li>Adjustable speech rate</li>
              </ul>
            </div>

            <h3>Supported Languages</h3>
            <div className="languages">
              <span className="lang-badge">🇬🇧 English (en)</span>
              <span className="lang-badge">🇮🇳 Hindi (hi)</span>
              <span className="lang-badge">🇧🇩 Bengali (bn)</span>
            </div>
          </section>

          {/* Setup */}
          <section id="setup" className="doc-section">
            <h2>Installation & Setup</h2>

            <h3>Prerequisites</h3>
            <ul className="feature-list">
              <li>1. Node.js 16+ (for frontend)</li>
              <li>2. Python 3.9+ (for backend)</li>
              <li>3. PostgreSQL 12+ (for database)</li>
              <li>4. Git</li>
            </ul>

            <h3>Frontend Setup</h3>
            <pre className="code-block">{`cd frontend-MindTalk
npm install
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint`}</pre>

            <h3>Backend Setup</h3>
            <pre className="code-block">{`cd backend-MindTalk
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env      # Edit with your config
python database/init_db.py
uvicorn app:app --reload`}</pre>

            <h3>Access Points</h3>
            <ul className="access-list">
              <li>🌐 <strong>Frontend:</strong> http://localhost:5173</li>
              <li>🔌 <strong>Backend API:</strong> http://localhost:8000</li>
              <li>📚 <strong>API Docs:</strong> http://localhost:8000/docs</li>
            </ul>
          </section>

          {/* Development Workflow */}
          <section id="workflow" className="doc-section">
            <h2>Development Workflow</h2>

            <h3>Code Structure</h3>
            <div className="code-structure">
              <div className="structure-item">
                <h4>Frontend</h4>
                <p>Components → Styles → Context → Hooks → Pages</p>
              </div>
              <div className="structure-item">
                <h4>Backend</h4>
                <p>Routes → Modules → Business Logic → Database</p>
              </div>
            </div>

            <h3>Git Workflow</h3>
            <pre className="code-block">{`git checkout -b feature/feature-name
git add .
git commit -m "Description of changes"
git push origin feature/feature-name
# Create Pull Request on GitHub`}</pre>

            <h3>Best Practices</h3>
            <ul className="feature-list">
              <li>1. Write semantic commits</li>
              <li>2. Keep branches focused on single features</li>
              <li>3. Test before pushing</li>
              <li>4. Update documentation with changes</li>
              <li>5. Use environment variables for secrets</li>
            </ul>
          </section>

          {/* Deployment */}
          <section id="deployment" className="doc-section">
            <h2>Deployment</h2>

            <h3>Frontend Deployment</h3>
            <div className="deployment-option">
              <h4>Vercel / Netlify</h4>
              <pre className="code-block">{`npm run build
vercel  # or netlify deploy`}</pre>
            </div>

            <h3>Backend Deployment</h3>
            <div className="deployment-option">
              <h4>Heroku</h4>
              <pre className="code-block">{`heroku create your-app-name
heroku config:set GROQ_API_KEY=your_key
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main`}</pre>
            </div>

            <h3>Docker Support</h3>
            <pre className="code-block">{`# Build Docker image
docker build -t mindvarta-backend .

# Run container
docker run -p 8000:8000 mindvarta-backend`}</pre>

            <div className="deployment-checklist">
              <h4> Pre-deployment Checklist</h4>
              <ul>
                <li>Environment variables configured</li>
                <li>Database migrated and ready</li>
                <li>SSL/TLS certificates installed</li>
                <li>CORS origins configured</li>
                <li>Monitoring and logging setup</li>
                <li>Backup strategy in place</li>
              </ul>
            </div>
          </section> 

          {/* Footer */}
          <section className="doc-footer">
            <hr />
            <p>
              <strong>Last Updated:</strong> April 2024 | 
              <strong> License:</strong> MIT | 
              <strong> Contact:</strong> support@mindvarta.com
            </p>
            <p>
              For more information, visit our <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}
