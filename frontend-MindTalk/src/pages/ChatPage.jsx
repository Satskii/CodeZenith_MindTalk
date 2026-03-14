import React, { useState } from 'react'
import Sidebar from '../components/chat/Sidebar'
import ChatHeader from '../components/chat/ChatHeader'
import MessageList from '../components/chat/MessageList'
import ChatInput from '../components/chat/ChatInput'
import { useChat } from '../context/ChatContext'
import '../styles/chat.css'

export default function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [muted, setMuted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { addMessage } = useChat()

  const handleSend = (text) => {
    // Add user message
    addMessage({ role: 'user', text })

    // Simulate bot response (replace with real backend call)
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage({
        role: 'assistant',
        text: "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you've been feeling lately?",
      })
    }, 1800)
  }

  return (
    <div className="chat-layout">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="chat-main">
        <ChatHeader
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
          muted={muted}
          onToggleMute={() => setMuted(m => !m)}
        />

        <MessageList isTyping={isTyping} />

        <ChatInput onSend={handleSend} isTyping={isTyping} />
      </div>
    </div>
  )
}
