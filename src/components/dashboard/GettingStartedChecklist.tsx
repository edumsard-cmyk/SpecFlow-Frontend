'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import type { OnboardingProgress } from '@/lib/data/onboarding'
import CreateDemoProjectButton from '@/components/dashboard/CreateDemoProjectButton'

const STORAGE_KEY = 'specflow_checklist_dismissed'

type Step = {
  id: string
  done: boolean
  href?: string
  action?: 'demo'
}

export default function GettingStartedChecklist({
  progress,
}: {
  progress: OnboardingProgress
}) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  const steps: Step[] = useMemo(
    () => [
      {
        id: 'project',
        done: progress.hasProject,
        action: progress.hasProject ? undefined : 'demo',
      },
      {
        id: 'stories',
        done: progress.hasStories,
        href: progress.projectIdForLinks
          ? `/projetos/${progress.projectIdForLinks}`
          : '/projetos/novo',
      },
      {
        id: 'refinement',
        done: progress.hasRefinement,
        href: progress.projectIdForLinks
          ? `/projetos/${progress.projectIdForLinks}`
          : undefined,
      },
      {
        id: 'finish',
        done: progress.hasDoneOrConclusion,
        href: progress.projectIdForLinks
          ? `/projetos/${progress.projectIdForLinks}`
          : '/projetos',
      },
    ],
    [progress]
  )

  const allDone = steps.every(s => s.done)
  const completedCount = steps.filter(s => s.done).length

  useEffect(() => {
    if (!allDone) {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (!dismissed) setVisible(true)
    }
  }, [allDone])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible || allDone) return null

  return (
    <div className="rounded-2xl border border-[#E0E7FF] bg-white shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-start justify-between gap-3 bg-gradient-to-r from-[#EEF2FF]/80 to-white">
        <div>
          <h3 className="font-semibold text-[#111827]">{t('checklist.title')}</h3>
          <p className="text-sm text-[#6B7280] mt-0.5">{t('checklist.subtitle')}</p>
          <p className="text-xs text-[#6366F1] font-medium mt-2">
            {t('checklist.progress').replace('{{n}}', String(completedCount)).replace('{{total}}', '4')}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-[#F1F5F9] transition-colors"
          aria-label={t('checklist.dismiss')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <ul className="divide-y divide-[#F1F5F9]">
        {steps.map((step, i) => (
          <li key={step.id} className="px-5 py-3.5 flex items-start gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                step.done
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#F1F5F9] text-[#9CA3AF] border border-[#E5E7EB]'
              }`}
            >
              {step.done ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${step.done ? 'text-[#6B7280] line-through' : 'text-[#111827]'}`}>
                {t(`checklist.step.${step.id}.title`)}
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                {t(`checklist.step.${step.id}.desc`)}
              </p>
              {!step.done && step.action === 'demo' && (
                <div className="mt-2">
                  <CreateDemoProjectButton
                    variant="primary"
                    size="sm"
                    existingDemoProjectId={progress.existingDemoProjectId}
                  />
                </div>
              )}
              {!step.done && step.href && !step.action && (
                <Link
                  href={step.href}
                  className="inline-block mt-2 text-xs font-semibold text-[#1D4ED8] hover:underline"
                >
                  {t('checklist.go')}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 bg-[#F8FAFC] flex flex-wrap items-center gap-3">
        <Link href="/ajuda#comecar" className="text-xs font-medium text-[#1E3A8A] hover:underline">
          {t('checklist.helpLink')}
        </Link>
        <Link href="/projetos/novo" className="text-xs font-medium text-[#6B7280] hover:text-[#111827]">
          {t('checklist.newProject')}
        </Link>
      </div>
    </div>
  )
}
