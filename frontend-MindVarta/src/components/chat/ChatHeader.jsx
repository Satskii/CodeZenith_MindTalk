import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '../../context/ChatContext'
import MindVartaLogo from '../../assets/MindVarta_Logo.png'

const LANGUAGES = [
  { code: 'english', label: 'English', flag: '🇬🇧' },
  { code: 'hindi',   label: 'हिंदी',   flag: '🇮🇳' },
  { code: 'bengali', label: 'বাংলা',   flag: '🇧🇩' },
]

export default function ChatHeader({ onToggleSidebar, muted, onToggleMute }) {
  const { language, setLanguage, isViewingPreviousChat, returnToCurrentChat } = useChat()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const activeLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        {/* Back button - show when viewing previous chat */}
        {isViewingPreviousChat && (
          <button 
            className="back-btn" 
            onClick={returnToCurrentChat} 
            aria-label="Back to current chat"
            title="Back to current chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
        )}
        
        {/* Sidebar toggle */}
        <button className="sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>

        {/* Language selector */}
        <div className="language-selector" ref={dropdownRef} onClick={() => setOpen(o => !o)}>
          <span style={{ fontSize: '1.1rem' }}>{activeLang.flag}</span>
          <span>{activeLang.label}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>

          {open && (
            <div className="language-dropdown">
              {LANGUAGES.map(l => (
                <div
                  key={l.code}
                  className={`lang-option${activeLang.code === l.code ? ' selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setLanguage(l.code); setOpen(false) }}
                >
                  <span style={{ fontSize: '1rem' }}>{l.flag}</span>
                  {l.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chat-header-right">
        {/* Mute toggle */}
        <button
          className="header-icon-btn"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          title={muted ? 'Unmute responses' : 'Mute responses'}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        {/* Logo */}
        <div className="logo-btn" title="MindVarta">
          <img src={MindVartaLogo} alt="MindVarta Logo" className="logo-image" />
        </div>
      </div>
    </header>
  )
}
