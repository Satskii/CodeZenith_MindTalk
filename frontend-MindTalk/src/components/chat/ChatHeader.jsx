import React, { useState, useRef, useEffect } from 'react'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
]

export default function ChatHeader({ onToggleSidebar, muted, onToggleMute }) {
  const [lang, setLang] = useState(LANGUAGES[0])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

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
        {/* Sidebar toggle */}
        <button className="sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>

        {/* Language selector */}
        <div className="language-selector" ref={dropdownRef} onClick={() => setOpen(o => !o)}>
          <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
          <span>{lang.label}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>

          {open && (
            <div className="language-dropdown">
              {LANGUAGES.map(l => (
                <div
                  key={l.code}
                  className={`lang-option${lang.code === l.code ? ' selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setLang(l); setOpen(false) }}
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

        {/* Mic */}
        <button className="header-icon-btn" aria-label="Voice input">
          🎙️
        </button>

        {/* Avatar */}
        <div className="avatar-btn" title="Profile">
          MT
        </div>
      </div>
    </header>
  )
}
