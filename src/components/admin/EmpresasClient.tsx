'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { createCompanyAction } from '@/app/actions/admin'
import { useI18n } from '@/components/i18n/I18nProvider'
import { fill } from '@/lib/i18n/fill'
import { intlLocaleTag } from '@/lib/i18n/locale-format'
import { type CompanyWithStats } from '@/lib/data/admin'

export default function EmpresasClient({ companies }: { companies: CompanyWithStats[] }) {
  const { t, locale } = useI18n()
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(intlLocaleTag(locale), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    startTransition(async () => {
      const result = await createCompanyAction(newName)
      if (result.error) {
        setFormError(result.error)
      } else {
        setShowForm(false)
        setNewName('')
      }
    })
  }

  return (
    <div className="flex-1 p-6 space-y-5">
      {showForm && (
        <Card padding="md" className="border-[#1E3A8A]/20 bg-blue-50/30">
          <h3 className="text-sm font-semibold text-[#111827] mb-3">{t('admin.companies.new')}</h3>
          <form onSubmit={handleCreate} className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                id="company-name"
                label="Nome da empresa"
                placeholder="Ex: Acme Corp"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                error={formError ?? undefined}
                required
                autoFocus
              />
            </div>
            <div className="flex gap-2 pb-0.5">
              <Button type="submit" loading={isPending} disabled={!newName.trim() || isPending}>
                {!isPending && 'Criar'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setNewName(''); setFormError(null) }}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="max-w-sm w-full">
          <Input
            placeholder={t('admin.companies.searchPh')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
          />
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t('admin.companies.new')}
          </Button>
        )}
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Empresa</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Slug</th>
                <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">{t('admin.company.users')}</th>
                <th className="text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">{t('admin.company.projects')}</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-6 py-3">Criada em</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map(company => (
                <tr key={company.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {company.name.charAt(0).toUpperCase()}
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
              {search ? fill(t('admin.companies.emptySearch'), { q: search }) : t('admin.companies.empty')}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
