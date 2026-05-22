'use client'

import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import { useI18n } from '@/components/i18n/I18nProvider'
import { fill } from '@/lib/i18n/fill'

type Props = {
  titleKey: string
  subtitleKey?: string
  subtitleVars?: Record<string, string | number>
  actions?: ReactNode
}

export default function LocalizedHeader({
  titleKey,
  subtitleKey,
  subtitleVars,
  actions,
}: Props) {
  const { t } = useI18n()
  const subtitle = subtitleKey
    ? fill(t(subtitleKey), subtitleVars ?? {})
    : undefined

  return <Header title={t(titleKey)} subtitle={subtitle} actions={actions} />
}
