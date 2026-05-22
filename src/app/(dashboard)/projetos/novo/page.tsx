'use client'

import { useState, useRef, useEffect, useTransition, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { createProjectAction, getProjectQuotaAction } from '@/app/actions/projects'
import { PROJECT_LIMIT_REACHED_CODE, type ProjectQuota } from '@/lib/projects/quota-constants'
import { useI18n } from '@/components/i18n/I18nProvider'

type InputTypeId = 'text' | 'audio' | 'document' | 'form' | 'video' | 'images'

const INPUT_TYPE_ITEMS: { id: InputTypeId; icon: ReactNode }[] = [
  {
    id: 'text',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
  {
    id: 'audio',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    id: 'document',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'form',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    id: 'video',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id: 'images',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 8.25h.008v.008H6.75V8.25Z" />
      </svg>
    ),
  },
]

const GUIDED_IDS = ['goal', 'users', 'features', 'deadline', 'integrations'] as const

function ClearMediaButton({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClear}
      className="border-[#FECACA] text-[#B91C1C] hover:bg-red-50 hover:border-[#F87171] hover:text-[#991B1B]"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
      {label}
    </Button>
  )
}

/* ── Áudio ───────────────────────────────────────────────────── */

function AudioInput({ onReady }: { onReady: (file: File | Blob | null) => void }) {
  const { t } = useI18n()
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [audioUrl])

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onReady(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(sec => sec + 1), 1000)
    } catch {
      setError(t('newProject.audioMicDenied'))
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    onReady(file)
  }

  const reset = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    onReady(null)
    setRecordingTime(0)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">{t('newProject.audioTitle')}</h2>
      <p className="text-sm text-[#6B7280] mb-5">{t('newProject.audioIntro')}</p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#EF4444]">{error}</div>
      )}

      {!audioUrl ? (
        <div className="space-y-4">
          {/* Recorder */}
          <div className="flex flex-col items-center gap-4 py-6 border-2 border-dashed border-[#E5E7EB] rounded-xl">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                isRecording
                  ? 'bg-[#EF4444] hover:bg-red-600 animate-pulse'
                  : 'bg-[#1E3A8A] hover:bg-[#1e40af]'
              }`}
            >
              {isRecording ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <div className="text-center">
              {isRecording ? (
                <p className="text-sm font-medium text-[#EF4444]">{t('newProject.recording')} {fmt(recordingTime)}</p>
              ) : (
                <p className="text-sm text-[#6B7280]">{t('newProject.clickToRecord')}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">{t('common.or')}</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:border-[#93C5FD] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {t('newProject.uploadAudio')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
            <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-[#065F46] font-medium">{t('newProject.audioReady')}</span>
          </div>
          <audio controls src={audioUrl} className="w-full rounded-lg" />
          <ClearMediaButton label={t('newProject.clearAudio')} onClear={reset} />
        </div>
      )}
    </Card>
  )
}

/* ── Vídeo ───────────────────────────────────────────────────── */

function VideoInput({ onReady }: { onReady: (file: File | Blob | null) => void }) {
  const { t } = useI18n()
  const [isRecording, setIsRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [videoUrl])

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (previewRef.current) { previewRef.current.srcObject = stream; previewRef.current.play() }

      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
        onReady(blob)
        stream.getTracks().forEach(track => track.stop())
        if (previewRef.current) previewRef.current.srcObject = null
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(sec => sec + 1), 1000)
    } catch {
      setError(t('newProject.cameraDenied'))
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    onReady(file)
  }

  const reset = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      if (previewRef.current) {
        previewRef.current.srcObject = null
      }
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    onReady(null)
    setRecordingTime(0)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">{t('newProject.videoTitle')}</h2>
      <p className="text-sm text-[#6B7280] mb-5">{t('newProject.videoIntro')}</p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#EF4444]">{error}</div>
      )}

      {!videoUrl ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-6 border-2 border-dashed border-[#E5E7EB] rounded-xl">
            {isRecording && (
              <video ref={previewRef} muted className="w-full max-w-xs rounded-lg bg-black" />
            )}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                isRecording
                  ? 'bg-[#EF4444] hover:bg-red-600 animate-pulse'
                  : 'bg-[#1E3A8A] hover:bg-[#1e40af]'
              }`}
            >
              {isRecording ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
            </button>
            <div className="text-center">
              {isRecording ? (
                <p className="text-sm font-medium text-[#EF4444]">{t('newProject.recording')} {fmt(recordingTime)}</p>
              ) : (
                <p className="text-sm text-[#6B7280]">{t('newProject.clickToRecordVideo')}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">{t('common.or')}</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:border-[#93C5FD] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {t('newProject.uploadVideo')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
            <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-[#065F46] font-medium">{t('newProject.videoReady')}</span>
          </div>
          <video controls src={videoUrl} className="w-full rounded-lg bg-black max-h-64" />
          <ClearMediaButton label={t('newProject.clearVideo')} onClear={reset} />
        </div>
      )}
    </Card>
  )
}

/* ── Documento ───────────────────────────────────────────────── */

function DocumentInput({ onReady }: { onReady: (file: File | null) => void }) {
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt'

  const clearFile = () => {
    setFile(null)
    onReady(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFile = (f: File) => {
    setFile(f)
    onReady(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const extIcon: Record<string, string> = {
    pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', txt: '📃',
  }
  const ext = file?.name.split('.').pop()?.toLowerCase() ?? ''

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">{t('newProject.docTitle')}</h2>
      <p className="text-sm text-[#6B7280] mb-5">{t('newProject.docIntro')}</p>

      {!file ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragging ? 'border-[#3B82F6] bg-blue-50' : 'border-[#E5E7EB] hover:border-[#93C5FD] hover:bg-[#F8FAFC]'
          }`}
        >
          <svg className="w-10 h-10 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-[#374151]">{t('newProject.docDrop')}</p>
            <p className="text-xs text-[#9CA3AF] mt-1">{t('newProject.docFormatsHint')}</p>
          </div>
          <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
            <span className="text-2xl">{extIcon[ext] ?? '📎'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111827] truncate">{file.name}</p>
              <p className="text-xs text-[#6B7280]">{formatSize(file.size)}</p>
            </div>
            <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <ClearMediaButton label={t('newProject.clearDocument')} onClear={clearFile} />
        </div>
      )}
    </Card>
  )
}

/* ── Imagens guiadas ─────────────────────────────────────────── */

const MAX_GUIDED_IMAGE_BLOCKS = 10
const MIN_GUIDED_IMAGE_TEXT = 10

type GuidedImageBlockState = {
  id: string
  imageFile: File | null
  previewUrl: string | null
  text: string
}

function newGuidedImageBlock(): GuidedImageBlockState {
  return { id: crypto.randomUUID(), imageFile: null, previewUrl: null, text: '' }
}

function GuidedImagesInput({
  onValid,
  onBlocksChange,
}: {
  onValid: (ok: boolean) => void
  onBlocksChange: (blocks: { imageFile: File; text: string }[]) => void
}) {
  const { t } = useI18n()
  const [blocks, setBlocks] = useState<GuidedImageBlockState[]>(() => [
    newGuidedImageBlock(),
    newGuidedImageBlock(),
  ])

  useEffect(() => {
    return () => {
      blocks.forEach(b => {
        if (b.previewUrl) URL.revokeObjectURL(b.previewUrl)
      })
    }
  }, [blocks])

  useEffect(() => {
    const complete = blocks.filter(
      b => b.imageFile && b.text.trim().length >= MIN_GUIDED_IMAGE_TEXT
    )
    onValid(complete.length > 0)
    onBlocksChange(
      complete.map(b => ({ imageFile: b.imageFile!, text: b.text.trim() }))
    )
  }, [blocks, onValid, onBlocksChange])

  const updateBlocks = (updater: (prev: GuidedImageBlockState[]) => GuidedImageBlockState[]) => {
    setBlocks(updater)
  }

  const setImage = (id: string, file: File) => {
    updateBlocks(prev =>
      prev.map(b => {
        if (b.id !== id) return b
        if (b.previewUrl) URL.revokeObjectURL(b.previewUrl)
        return {
          ...b,
          imageFile: file,
          previewUrl: URL.createObjectURL(file),
        }
      })
    )
  }

  const clearImage = (id: string) => {
    updateBlocks(prev =>
      prev.map(b => {
        if (b.id !== id) return b
        if (b.previewUrl) URL.revokeObjectURL(b.previewUrl)
        return { ...b, imageFile: null, previewUrl: null }
      })
    )
  }

  const setText = (id: string, text: string) => {
    updateBlocks(prev => prev.map(b => (b.id === id ? { ...b, text } : b)))
  }

  const removeBlock = (id: string) => {
    updateBlocks(prev => {
      if (prev.length <= 1) return prev
      const target = prev.find(b => b.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(b => b.id !== id)
    })
  }

  const addBlock = () => {
    updateBlocks(prev =>
      prev.length >= MAX_GUIDED_IMAGE_BLOCKS ? prev : [...prev, newGuidedImageBlock()]
    )
  }

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">{t('newProject.guidedImages.title')}</h2>
      <p className="text-sm text-[#6B7280] mb-5">{t('newProject.guidedImages.intro')}</p>

      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] p-4 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#374151]">
                {t('newProject.guidedImages.blockTitle').replace('{{n}}', String(index + 1))}
              </span>
              {blocks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  className="text-xs text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                >
                  {t('newProject.guidedImages.removeBlock')}
                </button>
              )}
            </div>

            {!block.previewUrl ? (
              <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#93C5FD] hover:bg-white transition-all">
                <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
                <span className="text-sm text-[#6B7280]">{t('newProject.guidedImages.addImage')}</span>
                <span className="text-xs text-[#9CA3AF]">{t('newProject.guidedImages.imageHint')}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) setImage(block.id, f)
                    e.target.value = ''
                  }}
                />
              </label>
            ) : (
              <div className="space-y-2">
                <img
                  src={block.previewUrl}
                  alt=""
                  className="w-full max-h-48 object-contain rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]"
                />
                <ClearMediaButton
                  label={t('newProject.guidedImages.clearImage')}
                  onClear={() => clearImage(block.id)}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-[#374151] mb-1.5 block">
                {t('newProject.guidedImages.textLabel')}
              </label>
              <textarea
                value={block.text}
                onChange={e => setText(block.id, e.target.value)}
                placeholder={t('newProject.guidedImages.textPlaceholder')}
                rows={3}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none leading-relaxed"
              />
              {block.text.length > 0 && block.text.trim().length < MIN_GUIDED_IMAGE_TEXT && (
                <p className="text-xs text-[#F59E0B] mt-1">
                  {t('newProject.guidedImages.textMinHint').replace(
                    '{{n}}',
                    String(MIN_GUIDED_IMAGE_TEXT)
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {blocks.length < MAX_GUIDED_IMAGE_BLOCKS && (
        <button
          type="button"
          onClick={addBlock}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-[#CBD5E1] rounded-lg text-sm font-medium text-[#1E3A8A] hover:border-[#93C5FD] hover:bg-[#F8FAFC] transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t('newProject.guidedImages.addBlock')}
        </button>
      )}

      <p className="text-xs text-[#9CA3AF] mt-4">{t('newProject.guidedImages.footer')}</p>
    </Card>
  )
}

/* ── Formulário guiado ───────────────────────────────────────── */

function GuidedFormInput({
  questions,
  onChange,
  onAnswers,
}: {
  questions: { id: string; label: string; placeholder: string }[]
  onChange: (filled: boolean) => void
  onAnswers: (a: Record<string, string>) => void
}) {
  const { t } = useI18n()
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const update = (id: string, value: string) => {
    const next = { ...answers, [id]: value }
    setAnswers(next)
    onAnswers(next)
    const required = questions.slice(0, 3)
    onChange(required.every(q => (next[q.id] ?? '').trim().length >= 10))
  }

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">{t('newProject.guided.title')}</h2>
      <p className="text-sm text-[#6B7280] mb-5">{t('newProject.guided.intro')}</p>

      <div className="space-y-5">
        {questions.map((q, i) => (
          <div key={q.id}>
            <label className="text-sm font-medium text-[#374151] flex items-center gap-1.5 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs flex items-center justify-center font-semibold flex-shrink-0">
                {i + 1}
              </span>
              {q.label}
              {i >= 3 && <span className="text-[10px] text-[#9CA3AF] font-normal ml-1">{t('common.optional')}</span>}
            </label>
            <textarea
              value={answers[q.id] ?? ''}
              onChange={e => update(q.id, e.target.value)}
              placeholder={q.placeholder}
              rows={2}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none leading-relaxed"
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-[#9CA3AF] mt-4">{t('newProject.guided.footer')}</p>
    </Card>
  )
}

function fillTemplate(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, String(value)),
    template
  )
}

/* ── Main page ───────────────────────────────────────────────── */

export default function NovoProjeto() {
  const router = useRouter()
  const { t } = useI18n()
  const [isPending, startTransition] = useTransition()
  const [quota, setQuota] = useState<ProjectQuota | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [inputType, setInputType] = useState<InputTypeId>('text')
  const [briefing, setBriefing] = useState('')
  const [audioFile, setAudioFile] = useState<File | Blob | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | Blob | null>(null)
  const [hasForm, setHasForm] = useState(false)
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({})
  const [hasGuidedImages, setHasGuidedImages] = useState(false)
  const [guidedImageBlocks, setGuidedImageBlocks] = useState<{ imageFile: File; text: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const guidedQuestions = useMemo(
    () =>
      GUIDED_IDS.map(id => ({
        id,
        label: t(`newProject.guided.${id}`),
        placeholder: t(`newProject.guided.${id}Ph`),
      })),
    [t],
  )

  const inputTypes = useMemo(
    () =>
      INPUT_TYPE_ITEMS.map(item => ({
        ...item,
        label: t(`newProject.input.${item.id}.label`),
        description: t(`newProject.input.${item.id}.desc`),
      })),
    [t],
  )

  useEffect(() => {
    if (inputType !== 'audio') setAudioFile(null)
    if (inputType !== 'document') setDocumentFile(null)
    if (inputType !== 'video') setVideoFile(null)
  }, [inputType])

  useEffect(() => {
    getProjectQuotaAction().then(setQuota)
  }, [])

  const atProjectLimit = quota != null && !quota.isUnlimited && !quota.canCreate

  const isStep2Valid = () => {
    if (inputType === 'text') return briefing.trim().length >= 10
    if (inputType === 'audio') return audioFile !== null
    if (inputType === 'document') return documentFile !== null
    if (inputType === 'form') return hasForm
    if (inputType === 'video') return videoFile !== null
    if (inputType === 'images') return hasGuidedImages && guidedImageBlocks.length > 0
    return false
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) setStep(2)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStep2Valid()) return
    if (atProjectLimit) return
    setError(null)

    if (inputType === 'audio') {
      if (!audioFile) return
      startTransition(async () => {
        try {
          const fd = new FormData()
          fd.append('name', name.trim())
          fd.append('description', description.trim())
          const upload =
            audioFile instanceof File
              ? audioFile
              : new File([audioFile], 'briefing.webm', {
                  type: audioFile.type || 'audio/webm',
                })
          fd.append('audio', upload)
          const res = await fetch('/api/projects/from-audio', { method: 'POST', body: fd })
          const data = (await res.json()) as {
            projectId?: string
            error?: string
            code?: string
          }
          if (!res.ok || !data.projectId) {
            setError(
              data.code === PROJECT_LIMIT_REACHED_CODE
                ? fillTemplate(t('newProject.limitBannerBody'), {
                    used: String(quota?.used ?? 3),
                    limit: String(quota?.limit ?? 3),
                  })
                : (data.error ?? t('newProject.errorAudioCreate'))
            )
            return
          }
          router.push(`/projetos/${data.projectId}`)
        } catch {
          setError(t('newProject.errorAudioSend'))
        }
      })
      return
    }

    if (inputType === 'document') {
      if (!documentFile) return
      startTransition(async () => {
        try {
          const fd = new FormData()
          fd.append('name', name.trim())
          fd.append('description', description.trim())
          fd.append('document', documentFile)
          const res = await fetch('/api/projects/from-document', { method: 'POST', body: fd })
          const data = (await res.json()) as {
            projectId?: string
            error?: string
            code?: string
          }
          if (!res.ok || !data.projectId) {
            setError(
              data.code === PROJECT_LIMIT_REACHED_CODE
                ? fillTemplate(t('newProject.limitBannerBody'), {
                    used: String(quota?.used ?? 3),
                    limit: String(quota?.limit ?? 3),
                  })
                : (data.error ?? t('newProject.errorDocCreate'))
            )
            return
          }
          router.push(`/projetos/${data.projectId}`)
        } catch {
          setError(t('newProject.errorDocSend'))
        }
      })
      return
    }

    if (inputType === 'images') {
      if (!guidedImageBlocks.length) return
      startTransition(async () => {
        try {
          const fd = new FormData()
          fd.append('name', name.trim())
          fd.append('description', description.trim())
          fd.append(
            'payload',
            JSON.stringify({
              blocks: guidedImageBlocks.map(b => ({ text: b.text })),
            })
          )
          guidedImageBlocks.forEach((b, i) => {
            fd.append(`image-${i}`, b.imageFile)
          })
          const res = await fetch('/api/projects/from-images', { method: 'POST', body: fd })
          const data = (await res.json()) as {
            projectId?: string
            error?: string
            code?: string
            warning?: string
          }
          if (!res.ok || !data.projectId) {
            setError(
              data.code === PROJECT_LIMIT_REACHED_CODE
                ? fillTemplate(t('newProject.limitBannerBody'), {
                    used: String(quota?.used ?? 3),
                    limit: String(quota?.limit ?? 3),
                  })
                : data.code === 'INPUT_TYPE_IMAGES_MISSING'
                  ? t('newProject.errorImagesDbMigration')
                  : (data.error ?? t('newProject.errorImagesCreate'))
            )
            return
          }
          router.push(`/projetos/${data.projectId}`)
        } catch {
          setError(t('newProject.errorImagesSend'))
        }
      })
      return
    }

    if (inputType === 'video') {
      if (!videoFile) return
      startTransition(async () => {
        try {
          const fd = new FormData()
          fd.append('name', name.trim())
          fd.append('description', description.trim())
          const upload =
            videoFile instanceof File
              ? videoFile
              : new File([videoFile], 'briefing.webm', { type: videoFile.type || 'video/webm' })
          fd.append('video', upload)
          const res = await fetch('/api/projects/from-video', { method: 'POST', body: fd })
          const data = (await res.json()) as {
            projectId?: string
            error?: string
            code?: string
            warning?: string
            videoStored?: boolean
          }
          if (!res.ok || !data.projectId) {
            setError(
              data.code === PROJECT_LIMIT_REACHED_CODE
                ? fillTemplate(t('newProject.limitBannerBody'), {
                    used: String(quota?.used ?? 3),
                    limit: String(quota?.limit ?? 3),
                  })
                : (data.error ?? t('newProject.errorVideoCreate'))
            )
            return
          }
          router.push(`/projetos/${data.projectId}`)
        } catch {
          setError(t('newProject.errorVideoSend'))
        }
      })
      return
    }

    const briefingContent = inputType === 'text'
      ? briefing
      : inputType === 'form'
        ? Object.entries(formAnswers).filter(([, v]) => v.trim()).map(([k, v]) => {
          const q = guidedQuestions.find(g => g.id === k)
          return q ? `${q.label}\n${v}` : v
        }).join('\n\n')
      : ''

    startTransition(async () => {
      const result = await createProjectAction({ name, description, inputType, briefingContent })
      if (result.error) {
        setError(
          result.code === PROJECT_LIMIT_REACHED_CODE
            ? fillTemplate(t('newProject.limitBannerBody'), {
                used: String(quota?.used ?? 3),
                limit: String(quota?.limit ?? 3),
              })
            : result.error
        )
      } else {
        router.push(`/projetos/${result.projectId}`)
      }
    })
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={t('newProject.title')}
        subtitle={t('newProject.subtitle')}
        actions={
          <Link href="/projetos">
            <Button variant="ghost">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('newProject.cancel')}
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {atProjectLimit && quota && (
          <Card padding="md" className="mb-6 border border-amber-200 bg-amber-50">
            <p className="text-sm font-semibold text-amber-900">{t('newProject.limitBannerTitle')}</p>
            <p className="text-sm text-amber-800 mt-1">
              {fillTemplate(t('newProject.limitBannerBody'), {
                used: quota.used,
                limit: quota.limit,
              })}
            </p>
            <Link
              href="/projetos"
              className="text-sm font-medium text-[#1E3A8A] hover:underline mt-3 inline-block"
            >
              {t('detail.viewAllProjects')}
            </Link>
          </Card>
        )}

        {quota && !quota.isUnlimited && !atProjectLimit && (
          <p className="text-xs text-[#9CA3AF] mb-4">
            {fillTemplate(t('newProject.limitQuotaHint'), {
              used: quota.used,
              limit: quota.limit,
            })}
          </p>
        )}

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { n: 1 as const, label: t('newProject.stepIdentify') },
            { n: 2 as const, label: t('newProject.stepBriefing') },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step === s.n
                    ? 'bg-[#1E3A8A] text-white'
                    : step > s.n
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#F1F5F9] text-[#9CA3AF]'
                }`}>
                  {step > s.n ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : s.n}
                </div>
                <span className={`text-sm font-medium ${step === s.n ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                  {s.label}
                </span>
              </div>
              {i < 1 && (
                <div className={`w-8 h-px transition-colors ${step > s.n ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleContinue} className="space-y-5">
            <Card padding="lg">
              <h2 className="text-base font-semibold text-[#111827] mb-4">{t('newProject.aboutTitle')}</h2>
              <div className="space-y-4">
                <Input
                  id="name"
                  label={t('newProject.nameLabel')}
                  placeholder={t('newProject.namePlaceholder')}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#374151]">
                    {t('newProject.descriptionLabel')} <span className="text-[#9CA3AF] font-normal">{t('common.optional')}</span>
                  </label>
                  <textarea
                    placeholder={t('newProject.descriptionPlaceholder')}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={!name.trim() || atProjectLimit}>
                {t('newProject.continue')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCreate} className="space-y-5">
            {/* Input type selection */}
            <Card padding="lg">
              <h2 className="text-base font-semibold text-[#111827] mb-1">{t('newProject.howToInsertTitle')}</h2>
              <p className="text-sm text-[#6B7280] mb-4">{t('newProject.howToInsertSubtitle')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {inputTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setInputType(type.id)
                      setAudioFile(null)
                      setVideoFile(null)
                      setDocumentFile(null)
                      setHasGuidedImages(false)
                      setGuidedImageBlocks([])
                      setHasForm(false)
                      setFormAnswers({})
                    }}
                    className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                      inputType === type.id
                        ? 'border-[#1E3A8A] bg-blue-50'
                        : 'border-[#E5E7EB] hover:border-[#93C5FD] hover:bg-[#F8FAFC] cursor-pointer'
                    }`}
                  >
                    <div className={`${inputType === type.id ? 'text-[#1E3A8A]' : 'text-[#6B7280]'}`}>
                      {type.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${inputType === type.id ? 'text-[#1E3A8A]' : 'text-[#374151]'}`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {inputType === 'text' && (
              <Card padding="lg">
                <h2 className="text-base font-semibold text-[#111827] mb-1">{t('newProject.briefingTitle')}</h2>
                <p className="text-sm text-[#6B7280] mb-4">
                  {t('newProject.briefingIntro')}
                </p>
                <textarea
                  placeholder={t('newProject.briefingPlaceholder')}
                  value={briefing}
                  onChange={e => setBriefing(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none leading-relaxed"
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-[#9CA3AF]">{t('newProject.charactersHint').replace('{{n}}', String(briefing.length))}</p>
                  {briefing.length < 50 && briefing.length > 0 && (
                    <p className="text-xs text-[#F59E0B]">{t('newProject.detailHint')}</p>
                  )}
                </div>
              </Card>
            )}

            {inputType === 'audio' && <AudioInput key="briefing-audio" onReady={setAudioFile} />}
            {inputType === 'video' && <VideoInput key="briefing-video" onReady={setVideoFile} />}
            {inputType === 'document' && <DocumentInput key="briefing-document" onReady={setDocumentFile} />}
            {inputType === 'form' && (
              <GuidedFormInput questions={guidedQuestions} onChange={setHasForm} onAnswers={setFormAnswers} />
            )}
            {inputType === 'images' && (
              <GuidedImagesInput
                key="briefing-images"
                onValid={setHasGuidedImages}
                onBlocksChange={setGuidedImageBlocks}
              />
            )}

            {error && (
              <div role="alert" className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#EF4444]">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                {t('newProject.back')}
              </Button>
              <Button
                type="submit"
                size="lg"
                loading={isPending}
                disabled={!isStep2Valid() || isPending || atProjectLimit}
              >
                {!isPending && (
                  <>
                    {t('newProject.createSubmit')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
