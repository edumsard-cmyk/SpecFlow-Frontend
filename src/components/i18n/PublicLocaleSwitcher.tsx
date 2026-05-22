'use client'

import { useI18n } from '@/components/i18n/I18nProvider'
import type { Locale } from '@/lib/i18n/dictionaries'

const LOCALES: Locale[] = ['pt', 'en', 'es']

export default function PublicLocaleSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <label className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <span className="sr-only">{t('i18n.language')}</span>
      <select
        value={locale}
        onChange={e => setLocale(e.target.value as Locale)}
        className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 text-[#374151] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
        aria-label={t('i18n.language')}
      >
        <option value="pt">{t('i18n.pt')}</option>
        <option value="en">{t('i18n.en')}</option>
        <option value="es">{t('i18n.es')}</option>
      </select>
    </label>
  )
}
