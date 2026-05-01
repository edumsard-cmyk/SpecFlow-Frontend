'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'specflow_onboarding_dismissed'

const STEPS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    title: 'Crie seu primeiro projeto',
    desc: 'Dê um nome e escolha como quer inserir a demanda.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Refine com a IA',
    desc: 'Responda as perguntas da IA para detalhar o briefing.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'Exporte a especificação',
    desc: 'Na página do projeto, baixe o pacote completo (.md ou PDF) com tudo que já foi salvo.',
  },
]

export default function OnboardingBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#111827]">Bem-vindo ao SpecFlow!</h3>
          </div>
          <p className="text-sm text-[#6B7280] mb-5">
            Em 3 passos você transforma uma demanda em especificação completa. Veja como:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 text-[#1E3A8A] shadow-sm">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{step.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/projetos/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] hover:opacity-90 rounded-lg transition-opacity shadow-sm"
          >
            Criar primeiro projeto
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
        <button
          onClick={dismiss}
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#6B7280] hover:bg-white transition-all flex-shrink-0"
          aria-label="Fechar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
