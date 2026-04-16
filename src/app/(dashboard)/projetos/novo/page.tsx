'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

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
    badge: 'Em breve',
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
    badge: 'Em breve',
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
    badge: 'Em breve',
  },
]

export default function NovoProjeto() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [inputType, setInputType] = useState('text')
  const [briefing, setBriefing] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) setStep(2)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push('/projetos/1')
    }, 1500)
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
              <div className="grid grid-cols-2 gap-3">
                {INPUT_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    disabled={!!type.badge}
                    onClick={() => !type.badge && setInputType(type.id)}
                    className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                      inputType === type.id && !type.badge
                        ? 'border-[#1E3A8A] bg-blue-50'
                        : type.badge
                        ? 'border-[#E5E7EB] bg-[#FAFAFA] opacity-60 cursor-not-allowed'
                        : 'border-[#E5E7EB] hover:border-[#93C5FD] hover:bg-[#F8FAFC] cursor-pointer'
                    }`}
                  >
                    {type.badge && (
                      <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#9CA3AF] font-medium">
                        {type.badge}
                      </span>
                    )}
                    <div className={`${inputType === type.id && !type.badge ? 'text-[#1E3A8A]' : 'text-[#6B7280]'}`}>
                      {type.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${inputType === type.id && !type.badge ? 'text-[#1E3A8A]' : 'text-[#374151]'}`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Briefing input */}
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
                  <p className="text-xs text-[#9CA3AF]">
                    {briefing.length} caracteres
                  </p>
                  {briefing.length < 50 && briefing.length > 0 && (
                    <p className="text-xs text-[#F59E0B]">Quanto mais detalhado, melhor o resultado da IA</p>
                  )}
                </div>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Voltar
              </Button>
              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={inputType === 'text' && briefing.trim().length < 10}
              >
                {!loading && (
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
