'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { createProjectAction } from '@/app/actions/projects'

const INPUT_TYPES = [
  {
    id: 'text',
    label: 'Texto livre',
    description: 'Descreva a demanda com suas próprias palavras',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
  {
    id: 'audio',
    label: 'Áudio',
    description: 'Grave ou faça upload de um áudio com a demanda',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    id: 'document',
    label: 'Documento',
    description: 'Importe um PDF, Word ou planilha com os requisitos',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'form',
    label: 'Formulário guiado',
    description: 'Responda perguntas estruturadas para detalhar a demanda',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    id: 'video',
    label: 'Vídeo',
    description: 'Grave ou envie um vídeo explicando a demanda',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
]

const GUIDED_QUESTIONS = [
  { id: 'goal', label: 'Qual é o principal objetivo do sistema?', placeholder: 'Ex: Permitir que clientes agendem consultas médicas online sem precisar ligar para a clínica.' },
  { id: 'users', label: 'Quem vai usar o sistema?', placeholder: 'Ex: Pacientes, médicos e secretárias da clínica.' },
  { id: 'features', label: 'Quais funcionalidades são essenciais?', placeholder: 'Ex: Agendamento online, lembretes por e-mail, painel do médico para gerenciar agenda...' },
  { id: 'deadline', label: 'Qual é a estimativa de prazo?', placeholder: 'Ex: 3 meses, até dezembro de 2024...' },
  { id: 'integrations', label: 'Há integrações necessárias com outros sistemas?', placeholder: 'Ex: Sistema de convênios, WhatsApp, Google Calendar... (opcional)' },
]

/* ── Áudio ───────────────────────────────────────────────────── */

function AudioInput({ onChange }: { onChange: (hasAudio: boolean) => void }) {
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
        onChange(true)
        stream.getTracks().forEach(t => t.stop())
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    } catch {
      setError('Permissão de microfone negada. Verifique as configurações do navegador.')
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
    onChange(true)
  }

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    onChange(false)
    setRecordingTime(0)
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">Briefing em áudio</h2>
      <p className="text-sm text-[#6B7280] mb-5">Grave sua voz ou envie um arquivo de áudio descrevendo a demanda.</p>

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
                <p className="text-sm font-medium text-[#EF4444]">Gravando… {fmt(recordingTime)}</p>
              ) : (
                <p className="text-sm text-[#6B7280]">Clique para iniciar a gravação</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">ou</span>
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
            Enviar arquivo de áudio
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
            <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-[#065F46] font-medium">Áudio pronto</span>
          </div>
          <audio controls src={audioUrl} className="w-full rounded-lg" />
          <button type="button" onClick={reset} className="text-xs text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
            Remover e gravar novamente
          </button>
        </div>
      )}
    </Card>
  )
}

/* ── Vídeo ───────────────────────────────────────────────────── */

function VideoInput({ onChange }: { onChange: (hasVideo: boolean) => void }) {
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
        onChange(true)
        stream.getTracks().forEach(t => t.stop())
        if (previewRef.current) previewRef.current.srcObject = null
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    } catch {
      setError('Permissão de câmera/microfone negada. Verifique as configurações do navegador.')
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
    onChange(true)
  }

  const reset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    onChange(false)
    setRecordingTime(0)
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">Briefing em vídeo</h2>
      <p className="text-sm text-[#6B7280] mb-5">Grave pela câmera ou envie um arquivo de vídeo explicando a demanda.</p>

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
                <p className="text-sm font-medium text-[#EF4444]">Gravando… {fmt(recordingTime)}</p>
              ) : (
                <p className="text-sm text-[#6B7280]">Clique para iniciar a gravação pela câmera</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">ou</span>
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
            Enviar arquivo de vídeo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
            <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-[#065F46] font-medium">Vídeo pronto</span>
          </div>
          <video controls src={videoUrl} className="w-full rounded-lg bg-black max-h-64" />
          <button type="button" onClick={reset} className="text-xs text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
            Remover e gravar novamente
          </button>
        </div>
      )}
    </Card>
  )
}

/* ── Documento ───────────────────────────────────────────────── */

function DocumentInput({ onChange }: { onChange: (hasFile: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt'

  const handleFile = (f: File) => {
    setFile(f)
    onChange(true)
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
      <h2 className="text-base font-semibold text-[#111827] mb-1">Importar documento</h2>
      <p className="text-sm text-[#6B7280] mb-5">Envie um PDF, Word ou planilha com os requisitos do projeto.</p>

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
            <p className="text-sm font-medium text-[#374151]">Arraste o arquivo aqui ou clique para selecionar</p>
            <p className="text-xs text-[#9CA3AF] mt-1">PDF, Word, Excel ou TXT — até 20 MB</p>
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
          <button
            type="button"
            onClick={() => { setFile(null); onChange(false) }}
            className="text-xs text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
          >
            Remover arquivo
          </button>
        </div>
      )}
    </Card>
  )
}

/* ── Formulário guiado ───────────────────────────────────────── */

function GuidedFormInput({ onChange, onAnswers }: { onChange: (filled: boolean) => void; onAnswers: (a: Record<string, string>) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const update = (id: string, value: string) => {
    const next = { ...answers, [id]: value }
    setAnswers(next)
    onAnswers(next)
    const required = GUIDED_QUESTIONS.slice(0, 3)
    onChange(required.every(q => (next[q.id] ?? '').trim().length >= 10))
  }

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-[#111827] mb-1">Formulário guiado</h2>
      <p className="text-sm text-[#6B7280] mb-5">Responda as perguntas abaixo para estruturar o briefing do projeto.</p>

      <div className="space-y-5">
        {GUIDED_QUESTIONS.map((q, i) => (
          <div key={q.id}>
            <label className="text-sm font-medium text-[#374151] flex items-center gap-1.5 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs flex items-center justify-center font-semibold flex-shrink-0">
                {i + 1}
              </span>
              {q.label}
              {i >= 3 && <span className="text-[10px] text-[#9CA3AF] font-normal ml-1">(opcional)</span>}
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

      <p className="text-xs text-[#9CA3AF] mt-4">
        As 3 primeiras perguntas são obrigatórias (mínimo 10 caracteres cada).
      </p>
    </Card>
  )
}

/* ── Main page ───────────────────────────────────────────────── */

export default function NovoProjeto() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [inputType, setInputType] = useState<'text' | 'audio' | 'document' | 'form' | 'video'>('text')
  const [briefing, setBriefing] = useState('')
  const [hasAudio, setHasAudio] = useState(false)
  const [hasDocument, setHasDocument] = useState(false)
  const [hasForm, setHasForm] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const isStep2Valid = () => {
    if (inputType === 'text') return briefing.trim().length >= 10
    if (inputType === 'audio') return hasAudio
    if (inputType === 'document') return hasDocument
    if (inputType === 'form') return hasForm
    if (inputType === 'video') return hasVideo
    return false
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) setStep(2)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStep2Valid()) return
    setError(null)

    const briefingContent = inputType === 'text'
      ? briefing
      : inputType === 'form'
      ? Object.entries(formAnswers).filter(([, v]) => v.trim()).map(([k, v]) => {
          const q = GUIDED_QUESTIONS.find(q => q.id === k)
          return q ? `${q.label}\n${v}` : v
        }).join('\n\n')
      : inputType === 'audio'
      ? '[Briefing enviado por áudio]'
      : inputType === 'video'
      ? '[Briefing enviado por vídeo]'
      : '[Briefing enviado por documento]'

    startTransition(async () => {
      const result = await createProjectAction({ name, description, inputType, briefingContent })
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/projetos/${result.projectId}`)
      }
    })
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Novo Projeto"
        subtitle="Crie um projeto e inicie o fluxo SpecFlow"
        actions={
          <Link href="/projetos">
            <Button variant="ghost">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Cancelar
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { n: 1, label: 'Identificação' },
            { n: 2, label: 'Briefing inicial' },
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
              <h2 className="text-base font-semibold text-[#111827] mb-4">Sobre o projeto</h2>
              <div className="space-y-4">
                <Input
                  id="name"
                  label="Nome do projeto"
                  placeholder="Ex: App de Agendamento, Portal do Cliente..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#374151]">
                    Descrição <span className="text-[#9CA3AF] font-normal">(opcional)</span>
                  </label>
                  <textarea
                    placeholder="Descreva brevemente o objetivo do projeto..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={!name.trim()}>
                Continuar
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
              <h2 className="text-base font-semibold text-[#111827] mb-1">Como você quer inserir a demanda?</h2>
              <p className="text-sm text-[#6B7280] mb-4">Escolha o formato que melhor se encaixa no seu fluxo</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INPUT_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInputType(type.id as 'text' | 'audio' | 'document' | 'form')}
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
                <h2 className="text-base font-semibold text-[#111827] mb-1">Briefing inicial</h2>
                <p className="text-sm text-[#6B7280] mb-4">
                  Conte tudo que você sabe sobre a demanda. Não precisa ser perfeito — a IA vai refinar depois.
                </p>
                <textarea
                  placeholder="Ex: Precisamos de um sistema para gerenciar agendamentos de clínicas médicas. O paciente deve conseguir marcar consultas online, receber confirmação por e-mail e lembrete 24h antes. O médico precisa visualizar a agenda do dia e bloquear horários quando necessário..."
                  value={briefing}
                  onChange={e => setBriefing(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none leading-relaxed"
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-[#9CA3AF]">{briefing.length} caracteres</p>
                  {briefing.length < 50 && briefing.length > 0 && (
                    <p className="text-xs text-[#F59E0B]">Quanto mais detalhado, melhor o resultado da IA</p>
                  )}
                </div>
              </Card>
            )}

            {inputType === 'audio' && <AudioInput onChange={setHasAudio} />}
            {inputType === 'video' && <VideoInput onChange={setHasVideo} />}
            {inputType === 'document' && <DocumentInput onChange={setHasDocument} />}
            {inputType === 'form' && <GuidedFormInput onChange={setHasForm} onAnswers={setFormAnswers} />}

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
                Voltar
              </Button>
              <Button type="submit" size="lg" loading={isPending} disabled={!isStep2Valid() || isPending}>
                {!isPending && (
                  <>
                    Criar projeto e iniciar refinamento
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
