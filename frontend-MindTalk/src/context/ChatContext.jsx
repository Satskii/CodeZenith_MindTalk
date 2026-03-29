import React, { createContext, useContext, useState, useRef } from 'react'

const ChatContext = createContext()

const SAMPLE_CONVERSATIONS = [
  { id: 1, title: 'Stress management te...', time: '2h ago', messages: [] },
  { id: 2, title: 'Dealing with exam anxi...', time: '1d ago', messages: [] },
  { id: 3, title: 'Sleep improvement str...', time: '3d ago', messages: [] },
]

const API_BASE_URL = 'http://localhost:5000'
const FREE_LIMIT = 10

async function speakText(text, language) {
  try {
    const res = await fetch(`${API_BASE_URL}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.onended = () => URL.revokeObjectURL(url)
    audio.play()
  } catch (err) {
    console.error('TTS error:', err)
  }
}

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
  const [isLoading, setIsLoading] = useState(false)
  const [messagesUsed, setMessagesUsed] = useState(0)
  const [limitReached, setLimitReached] = useState(false)
  const [language, setLanguage] = useState('english')
  const [muted, setMuted] = useState(false)
  const sessionIdRef = useRef(null)

  const addMessage = (msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now(), timestamp: new Date() }])
  }

  const startNewChat = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/session/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionIdRef.current, language }),
      })
      const data = await res.json()
      sessionIdRef.current = data.session_id
    } catch (_) {
      sessionIdRef.current = null
    }

    const newId = Date.now()
    setConversations(prev => [{ id: newId, title: 'New conversation', time: 'just now', messages: [] }, ...prev])
    setActiveChatId(newId)
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      text: "Hello! I'm here to provide support for your mental health concerns. How are you feeling today?",
      timestamp: new Date(),
    }])
    setMessagesUsed(0)
    setLimitReached(false)
  }

  const sendMessage = async (userMessage) => {
    if (limitReached) return
    setIsLoading(true)
    addMessage({ role: 'user', text: userMessage })

    try {
      const body = { message: userMessage, language }
      if (sessionIdRef.current) body.session_id = sessionIdRef.current

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.status === 429 && data.error === 'free_limit_reached') {
        setLimitReached(true)
        addMessage({
          role: 'assistant',
          text: `You've reached the free limit of ${FREE_LIMIT} messages. Start a new chat to continue.`,
        })
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from server')
      }

      // Persist session ID returned by backend
      if (data.session_id) sessionIdRef.current = data.session_id
      if (data.messages_used !== undefined) setMessagesUsed(data.messages_used)
      if (data.messages_remaining === 0) setLimitReached(true)

      addMessage({ role: 'assistant', text: data.response })

      // Auto-play TTS if not muted
      if (!muted) speakText(data.response, language)
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage({ role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const selectConversation = (id) => {
    setActiveChatId(id)
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      activeChatId,
      messages,
      isLoading,
      messagesUsed,
      messagesRemaining: FREE_LIMIT - messagesUsed,
      limitReached,
      language,
      setLanguage,
      muted,
      setMuted,
      startNewChat,
      addMessage,
      sendMessage,
      selectConversation,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}
