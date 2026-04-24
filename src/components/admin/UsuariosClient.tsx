'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { updateUserRoleAction } from '@/app/actions/admin'
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

export default function UsuariosClient({ users }: { users: UserWithStats[] }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
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

  return (
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
                <td className="px-6 py-4 text-right">
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
  )
}
