'use client'

import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'
import { signup, resendSignupConfirmationEmail } from '@/app/actions/auth'
import AuthBrandHeader from '@/components/auth/AuthBrandHeader'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function CadastroPage() {
  const { t } = useI18n()
  const [error, setError] = useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [resendPending, startResend] = useTransition()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setNeedsEmailConfirmation(false)
    setResendMsg(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signup(formData)
      if (result && 'error' in result) {
        setError(result.error)
        return
      }
      if (result && 'needsEmailConfirmation' in result) {
        setNeedsEmailConfirmation(true)
        setPendingEmail(result.email)
      }
    })
  }

  return (
    <div>
      <AuthBrandHeader />

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-xl font-semibold text-[#111827] mb-1">{t('auth.signup.title')}</h2>
        <p className="text-sm text-[#6B7280] mb-6">{t('auth.signup.subtitle')}</p>

        {error && (
          <div role="alert" aria-live="polite" className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <svg className="w-4 h-4 text-[#EF4444] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-[#EF4444]">{error}</p>
          </div>
        )}

        {needsEmailConfirmation && (
          <div role="status" aria-live="polite" className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
            <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-emerald-900">
              <p className="font-medium">{t('auth.signup.confirmTitle')}</p>
              <p className="mt-1 text-emerald-800">{t('auth.signup.confirmBody')}</p>
              {resendMsg && <p className="mt-2 text-emerald-800">{resendMsg}</p>}
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={resendPending || !pendingEmail}
                  onClick={() => {
                    setResendMsg(null)
                    startResend(async () => {
                      const res = await resendSignupConfirmationEmail(pendingEmail)
                      setResendMsg(res.error ? res.error : t('auth.confirm.resendSuccess'))
                    })
                  }}
                  className="text-sm font-medium text-[#1E3A8A] hover:underline disabled:opacity-50"
                >
                  {t('auth.confirm.resend')}
                </button>
                <Link href="/login" className="text-sm font-medium text-emerald-900 underline underline-offset-2">
                  {t('auth.signup.confirmLogin')}
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 ${needsEmailConfirmation ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input id="name" name="name" label={t('auth.signup.name')} placeholder={t('auth.signup.namePh')} required autoComplete="given-name" />
            <Input id="company" name="company" label={t('auth.signup.company')} placeholder={t('auth.signup.companyPh')} required />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            label={t('auth.signup.email')}
            placeholder={t('auth.signup.emailPh')}
            required
            autoComplete="email"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label={t('auth.signup.password')}
            placeholder={t('auth.signup.passwordPh')}
            required
            minLength={8}
            autoComplete="new-password"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-[#9CA3AF] hover:text-[#374151] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            }
          />

          <p className="text-xs text-[#9CA3AF]">
            {t('auth.signup.termsPrefix')}{' '}
            <Link href="/termos" className="text-[#1D4ED8] hover:underline">
              {t('auth.signup.terms')}
            </Link>
            {' '}{t('auth.signup.and')}{' '}
            <Link href="/privacidade" className="text-[#1D4ED8] hover:underline">
              {t('auth.signup.privacy')}
            </Link>
            .
          </p>

          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            {!isPending && t('auth.signup.submit')}
          </Button>
        </form>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          {t('auth.signup.hasAccount')}{' '}
          <Link href="/login" className="text-[#1D4ED8] font-medium hover:underline">
            {t('auth.signup.login')}
          </Link>
        </p>

        <p className="text-center text-xs text-[#94A3B8] mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link href="/ajuda" className="hover:text-[#64748B] transition-colors">
            {t('auth.signup.footerHelp')}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/termos" className="hover:text-[#64748B] transition-colors">
            {t('auth.signup.footerTerms')}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacidade" className="hover:text-[#64748B] transition-colors">
            {t('auth.signup.footerPrivacy')}
          </Link>
        </p>
      </div>
    </div>
  )
}
