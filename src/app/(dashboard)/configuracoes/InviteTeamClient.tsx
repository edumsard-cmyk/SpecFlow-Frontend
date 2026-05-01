'use client'

import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { inviteTeamMemberAction } from '@/app/actions/team'

export default function InviteTeamClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setErr(null)
    start(async () => {
      const res = await inviteTeamMemberAction(name, email)
      if (res.error) setErr(res.error)
      else {
        setMsg('Convite enviado. A pessoa receberá um e-mail para aceitar e definir a senha.')
        setName('')
        setEmail('')
      }
    })
  }

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#374151] mb-1">Equipe</h2>
      <p className="text-sm text-[#6B7280] mb-4">
        Convide colaboradores para a mesma empresa. Eles recebem um e-mail do sistema com o link de acesso.
      </p>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <Input
          id="invite-name"
          name="name"
          label="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <Input
          id="invite-email"
          name="email"
          type="email"
          label="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Enviando…' : 'Enviar convite'}
        </Button>
        {msg && <p className="text-sm text-[#059669]">{msg}</p>}
        {err && <p className="text-sm text-[#DC2626]">{err}</p>}
      </form>
    </div>
  )
}
