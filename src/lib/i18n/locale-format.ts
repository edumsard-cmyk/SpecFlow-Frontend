import type { Locale } from '@/lib/i18n/dictionaries'

/** Tag BCP 47 para `Intl` alinhada ao locale da UI */
export function intlLocaleTag(locale: Locale): string {
  if (locale === 'en') return 'en-US'
  if (locale === 'es') return 'es-ES'
  return 'pt-BR'
}
