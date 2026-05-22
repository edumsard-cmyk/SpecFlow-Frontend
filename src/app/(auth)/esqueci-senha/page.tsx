'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useI18n } from '@/components/i18n/I18nProvider'
import { requestPasswordResetForEmail } from '@/app/actions/auth'

export default function EsqueciSenhaPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setErr(null)
    start(async () => {
      const res = await requestPasswordResetForEmail(email)
      if (res.error) setErr(res.error)
      else setMsg(t('auth.forgot.sent'))
    })
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-xl font-semibold text-[#111827] mb-1">{t('auth.forgot.title')}</h1>
      <p className="text-sm text-[#6B7280] mb-6">{t('auth.forgot.subtitle')}</p>

      <form onSubmit={submit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label={t('auth.forgot.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {err && <p className="text-sm text-[#DC2626]">{err}</p>}
        {msg && <p className="text-sm text-[#059669]">{msg}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? t('auth.forgot.pending') : t('auth.forgot.submit')}
        </Button>
      </form>

      <p className="text-center text-sm text-[#6B7280] mt-6">
        <Link href="/login" className="text-[#1D4ED8] font-medium hover:underline">
          {t('auth.forgot.back')}
        </Link>
      </p>
    </div>
  )
}
