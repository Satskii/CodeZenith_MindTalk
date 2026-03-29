import React, { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useChat } from '../../context/ChatContext'
import '../../styles/settings.css'

export default function SettingsModal({ open, onClose }) {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useChat()

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Settings">
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Appearance */}
          <section className="settings-section">
            <h3 className="settings-section-title">Appearance</h3>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Theme</span>
                <span className="settings-row-desc">Choose between dark and light mode</span>
              </div>
              <div className="theme-toggle-group">
                <button
                  className={`theme-opt${theme === 'dark' ? ' active' : ''}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                >
                  🌙 Dark
                </button>
                <button
                  className={`theme-opt${theme === 'light' ? ' active' : ''}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                >
                  ☀️ Light
                </button>
              </div>
            </div>
          </section>

          {/* Language */}
          <section className="settings-section">
            <h3 className="settings-section-title">Language</h3>
            <div className="settings-row settings-row--column">
              <div className="settings-row-info">
                <span className="settings-row-label">Response Language</span>
                <span className="settings-row-desc">MindTalk will reply in your chosen language</span>
              </div>
              <div className="lang-toggle-group">
                {[
                  { value: 'english', label: 'English' },
                  { value: 'hindi',   label: 'हिंदी' },
                  { value: 'bengali', label: 'বাংলা' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    className={`theme-opt${language === value ? ' active' : ''}`}
                    onClick={() => setLanguage(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Voice */}
          <section className="settings-section">
            <h3 className="settings-section-title">Voice & Audio</h3>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Voice Responses</span>
                <span className="settings-row-desc">Have MindTalk speak its replies aloud</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Microphone Input</span>
                <span className="settings-row-desc">Allow voice messages</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>
          </section>

          {/* Privacy */}
          <section className="settings-section">
            <h3 className="settings-section-title">Privacy</h3>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Save Conversation History</span>
                <span className="settings-row-desc">Store chats locally for future access</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Anonymous Mode</span>
                <span className="settings-row-desc">Don't store any session data</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider" />
              </label>
            </div>
          </section>

          {/* About */}
          <section className="settings-section">
            <h3 className="settings-section-title">About</h3>
            <div className="settings-about">
              <p className="settings-about-name">MindTalk</p>
              <p className="settings-about-version">Version 1.0.0 — Frontend Preview</p>
              <p className="settings-about-desc">
                A confidential mental health support platform for students.
                Available 24/7, wherever you are.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
