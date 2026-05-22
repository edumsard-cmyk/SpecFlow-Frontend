import type { Locale } from '@/lib/i18n/dictionaries'

export const LOCALE_COOKIE = 'specflow_locale'
const MAX_AGE = 60 * 60 * 24 * 365

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'pt' || value === 'en' || value === 'es'
}

export function persistLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${MAX_AGE};SameSite=Lax`
}

export function readLocaleFromCookie(): Locale | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split(';')
    .map(s => s.trim())
    .find(s => s.startsWith(`${LOCALE_COOKIE}=`))
  if (!match) return null
  const value = match.split('=')[1]
  return isLocale(value) ? value : null
}
