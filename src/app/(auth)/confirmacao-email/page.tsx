'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Button from '@/components/ui/Button'
import AuthBrandHeader from '@/components/auth/AuthBrandHeader'
import { useI18n } from '@/components/i18n/I18nProvider'

function ConfirmacaoEmailContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (error) {
    return (
      <>
        <AuthBrandHeader />
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#111827] mb-2">{t('auth.confirm.errorTitle')}</h1>
          <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">{t('auth.confirm.errorBody')}</p>
          <Link href="/login">
            <Button className="w-full" size="lg">
              {t('auth.confirm.errorBtn')}
            </Button>
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <AuthBrandHeader />
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#111827] mb-2">{t('auth.confirm.okTitle')}</h1>
        <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">{t('auth.confirm.okBody')}</p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full" size="lg">
              {t('auth.confirm.dashboard')}
            </Button>
          </Link>
          <Link href="/login" className="text-sm text-[#1D4ED8] font-medium hover:underline">
            {t('auth.confirm.orLogin')}
          </Link>
        </div>
      </div>
    </>
  )
}

export default function ConfirmacaoEmailPage() {
  const { t } = useI18n()

  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center text-sm text-[#6B7280]">
          {t('auth.confirm.loading')}
        </div>
      }
    >
      <ConfirmacaoEmailContent />
    </Suspense>
  )
}
