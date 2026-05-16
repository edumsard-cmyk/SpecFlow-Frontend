'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { appendRefinementMessageAction } from '@/app/actions/refinement'
import Button from '@/components/ui/Button'
import { useI18n } from '@/components/i18n/I18nProvider'

interface Message {
  role: 'ai' | 'user'
  content: string
  streaming?: boolean
}

interface RefinamentoTabProps {
  projectId: string
  initialMessages?: Message[]
}

async function refinementErrorMessage(
  res: Response,
  errMsg: (key: string) => string
): Promise<string> {
  if (res.status === 429) {
    return errMsg('refinement.error429')
  }
  if (res.status >= 500) {
    return errMsg('refinement.error500')
  }
  try {
    const j = (await res.json()) as { error?: unknown }
    if (typeof j.error === 'string' && j.error.trim()) return j.error
  } catch {
    /* corpo pode não ser JSON */
  }
  return errMsg('refinement.errorNetwork')
}

export default function RefinamentoTab({
  projectId,
  initialMessages = [],
}: RefinamentoTabProps) {
  const { t } = useI18n()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(initialMessages.length > 0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
      setHasStarted(true)
    }
  }, [initialMessages])

  const sendToAI = useCallback(async (userMessages: Message[]) => {
    setIsLoading(true)

    // Adiciona placeholder da resposta da IA
    setMessages(prev => [...prev, { role: 'ai', content: '', streaming: true }])

    try {
      const apiMessages = userMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }))

      const res = await fetch('/api/refinement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ messages: apiMessages, projectId }),
      })

      if (!res.ok) throw new Error(await refinementErrorMessage(res, k => t(k)))

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data) as { text: string }
            accumulated += parsed.text
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'ai', content: accumulated, streaming: true }
              return updated
            })
          } catch {
            // ignora chunks malformados
          }
        }
      }

      // Finaliza streaming
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'ai', content: accumulated, streaming: false }
        return updated
      })

      if (accumulated.trim()) {
        void appendRefinementMessageAction(projectId, 'ai', accumulated)
      }
    } catch (err) {
      const fallback = t('refinement.errorProcess')
      const text = err instanceof Error && err.message ? err.message : fallback
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'ai',
          content: text,
          streaming: false,
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }, [projectId, t])

  const handleStart = useCallback(() => {
    setHasStarted(true)
    sendToAI([])
  }, [sendToAI])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    textareaRef.current?.focus()

    void appendRefinementMessageAction(projectId, 'user', text).then(res => {
      if (res.error) console.warn(res.error)
      sendToAI(newMessages)
    })
  }, [input, isLoading, messages, sendToAI, projectId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center mb-5 shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#111827] mb-2">{t('refinement.titleStart')}</h3>
        <p className="text-sm text-[#6B7280] max-w-md mb-6 leading-relaxed">
          {t('refinement.intro')}
        </p>
        <Button onClick={handleStart}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          {t('refinement.startButton')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Messages */}
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto pb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#1E3A8A] text-white rounded-br-sm'
                : 'bg-white border border-[#E5E7EB] text-[#374151] rounded-bl-sm shadow-sm'
            }`}>
              {msg.content}
              {msg.streaming && msg.content === '' && (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
              {msg.streaming && msg.content !== '' && (
                <span className="inline-block w-0.5 h-3.5 bg-[#94A3B8] ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`flex items-end gap-2 bg-white border rounded-xl p-3 transition-colors ${
        isLoading ? 'border-[#E5E7EB] opacity-75' : 'border-[#E5E7EB] focus-within:border-[#3B82F6]'
      }`}>
        <textarea
          ref={textareaRef}
          placeholder={isLoading ? t('refinement.placeholderWait') : t('refinement.placeholderWrite')}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={2}
          className="flex-1 text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none leading-relaxed disabled:cursor-not-allowed bg-transparent"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </Button>
      </div>

      <p className="text-xs text-center text-[#9CA3AF]">
        {t('refinement.keyboardHint')}
      </p>
    </div>
  )
}
