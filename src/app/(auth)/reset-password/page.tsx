'use client'

import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AuthBrandHeader from '@/components/auth/AuthBrandHeader'
import { useI18n } from '@/components/i18n/I18nProvider'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const { t } = useI18n()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (password.length < 8) {
      setError(t('auth.reset.errMin'))
      return
    }
    if (password !== confirm) {
      setError(t('auth.reset.errMatch'))
      return
    }

    setPending(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    setPending(false)

    if (err) setError(err.message)
    else setMessage(t('auth.reset.success'))
  }

  return (
    <>
      <AuthBrandHeader />
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-xl font-bold text-[#111827] mb-1">{t('auth.reset.title')}</h1>
        <p className="text-sm text-[#6B7280] mb-6">{t('auth.reset.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="password"
            name="password"
            type="password"
            label={t('auth.reset.password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
          />
          <Input
            id="confirm"
            name="confirm"
            type="password"
            label={t('auth.reset.confirm')}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
          />

          {error && <p className="text-sm text-[#DC2626]">{error}</p>}
          {message && <p className="text-sm text-[#059669]">{message}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? t('auth.reset.pending') : t('auth.reset.submit')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          <Link href="/login" className="text-[#1E3A8A] font-medium hover:underline">
            {t('auth.reset.toLogin')}
          </Link>
        </p>
      </div>
    </>
  )
}
