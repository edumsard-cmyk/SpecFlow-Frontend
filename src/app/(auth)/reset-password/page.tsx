'use client'

import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import AuthBrandHeader from '@/components/auth/AuthBrandHeader'

export default function ResetPasswordPage() {
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
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setPending(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    setPending(false)

    if (err) setError(err.message)
    else setMessage('Senha atualizada com sucesso.')
  }

  return (
    <>
      <AuthBrandHeader />
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="text-xl font-bold text-[#111827] mb-1">Nova senha</h1>
      <p className="text-sm text-[#6B7280] mb-6">
        Defina uma nova senha. Use o link enviado por e-mail para abrir esta página.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="password"
          name="password"
          type="password"
          label="Nova senha"
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
          label="Confirmar senha"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
        />

        {error && <p className="text-sm text-[#DC2626]">{error}</p>}
        {message && <p className="text-sm text-[#059669]">{message}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar nova senha'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B7280]">
        <Link href="/login" className="text-[#1E3A8A] font-medium hover:underline">
          Ir para o login
        </Link>
      </p>
    </div>
    </>
  )
}
