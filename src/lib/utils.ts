import type { Locale } from '@/lib/i18n/dictionaries'
import { intlLocaleTag } from '@/lib/i18n/locale-format'
import { normalizeWorkflowStatus, type ProjectStatus } from '@/types'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string, locale?: Locale): string {
  const tag = locale ? intlLocaleTag(locale) : 'pt-BR'
  return new Intl.DateTimeFormat(tag, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    briefing: 'bg-blue-100 text-blue-700',
    refinement: 'bg-purple-100 text-purple-700',
    conclusion: 'bg-indigo-100 text-indigo-700',
    specification: 'bg-amber-100 text-amber-700',
    documentation: 'bg-cyan-100 text-cyan-700',
    manual: 'bg-emerald-100 text-emerald-700',
    done: 'bg-green-100 text-green-700',
  }
  return colors[status]
}

export function getProfileInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getProgressFromStatus(status: ProjectStatus): number {
  const progress: Record<ProjectStatus, number> = {
    briefing: 10,
    specification: 35,
    documentation: 55,
    manual: 55,
    refinement: 75,
    conclusion: 90,
    done: 100,
  }
  return progress[normalizeWorkflowStatus(status)]
}
