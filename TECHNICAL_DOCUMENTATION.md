# MindVarta - Complete Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Frontend Application](#frontend-application)
4. [Backend Application](#backend-application)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Security](#authentication--security)
8. [AI Module](#ai-module)
9. [Voice Features (STT & TTS)](#voice-features-stt--tts)
10. [Installation & Setup](#installation--setup)
11. [Development Workflow](#development-workflow)
12. [Deployment](#deployment)

---

## Project Overview

**MindVarta** is a confidential, AI-powered mental health support chatbot that provides 24/7 assistance in multiple languages. The platform combines modern web technologies with advanced AI capabilities to create a safe, accessible space for users to discuss their thoughts and feelings.

### Key Features

- 🔒 **Confidential & Secure**: End-to-end encryption and secure data storage
- 🤖 **AI-Powered Responses**: Leverages Groq's LLM API for intelligent, empathetic responses
- 🗣️ **Multi-Lingual Support**: English, Hindi, and Bengali language support
- 🎙️ **Voice Integration**: Speech-to-Text (STT) and Text-to-Speech (TTS) capabilities
- 🌙 **Dark/Light Theme**: User-friendly theme switching
- 📱 **Responsive Design**: Works seamlessly across devices

### Tech Stack

**Frontend:**
- React 19 with React Router for navigation
- Vite as the build tool
- Context API for state management
- CSS3 for styling with animations

**Backend:**
- FastAPI for high-performance REST API
- PostgreSQL for persistent data storage
- SQLAlchemy for ORM
- Groq API for AI responses
- Google Text-to-Speech (gTTS) for voice synthesis
- SpeechRecognition for audio transcription

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER / CLIENT                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                      │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │ • LandingPage       (Public)                            │  │
│  │ • AuthPage          (Login/Register)                    │  │
│  │ • ChatPage          (Main Chat Interface)               │  │
│  │ • ForgotPasswordPage (Password Recovery)                │  │
│  │ • ResetPasswordPage  (Password Reset)                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                     HTTP/HTTPS (JSON)                          │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────┐
        │      FastAPI Backend Server              │
        ├──────────────────────────────────────────┤
        │ • Authentication & Authorization         │
        │ • Chat Message Processing               │
        │ • AI Response Generation                │
        │ • Voice Processing (STT/TTS)            │
        │ • Context Extraction & Analysis         │
        └──────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌────────┐  ┌────────┐  ┌────────────┐
    │ PostgreSQL│ Groq API│ Google TTS  │
    │ Database │ (LLM)   │ (Synthesis) │
    └────────┘  └────────┘  └────────────┘
```

### Key Components

#### Frontend Components
- **LandingPage**: Public-facing homepage
- **AuthPage**: User login and registration
- **ChatPage**: Main chat interface with message history
- **ChatHeader**: Displays user info and settings
- **ChatInput**: Message input with voice support
- **MessageList**: Displays conversation messages
- **Sidebar**: Navigation and chat history
- **SettingsModal**: User preferences

#### Backend Modules
- **AI Module**: Response generation and context analysis
- **Auth Module**: User authentication and session management
- **Database Module**: Data persistence and queries
- **STT Module**: Speech-to-text transcription
- **TTS Module**: Text-to-speech synthesis

---

## Frontend Application

### Directory Structure

```
frontend-MindTalk/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── SettingsModal.jsx
│   │   │   └── Sidebar.jsx
│   │   └── landing/
│   │       └── LandingPage.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   └── useVoice.js
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── DocumentationPage.jsx (NEW)
│   ├── styles/
│   │   ├── auth.css
│   │   ├── chat.css
│   │   ├── documentation.css (NEW)
│   │   ├── global.css
│   │   ├── landing.css
│   │   └── settings.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

### Key Files

#### App.jsx
Main routing and application wrapper component.

#### Context API
- **AuthContext**: Manages user authentication state and functions
- **ChatContext**: Manages chat messages and conversation state
- **ThemeContext**: Manages dark/light theme state

#### useVoice Hook
Custom hook for voice recording and audio processing.

### Styling

The frontend uses a custom CSS framework with:
- CSS Variables for theming
- Flexbox and CSS Grid for layouts
- Animations and transitions for UX
- Responsive breakpoints for mobile/tablet/desktop

---

## Backend Application

### Directory Structure

```
backend-MindTalk/
├── app.py                 # Main FastAPI application
├── requirements.txt       # Python dependencies
├── ai_module/
│   ├── main.py
│   ├── config.py
│   ├── context_extractor.py
│   ├── response_generator.py
│   ├── models/
│   └── prompts/
│       ├── behavior_prompt.txt
│       ├── formatting_prompt.txt
│       └── language_prompts.py
├── auth/
│   ├── __init__.py
│   ├── dependencies.py
│   ├── email.py
│   └── utils.py
├── database/
│   ├── __init__.py
│   ├── config.py
│   ├── connection.py
│   ├── init_db.py
│   ├── models.py
│   └── repository.py
├── stt_module/
│   ├── __init__.py
│   ├── config.py
│   └── transcriber.py
└── tts_module/
    ├── __init__.py
    ├── config.py
    └── synthesizer.py
```

### Core Modules

#### AI Module
Handles intelligent response generation with context awareness.

**Key Files:**
- `response_generator.py`: Generates AI responses using Groq API
- `context_extractor.py`: Analyzes conversation context for better responses
- `config.py`: AI configuration and model settings
- `prompts/`: System prompts for behavior and formatting

**Features:**
- Context-aware responses
- Multi-language support
- Free tier usage limits
- Conversation history consideration

#### Auth Module
Manages user authentication and security.

**Key Files:**
- `utils.py`: Password hashing, JWT token generation
- `dependencies.py`: FastAPI dependency injection for route protection
- `email.py`: Email sending for password reset

**Features:**
- Secure password hashing with bcrypt
- JWT-based session management
- Email-based password recovery
- Protected routes with token validation

#### Database Module
Persistent data storage and retrieval.

**Key Files:**
- `models.py`: SQLAlchemy ORM models
- `connection.py`: Database connection pooling
- `repository.py`: Data access layer
- `init_db.py`: Database initialization and migration

**Supported Models:**
- User (accounts, authentication)
- ChatMessage (conversation history)
- UserPreferences (settings, language)

#### STT Module (Speech-to-Text)
Converts audio input to text.

**Features:**
- Supports multiple audio formats (WAV, MP3, OGG)
- Language detection
- Audio preprocessing

#### TTS Module (Text-to-Speech)
Converts text responses to audio.

**Features:**
- Multi-language synthesis
- Audio format conversion
- Speed adjustment

---

## Database Schema

### User Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### ChatMessage Table
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    user_id UUID FOREIGN KEY REFERENCES users(id),
    message_text TEXT NOT NULL,
    response_text TEXT,
    language VARCHAR(10),
    is_voice_input BOOLEAN DEFAULT FALSE,
    is_voice_output BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sentiment_analysis JSONB,
    context_tags JSONB
);
```

### UserPreferences Table
```sql
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY,
    user_id UUID FOREIGN KEY REFERENCES users(id),
    language VARCHAR(10) DEFAULT 'english',
    theme VARCHAR(10) DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    voice_input_enabled BOOLEAN DEFAULT TRUE,
    voice_output_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "username"
}

Response: 200 OK
{
  "message": "User registered successfully"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: 200 OK
Set-Cookie: auth_token=<jwt_token>; HttpOnly; Max-Age=604800
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  }
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Logout successful"
}
```

#### Request Password Reset
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "Password reset email sent"
}
```

#### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "new_password": "newpassword"
}

Response: 200 OK
{
  "message": "Password reset successfully"
}
```

### Chat Endpoints

#### Send Message
```
POST /chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I'm feeling anxious",
  "language": "english"
}

Response: 200 OK
{
  "id": "message_uuid",
  "user_message": "I'm feeling anxious",
  "response": "I understand you're feeling anxious...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Get Chat History
```
GET /chat/history?limit=50&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "messages": [
    {
      "id": "uuid",
      "user_message": "...",
      "response": "...",
      "created_at": "...",
      "language": "english"
    }
  ],
  "total": 150
}
```

#### Voice Message
```
POST /chat/voice
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "audio": <audio_file>,
  "language": "english"
}

Response: 200 OK
{
  "id": "message_uuid",
  "transcribed_text": "...",
  "response": "...",
  "audio_url": "/audio/response_uuid.wav"
}
```

### User Endpoints

#### Get User Profile
```
GET /user/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Update User Preferences
```
PUT /user/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "hindi",
  "theme": "light",
  "notifications_enabled": true,
  "voice_input_enabled": true
}

Response: 200 OK
{
  "message": "Preferences updated successfully"
}
```

---

## Authentication & Security

### Authentication Flow

1. **Registration**: User creates account with email/password
2. **Password Hashing**: Passwords are hashed using bcrypt (10 rounds)
3. **Login**: User credentials are verified
4. **Token Generation**: JWT token is generated and stored in HttpOnly cookie
5. **Protected Routes**: All sensitive endpoints require valid JWT token

### Security Measures

- **HTTPS Only**: All communication must be encrypted
- **CORS Protection**: Limited to authorized domains
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: Prevent brute force attacks
- **Password Requirements**:
  - Minimum 8 characters
  - Mix of uppercase, lowercase, numbers, and symbols
- **Session Management**:
  - Tokens expire after 7 days
  - Automatic refresh mechanism
  - Secure logout clears all sessions

### Environment Variables Required

```
# Backend
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://user:password@host:5432/mindvarta
SECRET_KEY=your_jwt_secret
SMTP_SERVER=your_smtp_server
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_email_password
```

---

## AI Module

### Response Generation Pipeline

```
User Input
    │
    ├─ Language Detection
    │
    ├─ Text Preprocessing
    │
    ├─ Context Extraction
    │        │
    │        ├─ Previous Messages
    │        ├─ User Preferences
    │        └─ Sentiment Analysis
    │
    ├─ Prompt Engineering
    │        │
    │        ├─ System Prompt
    │        ├─ Behavior Instructions
    │        ├─ Context Integration
    │        └─ Language-Specific Formatting
    │
    ├─ Groq API Call
    │
    ├─ Response Post-Processing
    │
    └─ Response Storage
```

### AI Configuration

**Free Tier Limits:**
- 5 messages per day
- Response generation timeout: 30 seconds
- Max context length: 10 previous messages

**Model Used:**
- Groq's high-speed LLM API
- Fast inference with minimal latency
- Multi-language capabilities

### Behavior Prompts

The system uses specialized prompts to guide AI behavior:
- **Empathy**: Responds with understanding and compassion
- **Boundary Setting**: Clearly states limitations and when to seek professional help
- **Non-Judgment**: Maintains neutral, supportive tone
- **Language Awareness**: Adapts response style to user's language

---

## Voice Features (STT & TTS)

### Speech-to-Text (STT)

**Transcriber Module:**
- Converts audio files to text
- Supports: WAV, MP3, OGG formats
- Uses SpeechRecognition library
- Automatic language detection

**Process:**
1. Audio file upload
2. Audio preprocessing (normalization, noise reduction)
3. Transcription
4. Text validation
5. Language detection

### Text-to-Speech (TTS)

**Synthesizer Module:**
- Converts response text to audio
- Multi-language support (English, Hindi, Bengali)
- Uses Google Text-to-Speech (gTTS)

**Features:**
- Adjustable speech rate
- Natural pronunciation
- Language-specific voice optimization

**Supported Languages:**
- English (en)
- Hindi (hi)
- Bengali (bn)

---

## Installation & Setup

### Prerequisites

- Node.js 16+ (for frontend)
- Python 3.9+ (for backend)
- PostgreSQL 12+ (for database)
- Git

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend-MindTalk

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend-MindTalk

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python database/init_db.py

# Start server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Environment Configuration

Create a `.env` file in the backend directory:

```env
# API Keys
GROQ_API_KEY=your_groq_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mindvarta

# JWT Secret
SECRET_KEY=your_super_secret_key_change_this

# SMTP for Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# API Port
API_PORT=8000
API_HOST=0.0.0.0
```

---

## Development Workflow

### Local Development

1. **Start Backend**
   ```bash
   cd backend-MindTalk
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn app:app --reload
   ```

2. **Start Frontend**
   ```bash
   cd frontend-MindTalk
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Code Structure Guidelines

**Frontend:**
- Components in `src/components/`
- Styles co-located with components or in `src/styles/`
- Context providers in `src/context/`
- Custom hooks in `src/hooks/`
- Pages in `src/pages/`

**Backend:**
- Route handlers in `app.py`
- Business logic in respective modules
- Database queries in `database/repository.py`
- Models in `database/models.py`
- Configuration in module-level `config.py` files

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/feature-name

# Create Pull Request on GitHub
```

---

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-api.com
   ```

### Backend Deployment (Heroku/Railway/AWS)

1. **Prepare Application**
   ```bash
   # Ensure requirements.txt is up to date
   pip freeze > requirements.txt
   ```

2. **Deploy to Heroku**
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set GROQ_API_KEY=your_key
   git push heroku main
   ```

3. **Database Setup**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   heroku run python database/init_db.py
   ```

### Docker Deployment (Optional)

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Backend Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Lazy load routes
- **Image Optimization**: Use optimized image formats
- **Caching**: Browser caching for static assets
- **Minification**: Vite automatic minification
- **CSS Optimization**: Remove unused styles

### Backend Optimization

- **Database Indexing**: Index frequently queried columns
- **Connection Pooling**: Reuse database connections
- **Caching**: Cache AI responses and context
- **Async Processing**: Use async/await for I/O operations
- **Rate Limiting**: Prevent abuse and overload

---

## Monitoring & Logging

### Key Metrics to Monitor

1. **User Engagement**: Daily/monthly active users
2. **Response Time**: API latency and response generation time
3. **Error Rates**: 4xx and 5xx errors
4. **Database Performance**: Query execution time
5. **AI API Usage**: Token consumption, cost tracking

### Logging Strategy

- **Frontend**: Console errors, user actions
- **Backend**: Request/response logging, error tracking, performance metrics
- **Database**: Query performance, connection pool status
- **AI API**: Response generation time, token usage

### Recommended Tools

- **Analytics**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry, LogRocket
- **Performance**: New Relic, Datadog
- **Logging**: ELK Stack, Cloudwatch

---

## Troubleshooting Guide

### Common Issues

#### 1. CORS Errors
```
Solution: Verify CORS configuration in FastAPI app
Check: FRONTEND_URL matches actual frontend domain
```

#### 2. Database Connection Issues
```
Solution: Verify DATABASE_URL environment variable
Check: PostgreSQL service is running
Check: Network connectivity to database server
```

#### 3. Groq API Errors
```
Solution: Verify GROQ_API_KEY is set correctly
Check: API key hasn't expired or reached quota
Check: Network connectivity to Groq API
```

#### 4. Audio Processing Issues
```
Solution: Verify audio file format is supported
Check: Microphone/speaker permissions granted
Check: Audio drivers are up to date
```

---

## Support & Resources

### Documentation Links
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- PostgreSQL: https://www.postgresql.org/docs/
- Groq API: https://console.groq.com/docs

### Community
- GitHub Issues: Report bugs and suggest features
- Discussions: Ask questions and share ideas
- Contributing: See CONTRIBUTING.md for guidelines

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial release |
| 1.1.0 | Planned | Voice feature enhancements |
| 1.2.0 | Planned | Multi-language improvements |
| 2.0.0 | Planned | Enhanced AI capabilities |

---

**Last Updated**: April 2024  
**License**: MIT  
**Contact**: support@mindvarta.com
