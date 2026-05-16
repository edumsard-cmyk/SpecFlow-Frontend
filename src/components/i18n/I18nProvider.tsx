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

const STORAGE_KEY = 'specflow_locale'

type Ctx = {
  locale: Locale
  t: (key: string) => string
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored === 'en' || stored === 'pt' || stored === 'es') {
      setLocaleState(stored)
      document.documentElement.lang =
        stored === 'en' ? 'en' : stored === 'es' ? 'es' : 'pt-BR'
    }
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    document.documentElement.lang =
      l === 'en' ? 'en' : l === 'es' ? 'es' : 'pt-BR'
  }, [])

  const t = useCallback(
    (key: string) => dictionaries[locale][key] ?? dictionaries.pt[key] ?? key,
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
      t: (key: string) => dictionaries.pt[key] ?? key,
      setLocale: () => {},
    }
  }
  return ctx
}
