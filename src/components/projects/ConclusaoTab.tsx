'use client'

import Button from '@/components/ui/Button'
import { useI18n } from '@/components/i18n/I18nProvider'
import type { ProjectConclusion } from '@/types'

interface ConclusaoTabProps {
  conclusion: ProjectConclusion | null
  loading?: boolean
  error?: string | null
  onRegenerate?: () => void
  regenerating?: boolean
}

export default function ConclusaoTab({
  conclusion,
  loading = false,
  error = null,
  onRegenerate,
  regenerating = false,
}: ConclusaoTabProps) {
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-10 h-10 border-2 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#6B7280]">{t('conclusion.generating')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
        {error}
      </div>
    )
  }

  if (!conclusion) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
        <p className="text-sm text-[#6B7280] mb-4">{t('conclusion.noData')}</p>
        {onRegenerate && (
          <Button size="sm" onClick={onRegenerate} disabled={regenerating}>
            {t('conclusion.regenerate')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center mx-auto mb-4 shadow-md">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#111827]">{t('conclusion.panelTitle')}</h3>
        <p className="text-sm text-[#6B7280] mt-1 max-w-lg mx-auto">{t('conclusion.intro')}</p>
      </div>

      {!conclusion.readyToFinish && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t('conclusion.notReadyHint')}
        </div>
      )}

      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
          {t('conclusion.narrativeLabel')}
        </h4>
        <div className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap space-y-3">
          {(conclusion.narrative || conclusion.summary).split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {conclusion.summary && conclusion.summary !== conclusion.narrative.slice(0, 280) && (
          <p className="mt-4 pt-4 border-t border-[#F1F5F9] text-sm font-medium text-[#1E3A8A]">
            {conclusion.summary}
          </p>
        )}
      </section>

      {conclusion.actionItems.length > 0 && (
        <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
            {t('conclusion.actionItemsLabel')}
          </h4>
          <ol className="space-y-2 list-decimal list-inside">
            {conclusion.actionItems.map((item, i) => (
              <li key={i} className="text-sm text-[#374151] leading-relaxed pl-1">
                {item}
              </li>
            ))}
          </ol>
        </section>
      )}

      {conclusion.highlights.length > 0 && (
        <section className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6">
          <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
            {t('conclusion.highlightsLabel')}
          </h4>
          <ul className="space-y-2">
            {conclusion.highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {onRegenerate && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={regenerating}>
            {regenerating ? t('conclusion.generating') : t('conclusion.regenerate')}
          </Button>
        </div>
      )}
    </div>
  )
}
