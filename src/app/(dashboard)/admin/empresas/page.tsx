'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Company {
  id: string
  name: string
  slug: string
  created_at: string
  users: number
  projects: number
  status: 'active' | 'inactive'
}

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Acme Corp', slug: 'acme-corp', created_at: '2024-01-15T00:00:00Z', users: 8, projects: 12, status: 'active' },
  { id: '2', name: 'TechStart Ltda', slug: 'techstart', created_at: '2024-02-01T00:00:00Z', users: 3, projects: 5, status: 'active' },
  { id: '3', name: 'Inovação SA', slug: 'inovacao-sa', created_at: '2024-02-20T00:00:00Z', users: 6, projects: 9, status: 'active' },
  { id: '4', name: 'Digital Hub', slug: 'digital-hub', created_at: '2024-03-05T00:00:00Z', users: 4, projects: 7, status: 'active' },
  { id: '5', name: 'Bytes & Co', slug: 'bytes-co', created_at: '2024-03-10T00:00:00Z', users: 2, projects: 3, status: 'active' },
  { id: '6', name: 'Nexus Sistemas', slug: 'nexus-sistemas', created_at: '2024-01-28T00:00:00Z', users: 5, projects: 6, status: 'active' },
  { id: '7', name: 'Velox Tech', slug: 'velox-tech', created_at: '2024-02-14T00:00:00Z', users: 4, projects: 4, status: 'inactive' },
  { id: '8', name: 'Sigma Digital', slug: 'sigma-digital', created_at: '2024-03-01T00:00:00Z', users: 2, projects: 1, status: 'inactive' },
]

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

export default function EmpresasPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const filtered = MOCK_COMPANIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setTimeout(() => {
      setCreating(false)
      setShowForm(false)
      setNewName('')
    }, 1000)
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Empresas"
        subtitle={`${MOCK_COMPANIES.length} empresas cadastradas`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Admin
              </Button>
            </Link>
            <Button onClick={() => setShowForm(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nova empresa
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-5">
        {/* New company form */}
        {showForm && (
          <Card padding="md" className="border-[#1E3A8A]/20 bg-blue-50/30">
            <h3 className="text-sm font-semibold text-[#111827] mb-3">Nova empresa</h3>
            <form onSubmit={handleCreate} className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  id="company-name"
                  label="Nome da empresa"
                  placeholder="Ex: Acme Corp"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 pb-0.5">
                <Button type="submit" loading={creating} disabled={!newName.trim()}>
                  {!creating && 'Criar'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search */}
        <div className="max-w-sm">
          <Input
            placeholder="Buscar empresa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
          />
        </div>

        {/* Table */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Empresa</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Slug</th>
                  <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Usuários</th>
                  <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Projetos</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Criada em</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map(company => (
                  <tr key={company.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {company.name.charAt(0)}
                        </div>
                        <span className="font-medium text-[#111827] text-sm">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-[#6B7280] bg-[#F1F5F9] px-2 py-0.5 rounded">{company.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-[#374151]">{company.users}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-[#374151]">{company.projects}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">{formatDate(company.created_at)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={company.status === 'active' ? 'success' : 'default'}>
                        {company.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/empresas/${company.id}`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-[#9CA3AF]">
                Nenhuma empresa encontrada para "{search}"
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
