'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { updateUserRoleAction, createUserAction, resetUserPasswordAction, deleteUserAction } from '@/app/actions/admin'
import { type UserWithStats } from '@/lib/data/admin'
import { type Database } from '@/lib/supabase/types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

const ROLE_LABELS: Record<UserRole, string> = { admin: 'Admin', company: 'Gestor', user: 'Usuário' }
const ROLE_COLORS: Record<UserRole, 'error' | 'info' | 'default'> = { admin: 'error', company: 'info', user: 'default' }
const ROLE_FILTERS: { value: UserRole | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'admin', label: 'Admins' },
  { value: 'company', label: 'Gestores' },
  { value: 'user', label: 'Usuários' },
]

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

interface Company { id: string; name: string }

function NovoUsuarioModal({ companies, onClose }: { companies: Company[]; onClose: () => void }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('user')
  const [companyId, setCompanyId] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    setError('')
    startTransition(async () => {
      const result = await createUserAction({
        name,
        email,
        password,
        role,
        company_id: companyId || null,
      })
      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
        onClose()
      }
    })
  }

  const isValid = name.trim() && email.trim() && password.length >= 6

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#111827]">Novo usuário</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Nome completo</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              placeholder="João Silva"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="joao@empresa.com"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Senha inicial</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Perfil</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
              >
                {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Empresa <span className="text-[#9CA3AF] font-normal">(opcional)</span></label>
              <select
                value={companyId}
                onChange={e => setCompanyId(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
              >
                <option value="">Sem empresa</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-[#EF4444] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isPending}>Cancelar</Button>
          <Button size="sm" onClick={handleSubmit} loading={isPending} disabled={!isValid}>
            {!isPending && (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Criar usuário
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function DeleteUserButton({ userId, onDeleted }: { userId: string; onDeleted: () => void }) {
  const [state, setState] = useState<'idle' | 'confirm' | 'deleting'>('idle')

  const handleClick = () => {
    if (state === 'idle') { setState('confirm'); return }
    if (state === 'confirm') {
      setState('deleting')
      deleteUserAction(userId).then(res => {
        if (res.error) setState('idle')
        else onDeleted()
      })
    }
  }

  if (state === 'confirm') return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-[#374151]">Excluir?</span>
      <button onClick={handleClick} className="text-xs text-[#EF4444] font-medium hover:underline">Sim</button>
      <button onClick={() => setState('idle')} className="text-xs text-[#9CA3AF] hover:underline">Não</button>
    </div>
  )

  return (
    <button
      onClick={handleClick}
      disabled={state === 'deleting'}
      className="text-xs text-[#9CA3AF] hover:text-[#EF4444] disabled:opacity-50 flex items-center gap-1 transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
      {state === 'deleting' ? 'Excluindo…' : 'Excluir'}
    </button>
  )
}

function ResetPasswordButton({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'confirm' | 'sending' | 'sent' | 'error'>('idle')

  const handleClick = () => {
    if (state === 'idle') { setState('confirm'); return }
    if (state === 'confirm') {
      setState('sending')
      resetUserPasswordAction(email).then(res => {
        setState(res.error ? 'error' : 'sent')
        if (!res.error) setTimeout(() => setState('idle'), 3000)
      })
    }
  }

  if (state === 'sent') return (
    <span className="text-xs text-[#10B981] flex items-center gap-1">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      E-mail enviado
    </span>
  )

  if (state === 'confirm') return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-[#374151]">Confirmar?</span>
      <button onClick={handleClick} className="text-xs text-[#EF4444] font-medium hover:underline">Sim</button>
      <button onClick={() => setState('idle')} className="text-xs text-[#9CA3AF] hover:underline">Não</button>
    </div>
  )

  return (
    <button
      onClick={handleClick}
      disabled={state === 'sending'}
      className="text-xs text-[#6B7280] hover:text-[#1D4ED8] disabled:opacity-50 flex items-center gap-1 transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      {state === 'sending' ? 'Enviando…' : 'Redefinir senha'}
    </button>
  )
}

export default function UsuariosClient({ users: initialUsers, companies }: { users: UserWithStats[]; companies: Company[] }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.company_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  }), [search, roleFilter, users])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: users.length }
    users.forEach(u => { c[u.role] = (c[u.role] || 0) + 1 })
    return c
  }, [users])

  const handleRoleChange = (userId: string, role: UserRole) => {
    startTransition(async () => { await updateUserRoleAction(userId, role) })
  }

  const handleDelete = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    router.refresh()
  }

  return (
    <>
      {showModal && <NovoUsuarioModal companies={companies} onClose={() => setShowModal(false)} />}

      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="max-w-sm flex-1">
            <Input
              placeholder="Buscar por nome, e-mail ou empresa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
            />
          </div>
          <div className="flex items-center gap-1">
            {ROLE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  roleFilter === f.value ? 'bg-[#1E3A8A] text-white' : 'text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]'
                }`}
              >
                {f.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  roleFilter === f.value ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#6B7280]'
                }`}>
                  {counts[f.value] ?? 0}
                </span>
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            Novo usuário
          </Button>
        </div>

        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Usuário</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">E-mail</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Empresa</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Perfil</th>
                <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Projetos</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Desde</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                        user.role === 'admin' ? 'bg-gradient-to-br from-[#EF4444] to-[#7C3AED]' : 'bg-gradient-to-br from-[#3B82F6] to-[#7C3AED]'
                      }`}>
                        {user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span className="font-medium text-[#111827] text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.company_id ? (
                      <Link href={`/admin/empresas/${user.company_id}`} className="text-sm text-[#1D4ED8] hover:underline">
                        {user.company_name ?? '—'}
                      </Link>
                    ) : (
                      <span className="text-sm text-[#9CA3AF]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-[#374151]">{user.projects}</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <ResetPasswordButton email={user.email} />
                      <select
                        defaultValue={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                        disabled={isPending}
                        className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1 text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] cursor-pointer disabled:opacity-50"
                      >
                        {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                      <DeleteUserButton userId={user.id} onDeleted={() => handleDelete(user.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-[#9CA3AF]">
              {search ? `Nenhum usuário encontrado para "${search}"` : 'Nenhum usuário cadastrado ainda.'}
            </div>
          )}
        </Card>

        <p className="text-xs text-[#9CA3AF] text-center">
          Exibindo {filtered.length} de {users.length} usuários
        </p>
      </div>
    </>
  )
}
