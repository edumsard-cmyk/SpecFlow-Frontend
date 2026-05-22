'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultLocale, dictionaries, type Locale } from '@/lib/i18n/dictionaries'
import {
  isLocale,
  persistLocaleCookie,
  readLocaleFromCookie,
} from '@/lib/i18n/locale-cookie'

const STORAGE_KEY = 'specflow_locale'

function htmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : locale === 'es' ? 'es' : 'pt-BR'
}

function resolveString(locale: Locale, key: string): string | undefined {
  return (
    dictionaries[locale][key] ??
    dictionaries.pt[key] ??
    dictionaries.en[key]
  )
}

type Ctx = {
  locale: Locale
  t: (key: string) => string
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY)
    const fromCookie = readLocaleFromCookie()
    const initial = isLocale(fromStorage)
      ? fromStorage
      : fromCookie ?? defaultLocale
    setLocaleState(initial)
    document.documentElement.lang = htmlLang(initial)
    localStorage.setItem(STORAGE_KEY, initial)
    persistLocaleCookie(initial)
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    persistLocaleCookie(l)
    document.documentElement.lang = htmlLang(l)
  }, [])

  const t = useCallback(
    (key: string) => resolveString(locale, key) ?? key,
    [locale]
  )

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    return {
      locale: defaultLocale,
      t: (key: string) => resolveString(defaultLocale, key) ?? key,
      setLocale: () => {},
    }
  }
  return ctx
}
