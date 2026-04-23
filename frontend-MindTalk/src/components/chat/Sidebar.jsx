import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useChat } from '../../context/ChatContext'
import SettingsModal from './SettingsModal'

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { conversations, activeChatId, startNewChat, selectConversation } = useChat()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {/* Header */}
      <div className="sidebar-header">
        <span className="sidebar-logo">MindVarta</span>
        <button
          className="sidebar-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* New Chat */}
      <button className="new-chat-btn" onClick={startNewChat}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        New Chat
      </button>

      {/* Conversations */}
      <div className="conversations-section">
        <p className="conversations-label">Recent Conversations</p>
        {conversations.map(conv => (
          <div
            key={conv.conv_id}
            className={`conversation-item${activeChatId === conv.conv_id ? ' active' : ''}`}
            onClick={() => selectConversation(conv.conv_id)}
          >
            <span className="conversation-icon"><ChatIcon /></span>
            <div className="conversation-info">
              <div className="conversation-title">{conv.title}</div>
              <div className="conversation-time">
                {conv.updated_at ? new Date(conv.updated_at).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div className="sidebar-footer">
        <button className="sidebar-nav-btn" onClick={() => navigate('/')}>
          <HomeIcon /> Home
        </button>
        <button className="sidebar-nav-btn" onClick={() => setSettingsOpen(true)}>
          <SettingsIcon /> Settings
        </button>
      </div>
    </aside>
  )
}
