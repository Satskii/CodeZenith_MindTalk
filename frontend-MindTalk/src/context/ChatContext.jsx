import { createContext, useContext, useState, useRef } from 'react'

const ChatContext = createContext()

const API_BASE_URL = 'http://localhost:5000'
const FREE_LIMIT = 10

async function speakText(text, language) {
  try {
    const res = await fetch(`${API_BASE_URL}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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
  const [conversations, setConversations] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([{
    id: 1,
    role: 'assistant',
    text: "Hello! I'm here to provide support for your mental health concerns. How are you feeling today?",
    timestamp: new Date(),
  }])
  const [isLoading, setIsLoading] = useState(false)
  const [messagesUsed, setMessagesUsed] = useState(0)
  const [limitReached, setLimitReached] = useState(false)
  const [language, setLanguage] = useState('english')
  const [muted, setMuted] = useState(false)
  const convIdRef = useRef(null)

  const addMessage = (msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now(), timestamp: new Date() }])
  }

  const loadConversations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`, { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (_) {}
  }

  const startNewChat = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      convIdRef.current = data.conv_id
      setActiveChatId(data.conv_id)
      setConversations(prev => [
        { conv_id: data.conv_id, title: data.title, msg_count: 0 },
        ...prev,
      ])
    } catch (_) {
      convIdRef.current = null
    }
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
      if (convIdRef.current) body.conv_id = convIdRef.current

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const data = await response.json()
      const errorDetail = data.detail || data

      if (response.status === 429 && errorDetail.error === 'free_limit_reached') {
        setLimitReached(true)
        addMessage({
          role: 'assistant',
          text: `You've reached the free limit of ${FREE_LIMIT} messages. Start a new chat to continue.`,
        })
        return
      }

      if (!response.ok) {
        throw new Error(errorDetail.error || errorDetail.detail || 'Failed to get response from server')
      }

      if (data.conv_id) convIdRef.current = data.conv_id
      if (data.messages_used !== undefined) setMessagesUsed(data.messages_used)
      if (data.messages_remaining === 0) setLimitReached(true)

      addMessage({ role: 'assistant', text: data.response })
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
    convIdRef.current = id
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
      loadConversations,
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
