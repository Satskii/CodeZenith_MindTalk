import { useState, useRef, useCallback } from 'react'

/**
 * useVoice — manages browser MediaRecorder for voice input.
 * Wire `onTranscript` to your backend STT endpoint when ready.
 */
export function useVoice({ onTranscript }) {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
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

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
        // TODO: send `blob` to your backend STT endpoint
        // onTranscript(transcriptFromBackend)
      }

      mr.start()
      setRecording(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }, [])

  const toggleRecording = useCallback(() => {
    if (recording) stopRecording()
    else startRecording()
  }, [recording, startRecording, stopRecording])

  return { recording, audioBlob, toggleRecording, startRecording, stopRecording }
}
