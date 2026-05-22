'use client'

import Link from 'next/link'
import PublicPageHeader from '@/components/i18n/PublicPageHeader'
import { useI18n } from '@/components/i18n/I18nProvider'
import { intlLocaleTag } from '@/lib/i18n/locale-format'

type Variant = 'terms' | 'privacy'

export default function LegalPageClient({ variant }: { variant: Variant }) {
  const { t, locale } = useI18n()
  const prefix = variant === 'terms' ? 'legal.terms' : 'legal.privacy'
  const updated = new Intl.DateTimeFormat(intlLocaleTag(locale), {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const sections =
    variant === 'terms'
      ? ([1, 2, 3, 4] as const)
      : ([1, 2, 3, 4, 5] as const)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <PublicPageHeader />
      <main className="max-w-3xl mx-auto px-4 py-10 prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold text-[#111827] mb-6">{t(`${prefix}.title`)}</h1>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{t(`${prefix}.intro`)}</p>
        <section className="space-y-4 text-sm text-[#374151] leading-relaxed">
          {sections.map(n => (
            <div key={n}>
              <h2 className="text-base font-semibold text-[#111827]">{t(`${prefix}.s${n}.title`)}</h2>
              <p className="mt-2">{t(`${prefix}.s${n}.body`)}</p>
            </div>
          ))}
        </section>
        <p className="mt-10 text-xs text-[#9CA3AF]">
          {t('legal.updated')} {updated}
        </p>
        <p className="mt-6 text-sm">
          <Link href="/login" className="text-[#1E3A8A] hover:underline">
            {t('layout.publicLogin')}
          </Link>
        </p>
      </main>
    </div>
  )
}
