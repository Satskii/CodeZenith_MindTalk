import React, { useEffect, useRef } from 'react'
import { useChat } from '../../context/ChatContext'

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function TypingIndicator() {
  return (
    <div className="message-row">
      <div className="message-avatar bot">MT</div>
      <div className="typing-indicator">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  )
}

export default function MessageList({ isTyping }) {
  const { messages } = useChat()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="messages-container">
      {messages.map(msg => (
        <div key={msg.id} className={`message-row${msg.role === 'user' ? ' user' : ''}`}>
          <div className={`message-avatar${msg.role === 'user' ? ' user-av' : ' bot'}`}>
            {msg.role === 'user' ? 'U' : 'MT'}
          </div>
          <div className="message-content">
            <div className={`message-bubble${msg.role === 'user' ? ' user' : ' bot'}`}>
              {msg.text}
            </div>
            <span className="message-time">{formatTime(msg.timestamp)}</span>
          </div>
        </div>
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  )
}
