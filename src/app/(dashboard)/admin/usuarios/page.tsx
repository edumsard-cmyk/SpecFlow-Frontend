'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

type Role = 'admin' | 'company' | 'user'

interface User {
  id: string
  name: string
  email: string
  role: Role
  company: string
  company_id: string
  created_at: string
  projects: number
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@acme.com', role: 'company', company: 'Acme Corp', company_id: '1', created_at: '2024-01-15T00:00:00Z', projects: 5 },
  { id: '2', name: 'Carlos Mendes', email: 'carlos@acme.com', role: 'user', company: 'Acme Corp', company_id: '1', created_at: '2024-01-20T00:00:00Z', projects: 3 },
  { id: '3', name: 'Fernanda Lima', email: 'fernanda@acme.com', role: 'user', company: 'Acme Corp', company_id: '1', created_at: '2024-02-05T00:00:00Z', projects: 4 },
  { id: '4', name: 'João Batista', email: 'joao@techstart.com', role: 'company', company: 'TechStart Ltda', company_id: '2', created_at: '2024-02-01T00:00:00Z', projects: 2 },
  { id: '5', name: 'Mariana Souza', email: 'mariana@techstart.com', role: 'user', company: 'TechStart Ltda', company_id: '2', created_at: '2024-02-10T00:00:00Z', projects: 1 },
  { id: '6', name: 'Pedro Alves', email: 'pedro@inovacao.com', role: 'company', company: 'Inovação SA', company_id: '3', created_at: '2024-02-20T00:00:00Z', projects: 4 },
  { id: '7', name: 'Luciana Torres', email: 'luciana@inovacao.com', role: 'user', company: 'Inovação SA', company_id: '3', created_at: '2024-02-25T00:00:00Z', projects: 3 },
  { id: '8', name: 'Bruno Sardinha', email: 'bruno@specflow.io', role: 'admin', company: '—', company_id: '', created_at: '2024-01-01T00:00:00Z', projects: 0 },
]

const ROLE_LABELS: Record<Role, string> = { admin: 'Admin', company: 'Gestor', user: 'Usuário' }
const ROLE_COLORS: Record<Role, 'error' | 'info' | 'default'> = { admin: 'error', company: 'info', user: 'default' }

const ROLE_FILTERS: { value: Role | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'admin', label: 'Admins' },
  { value: 'company', label: 'Gestores' },
  { value: 'user', label: 'Usuários' },
]

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

export default function UsuariosPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')

  const filtered = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.company.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [search, roleFilter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: MOCK_USERS.length }
    MOCK_USERS.forEach(u => { c[u.role] = (c[u.role] || 0) + 1 })
    return c
  }, [])

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Usuários"
        subtitle={`${MOCK_USERS.length} usuários na plataforma`}
        actions={
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Admin
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center gap-4">
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

          {/* Role filter */}
          <div className="flex items-center gap-1">
            {ROLE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  roleFilter === f.value
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]'
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

        {/* Table */}
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
                        user.role === 'admin'
                          ? 'bg-gradient-to-br from-[#EF4444] to-[#7C3AED]'
                          : 'bg-gradient-to-br from-[#3B82F6] to-[#7C3AED]'
                      }`}>
                        {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="font-medium text-[#111827] text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.company_id ? (
                      <Link href={`/admin/empresas/${user.company_id}`} className="text-sm text-[#1D4ED8] hover:underline">
                        {user.company}
                      </Link>
                    ) : (
                      <span className="text-sm text-[#9CA3AF]">{user.company}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-[#374151]">{user.projects}</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <select className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1 text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] cursor-pointer">
                        <option value={user.role}>{ROLE_LABELS[user.role]}</option>
                        {(Object.keys(ROLE_LABELS) as Role[]).filter(r => r !== user.role).map(r => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-[#9CA3AF]">
              Nenhum usuário encontrado
            </div>
          )}
        </Card>

        <p className="text-xs text-[#9CA3AF] text-center">
          Exibindo {filtered.length} de {MOCK_USERS.length} usuários
        </p>
      </div>
    </div>
  )
}
