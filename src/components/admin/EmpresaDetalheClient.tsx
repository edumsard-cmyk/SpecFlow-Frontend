'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { updateCompanyNameAction, updateUserRoleAction, removeUserFromCompanyAction } from '@/app/actions/admin'
import { type UserWithStats } from '@/lib/data/admin'
import { type Database } from '@/lib/supabase/types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

const ROLE_LABELS: Record<UserRole, string> = { admin: 'Admin', company: 'Gestor', user: 'Usuário' }
const ROLE_COLORS: Record<UserRole, 'error' | 'info' | 'default'> = { admin: 'error', company: 'info', user: 'default' }

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

interface Props {
  company: { id: string; name: string; slug: string; created_at: string }
  users: UserWithStats[]
  projectCount: number
}

export default function EmpresaDetalheClient({ company, users, projectCount }: Props) {
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(company.name)
  const [tempName, setTempName] = useState(company.name)
  const [nameError, setNameError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault()
    setNameError(null)
    startTransition(async () => {
      const result = await updateCompanyNameAction(company.id, tempName)
      if (result.error) {
        setNameError(result.error)
      } else {
        setName(tempName)
        setEditingName(false)
      }
    })
  }

  const handleRoleChange = (userId: string, role: UserRole) => {
    startTransition(async () => {
      await updateUserRoleAction(userId, role)
    })
  }

  const handleRemove = (userId: string) => {
    setRemovingId(userId)
    startTransition(async () => {
      await removeUserFromCompanyAction(userId, company.id)
      setRemovingId(null)
    })
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="md:col-span-2">
          <h3 className="text-sm font-semibold text-[#374151] mb-4">Dados da empresa</h3>
          {editingName ? (
            <form onSubmit={handleSaveName} className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  id="edit-name"
                  label="Nome da empresa"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  error={nameError ?? undefined}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pb-0.5">
                <Button type="submit" size="sm" loading={isPending} disabled={!tempName.trim() || isPending}>
                  {!isPending && 'Salvar'}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingName(false); setTempName(name); setNameError(null) }}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#9CA3AF]">Nome</p>
                  <p className="text-sm font-medium text-[#111827]">{name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Slug</p>
                  <code className="text-xs text-[#6B7280] bg-[#F1F5F9] px-2 py-0.5 rounded">{company.slug}</code>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Criada em</p>
                  <p className="text-sm text-[#374151]">{formatDate(company.created_at)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditingName(true)}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Editar
              </Button>
            </div>
          )}
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-semibold text-[#374151] mb-4">Resumo</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Usuários</span>
              <span className="text-sm font-semibold text-[#111827]">{users.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Projetos</span>
              <span className="text-sm font-semibold text-[#111827]">{projectCount}</span>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#111827]">Usuários da empresa</h3>
        </div>

        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Usuário</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">E-mail</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Perfil</th>
                <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Projetos</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Desde</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span className="font-medium text-[#111827] text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-[#374151]">{user.projects}</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
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
                      <button
                        onClick={() => handleRemove(user.id)}
                        disabled={isPending && removingId === user.id}
                        className="text-xs text-[#EF4444] hover:underline disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="py-12 text-center text-sm text-[#9CA3AF]">
              Nenhum usuário nesta empresa.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
