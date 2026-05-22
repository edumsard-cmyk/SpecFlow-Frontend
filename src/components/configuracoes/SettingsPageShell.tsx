'use client'

import Header from '@/components/layout/Header'
import { useI18n } from '@/components/i18n/I18nProvider'
import SettingsPageClient from '@/components/configuracoes/SettingsPageClient'
import type { SettingsPageData } from '@/lib/data/settings-page'

export default function SettingsPageShell({ data }: { data: SettingsPageData }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col flex-1">
      <Header title={t('settings.title')} subtitle={t('settings.subtitle')} />
      <SettingsPageClient data={data} />
    </div>
  )
}
