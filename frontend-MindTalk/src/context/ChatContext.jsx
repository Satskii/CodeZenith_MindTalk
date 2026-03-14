import React, { createContext, useContext, useState } from 'react'

const ChatContext = createContext()

const SAMPLE_CONVERSATIONS = [
  { id: 1, title: 'Stress management te...', time: '2h ago', messages: [] },
  { id: 2, title: 'Dealing with exam anxi...', time: '1d ago', messages: [] },
  { id: 3, title: 'Sleep improvement str...', time: '3d ago', messages: [] },
]

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS)
  const [activeChatId, setActiveChatId] = useState(1)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: "Hello! I'm here to provide support for your mental health concerns. How are you feeling today?",
      timestamp: new Date(),
    }
  ])

  const startNewChat = () => {
    const newId = Date.now()
    const newConvo = { id: newId, title: 'New conversation', time: 'just now', messages: [] }
    setConversations(prev => [newConvo, ...prev])
    setActiveChatId(newId)
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        text: "Hello! I'm here to provide support for your mental health concerns. How are you feeling today?",
        timestamp: new Date(),
      }
    ])
  }

  const addMessage = (msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now(), timestamp: new Date() }])
  }

  const selectConversation = (id) => {
    setActiveChatId(id)
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      activeChatId,
      messages,
      startNewChat,
      addMessage,
      selectConversation,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}
