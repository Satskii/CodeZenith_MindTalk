import { useState, useRef, useCallback } from 'react'

const API_BASE_URL = 'http://localhost:5000'

/**
 * useVoice — records audio via MediaRecorder, sends to Whisper STT endpoint,
 * and calls onTranscript(text) with the result.
 */
export function useVoice({ onTranscript, language = 'english' }) {
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })

        // Send to Whisper STT endpoint
        setTranscribing(true)
        try {
          const formData = new FormData()
          formData.append('audio', blob, 'recording.webm')
          formData.append('language', language)

          const res = await fetch(`${API_BASE_URL}/transcribe`, {
            method: 'POST',
            body: formData,
          })

          const data = await res.json()
          if (res.ok && data.transcript) {
            onTranscript(data.transcript)
          } else {
            console.error('STT error:', data.error)
          }
        } catch (err) {
          console.error('Transcription request failed:', err)
        } finally {
          setTranscribing(false)
        }
      }

      mr.start()
      setRecording(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }, [language, onTranscript])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }, [])

  const toggleRecording = useCallback(() => {
    if (recording) stopRecording()
    else startRecording()
  }, [recording, startRecording, stopRecording])

  return { recording, transcribing, toggleRecording }
}
