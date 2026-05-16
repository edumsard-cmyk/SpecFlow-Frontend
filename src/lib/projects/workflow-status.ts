import type { ProjectStatus } from '@/types'
import { normalizeWorkflowStatus } from '@/types'

/** Status persistido em `projects.status` (enum Supabase sem `conclusion`). */
export type DatabaseProjectStatus = Exclude<ProjectStatus, 'conclusion'>

export function toDatabaseStatus(status: ProjectStatus): DatabaseProjectStatus {
  if (status === 'conclusion') return 'refinement'
  return normalizeWorkflowStatus(status) as DatabaseProjectStatus
}

/** Etapa exibida na UI (inclui Conclusão quando já existe documento salvo). */
export function resolveWorkflowStatus(
  dbStatus: ProjectStatus,
  hasSavedConclusion: boolean
): ProjectStatus {
  const base = normalizeWorkflowStatus(dbStatus)
  if (base === 'done') return 'done'
  if (hasSavedConclusion && (base === 'refinement' || base === 'conclusion')) {
    return 'conclusion'
  }
  return base
}

export function defaultProjectTab(status: ProjectStatus, hasSavedConclusion: boolean): string {
  if (status === 'done') return 'briefing'
  if (status === 'conclusion' || hasSavedConclusion) return 'conclusion'
  return 'refinement'
}
