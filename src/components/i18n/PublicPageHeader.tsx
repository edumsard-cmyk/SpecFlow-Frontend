'use client'

import Link from 'next/link'
import PublicLocaleSwitcher from '@/components/i18n/PublicLocaleSwitcher'
import { useI18n } from '@/components/i18n/I18nProvider'

type Props = {
  current?: 'help' | 'login' | 'signup' | 'none'
}

export default function PublicPageHeader({ current = 'none' }: Props) {
  const { t } = useI18n()
  const linkClass = (active: boolean) =>
    active
      ? 'text-[#1E3A8A] font-medium'
      : 'text-[#64748B] hover:text-[#1E3A8A]'

  return (
    <header className="border-b border-[#E5E7EB] bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm font-semibold text-[#1E3A8A] hover:underline">
          {t('layout.publicBrand')}
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <PublicLocaleSwitcher />
          <Link href="/ajuda" className={linkClass(current === 'help')} aria-current={current === 'help' ? 'page' : undefined}>
            {t('layout.publicHelp')}
          </Link>
          <Link href="/login" className={linkClass(current === 'login')}>
            {t('layout.publicLogin')}
          </Link>
          <Link href="/cadastro" className={linkClass(current === 'signup')}>
            {t('layout.publicSignup')}
          </Link>
        </div>
      </div>
    </header>
  )
}
