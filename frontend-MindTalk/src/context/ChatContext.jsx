import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ChatContext = createContext()

const API_BASE_URL = 'http://localhost:8000'
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
  const { language: authLanguage } = useAuth()
  
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
  const [language, setLanguageState] = useState('english')
  const [muted, setMuted] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const convIdRef = useRef(null)

  // Initialize language from auth context when it changes
  useEffect(() => {
    if (authLanguage) {
      setLanguageState(authLanguage)
    }
  }, [authLanguage])

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
    setReadOnly(false)
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
    setReadOnly(true)
    
    // Fetch messages for the selected conversation
    fetch(`${API_BASE_URL}/conversations/${id}/messages`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.messages) {
          // Format messages for display
          const formattedMessages = data.messages.map((msg, idx) => ({
            id: idx,
            role: msg.role,
            text: msg.content,
            timestamp: new Date()
          }))
          setMessages(formattedMessages)
        }
      })
      .catch(err => console.error('Error loading conversation messages:', err))
  }

  // Wrapper for setLanguage to handle language change
  const setLanguage = (newLang) => {
    setLanguageState(newLang)
    // Start a new chat when language changes
    startNewChat()
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
      readOnly,
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
