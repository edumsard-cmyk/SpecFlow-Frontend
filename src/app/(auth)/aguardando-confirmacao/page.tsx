'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import AuthBrandHeader from '@/components/auth/AuthBrandHeader'
import { useI18n } from '@/components/i18n/I18nProvider'
import { resendSignupConfirmationEmail } from '@/app/actions/auth'

function AguardandoConfirmacaoContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email') ?? ''
  const [email, setEmail] = useState(emailFromQuery)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const resend = () => {
    setMessage(null)
    setError(null)
    startTransition(async () => {
      const res = await resendSignupConfirmationEmail(email)
      if (res.error) setError(res.error)
      else setMessage(t('auth.confirm.resendSuccess'))
    })
  }

  return (
    <>
      <AuthBrandHeader />
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#111827] text-center mb-2">
          {t('auth.confirm.awaitingTitle')}
        </h1>
        <p className="text-sm text-[#6B7280] text-center leading-relaxed mb-6">
          {t('auth.confirm.awaitingBody')}
        </p>

        {message && (
          <p role="status" className="mb-4 text-sm text-center text-[#059669]">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mb-4 text-sm text-center text-[#DC2626]">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-[#374151] mb-1.5">
          {t('auth.signup.email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] mb-4 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          autoComplete="email"
        />

        <Button className="w-full mb-3" size="lg" onClick={resend} loading={pending} disabled={!email.trim()}>
          {t('auth.confirm.resend')}
        </Button>

        <p className="text-center text-sm text-[#6B7280]">
          {t('auth.signup.confirmBody')}{' '}
          <Link href="/login" className="text-[#1D4ED8] font-medium hover:underline">
            {t('auth.signup.confirmLogin')}
          </Link>
        </p>
      </div>
    </>
  )
}

export default function AguardandoConfirmacaoPage() {
  const { t } = useI18n()

  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center text-sm text-[#6B7280]">
          {t('auth.confirm.loading')}
        </div>
      }
    >
      <AguardandoConfirmacaoContent />
    </Suspense>
  )
}
