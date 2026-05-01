'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { requestPasswordResetForEmail } from '@/app/actions/auth'

export default function EsqueciSenhaPage() {
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
      else setMsg('Se existir uma conta com este e-mail, enviamos um link para redefinir a senha.')
    })
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-xl font-semibold text-[#111827] mb-1">Esqueceu a senha?</h1>
      <p className="text-sm text-[#6B7280] mb-6">
        Informe seu e-mail e enviaremos um link para criar uma nova senha.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {err && <p className="text-sm text-[#DC2626]">{err}</p>}
        {msg && <p className="text-sm text-[#059669]">{msg}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Enviando…' : 'Enviar link'}
        </Button>
      </form>

      <p className="text-center text-sm text-[#6B7280] mt-6">
        <Link href="/login" className="text-[#1D4ED8] font-medium hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  )
}
