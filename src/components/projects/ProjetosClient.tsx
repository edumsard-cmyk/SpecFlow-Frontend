'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import CreateDemoProjectButton from '@/components/dashboard/CreateDemoProjectButton'
import Input from '@/components/ui/Input'
import ProjectCard from '@/components/projects/ProjectCard'
import { useI18n } from '@/components/i18n/I18nProvider'
import { type ProjectStatus } from '@/types'
import { type Database } from '@/lib/supabase/types'
import { type ProjectQuota } from '@/lib/projects/quota-constants'

type ProjectRow = Database['public']['Tables']['projects']['Row']

type ViewMode = 'grid' | 'list'
type SortOption = 'recent' | 'name' | 'progress'

function fillTemplate(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, String(value)),
    template
  )
}

export default function ProjetosClient({
  projects,
  projectQuota,
  existingDemoProjectId,
}: {
  projects: ProjectRow[]
  projectQuota: ProjectQuota | null
  existingDemoProjectId?: string | null
}) {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [view, setView] = useState<ViewMode>('grid')
  const [sort, setSort] = useState<SortOption>('recent')

  const STATUS_FILTERS = useMemo(
    (): { value: ProjectStatus | 'all'; label: string }[] => [
      { value: 'all', label: t('projects.filterAll') },
      { value: 'briefing', label: t('status.briefing') },
      { value: 'specification', label: t('status.specification') },
      { value: 'documentation', label: t('status.documentation') },
      { value: 'manual', label: t('status.manual') },
      { value: 'refinement', label: t('status.refinement') },
      { value: 'done', label: t('projects.filterDone') },
    ],
    [t]
  )

  const filtered = useMemo(() => {
    let result = [...projects]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }

    if (sort === 'recent') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'progress') {
      result.sort((a, b) => b.progress - a.progress)
    }

    return result
  }, [projects, search, statusFilter, sort])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length }
    projects.forEach(p => { c[p.status] = (c[p.status] || 0) + 1 })
    return c
  }, [projects])

  const atProjectLimit =
    projectQuota != null && !projectQuota.isUnlimited && !projectQuota.canCreate

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={t('projects.title')}
        subtitle={
          projects.length === 1
            ? t('projects.subtitleOne')
            : t('projects.subtitleMany').replace('{{n}}', String(projects.length))
        }
        actions={
          atProjectLimit ? (
            <span
              className="text-sm text-[#B45309] font-medium max-w-[14rem] text-right leading-snug"
              title={fillTemplate(t('projects.limitReachedHint'), {
                limit: projectQuota!.limit,
              })}
            >
              {fillTemplate(t('projects.limitReachedHint'), { limit: projectQuota!.limit })}
            </span>
          ) : (
            <Link href="/projetos/novo">
              <Button>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {t('projects.newProject')}
              </Button>
            </Link>
          )
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder={t('projects.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            >
              <option value="recent">{t('projects.sortRecent')}</option>
              <option value="name">{t('projects.sortName')}</option>
              <option value="progress">{t('projects.sortProgress')}</option>
            </select>

            <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${view === 'grid' ? 'bg-[#1E3A8A] text-white' : 'text-[#6B7280] hover:bg-[#F8FAFC]'}`}
                aria-label={t('projects.viewGridAria')}
                aria-pressed={view === 'grid'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${view === 'list' ? 'bg-[#1E3A8A] text-white' : 'text-[#6B7280] hover:bg-[#F8FAFC]'}`}
                aria-label={t('projects.viewListAria')}
                aria-pressed={view === 'list'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                statusFilter === f.value
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]'
              }`}
            >
              {f.label}
              {counts[f.value] !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === f.value ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#6B7280]'
                }`}>
                  {counts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-[#374151] mb-1">{t('projects.emptyTitle')}</h3>
            <p className="text-sm text-[#9CA3AF] mb-4">
              {search
                ? t('projects.emptySearch').replace('{{q}}', search)
                : t('projects.emptyHint')}
            </p>
            {!search && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <CreateDemoProjectButton
                  variant="primary"
                  size="md"
                  existingDemoProjectId={existingDemoProjectId}
                />
                <Link href="/projetos/novo">
                  <Button variant="outline">{t('projects.createProject')}</Button>
                </Link>
                <Link
                  href="/ajuda#comecar"
                  className="text-sm text-[#1E3A8A] font-medium hover:underline"
                >
                  {t('projects.firstUseGuide')}
                </Link>
              </div>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} view="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} view="list" />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-[#9CA3AF] text-center pt-2">
            {t('projects.showing')
              .replace('{{shown}}', String(filtered.length))
              .replace('{{total}}', String(projects.length))}
          </p>
        )}
      </div>
    </div>
  )
}
