'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function AdminBackLink() {
  const { t } = useI18n()

  return (
    <Link href="/admin">
      <Button variant="ghost" size="sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t('admin.back')}
      </Button>
    </Link>
  )
}
