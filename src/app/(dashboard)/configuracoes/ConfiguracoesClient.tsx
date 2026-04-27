'use client'

import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import { requestPasswordResetForCurrentUser } from '@/app/actions/auth'

export default function ConfiguracoesClient() {
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const sendReset = () => {
    setMsg(null)
    setErr(null)
    start(async () => {
      const res = await requestPasswordResetForCurrentUser()
      if (res.error) setErr(res.error)
      else setMsg('Enviamos um link para o seu e-mail. Verifique a caixa de entrada e o spam.')
    })
  }

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#374151] mb-1">Segurança</h2>
      <p className="text-sm text-[#6B7280] mb-4">
        Receba um link por e-mail para definir uma nova senha (o link abre em uma página segura).
      </p>
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={sendReset}>
        {pending ? 'Enviando…' : 'Enviar link para redefinir senha'}
      </Button>
      {msg && <p className="mt-3 text-sm text-[#059669]">{msg}</p>}
      {err && <p className="mt-3 text-sm text-[#DC2626]">{err}</p>}
    </div>
  )
}
