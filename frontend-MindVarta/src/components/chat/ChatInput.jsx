import { useState, useRef, useEffect } from 'react'
import { useChat } from '../../context/ChatContext'
import { useVoice } from '../../hooks/useVoice'

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const MicIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const WAVE_BARS = 12

export default function ChatInput({ onSend, isTyping, readOnly }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)
  const { language } = useChat()

  const { recording, transcribing, toggleRecording } = useVoice({
    language,
    onTranscript: (transcript) => {
      setText(transcript)
      // Auto-focus textarea so user can review/edit before sending
      setTimeout(() => textareaRef.current?.focus(), 50)
    },
  })

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }, [text])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return
    onSend(trimmed)
    setText('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isBusy = recording || transcribing

  return (
    <div className="input-area">
      {readOnly && (
        <div className="read-only-banner">
          📖 Read-Only Mode: You are viewing a past conversation. No new messages can be sent.
        </div>
      )}
      <div className="input-wrapper">
        {isBusy ? (
          <div className="voice-wave-container">
            {Array.from({ length: WAVE_BARS }).map((_, i) => (
              <div
                key={i}
                className="voice-wave-bar"
                style={{
                  height: `${20 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.07}s`,
                  animationDuration: `${0.6 + Math.random() * 0.4}s`,
                }}
              />
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue-bright)', marginLeft: 8, fontWeight: 500 }}>
              {transcribing ? 'Transcribing...' : 'Listening...'}
            </span>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder={readOnly ? "This conversation is in read-only mode" : "Type your message..."}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={readOnly}
            aria-label="Type your message"
          />
        )}

        <div className="input-actions">
          <button
            className={`input-action-btn${recording ? ' recording' : ''}`}
            onClick={toggleRecording}
            disabled={transcribing || isTyping || readOnly}
            aria-label={recording ? 'Stop recording' : 'Start voice input'}
            style={{ color: recording ? '#ef4444' : undefined }}
          >
            <MicIcon active={recording} />
          </button>

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!text.trim() || isTyping || isBusy || readOnly}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
