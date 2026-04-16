'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

const MOCK_COMPANY = {
  id: '1',
  name: 'Acme Corp',
  slug: 'acme-corp',
  created_at: '2024-01-15T00:00:00Z',
  status: 'active' as const,
}

const MOCK_USERS = [
  { id: '1', name: 'Ana Silva', email: 'ana@acme.com', role: 'company' as const, created_at: '2024-01-15T00:00:00Z', projects: 5 },
  { id: '2', name: 'Carlos Mendes', email: 'carlos@acme.com', role: 'user' as const, created_at: '2024-01-20T00:00:00Z', projects: 3 },
  { id: '3', name: 'Fernanda Lima', email: 'fernanda@acme.com', role: 'user' as const, created_at: '2024-02-05T00:00:00Z', projects: 4 },
  { id: '4', name: 'Rodrigo Costa', email: 'rodrigo@acme.com', role: 'user' as const, created_at: '2024-02-18T00:00:00Z', projects: 2 },
]

const ROLE_LABELS = { admin: 'Admin', company: 'Gestor', user: 'Usuário' }
const ROLE_COLORS = { admin: 'error', company: 'info', user: 'default' } as const

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

export default function EmpresaDetailPage() {
  useParams()
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(MOCK_COMPANY.name)
  const [tempName, setTempName] = useState(MOCK_COMPANY.name)

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault()
    setName(tempName)
    setEditingName(false)
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={name}
        subtitle={`/${MOCK_COMPANY.slug} · Criada em ${formatDate(MOCK_COMPANY.created_at)}`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/empresas">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Empresas
              </Button>
            </Link>
            <Badge variant={MOCK_COMPANY.status === 'active' ? 'success' : 'default'}>
              {MOCK_COMPANY.status === 'active' ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Company info */}
        <div className="grid grid-cols-3 gap-4">
          <Card padding="md" className="col-span-2">
            <h3 className="text-sm font-semibold text-[#374151] mb-4">Dados da empresa</h3>
            {editingName ? (
              <form onSubmit={handleSaveName} className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    id="edit-name"
                    label="Nome da empresa"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2 pb-0.5">
                  <Button type="submit" size="sm">Salvar</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingName(false); setTempName(name) }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Nome</p>
                    <p className="text-sm font-medium text-[#111827]">{name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Slug</p>
                    <code className="text-xs text-[#6B7280] bg-[#F1F5F9] px-2 py-0.5 rounded">{MOCK_COMPANY.slug}</code>
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
                <span className="text-sm font-semibold text-[#111827]">{MOCK_USERS.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Projetos</span>
                <span className="text-sm font-semibold text-[#111827]">12</span>
              </div>
              <div className="pt-2 border-t border-[#F1F5F9]">
                <Button variant="danger" size="sm" className="w-full">
                  Desativar empresa
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Users */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#111827]">Usuários da empresa</h3>
            <Button size="sm" variant="outline">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Convidar usuário
            </Button>
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
                {MOCK_USERS.map(user => (
                  <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
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
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">Alterar perfil</Button>
                        <Button variant="ghost" size="sm" className="text-[#EF4444] hover:text-[#EF4444] hover:bg-red-50">
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
