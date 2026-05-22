'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import CreateDemoProjectButton from '@/components/dashboard/CreateDemoProjectButton'

const STORAGE_KEY = 'specflow_onboarding_dismissed'

export default function OnboardingBanner({
  existingDemoProjectId,
}: {
  existingDemoProjectId?: string | null
}) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  const STEPS = useMemo(
    () => [
      {
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        ),
        title: t('onboarding.step1Title'),
        desc: t('onboarding.step1Desc'),
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c1.07.148 2.018.64 2.618 1.44M12 6.75V4.5" />
          </svg>
        ),
        title: t('onboarding.step2Title'),
        desc: t('onboarding.step2Desc'),
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        ),
        title: t('onboarding.step3Title'),
        desc: t('onboarding.step3Desc'),
      },
    ],
    [t]
  )

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
            <h3 className="font-semibold text-[#111827]">{t('onboarding.welcomeTitle')}</h3>
          </div>
          <p className="text-sm text-[#6B7280] mb-5">
            {t('onboarding.welcomeSubtitle')}
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
          <div className="flex flex-wrap items-center gap-3">
            <CreateDemoProjectButton
              variant="primary"
              size="md"
              existingDemoProjectId={existingDemoProjectId}
            />
            <Link
              href="/projetos/novo"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1E3A8A] bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] rounded-lg transition-colors shadow-sm"
            >
              {t('onboarding.ctaNew')}
            </Link>
            <Link
              href="/ajuda#comecar"
              className="text-sm font-medium text-[#6B7280] hover:text-[#1E3A8A] hover:underline"
            >
              {t('checklist.helpLink')}
            </Link>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#6B7280] hover:bg-white transition-all flex-shrink-0"
          aria-label={t('onboarding.dismissAria')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
