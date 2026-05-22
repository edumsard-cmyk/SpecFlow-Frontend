import type { ProjectStatus } from '@/types'
import { normalizeWorkflowStatus, STATUS_STEPS } from '@/types'

/** Status persistido em `projects.status` (enum Supabase sem `conclusion`). */
export type DatabaseProjectStatus = Exclude<ProjectStatus, 'conclusion'>

export function toDatabaseStatus(status: ProjectStatus): DatabaseProjectStatus {
  if (status === 'conclusion') return 'refinement'
  return normalizeWorkflowStatus(status) as DatabaseProjectStatus
}

/** Etapa exibida na UI. Só avança para Conclusão se o projeto já está em refinamento (ou conclusão) no banco. */
export function resolveWorkflowStatus(
  dbStatus: ProjectStatus,
  hasSavedConclusion: boolean
): ProjectStatus {
  const base = normalizeWorkflowStatus(dbStatus)
  if (base === 'done') return 'done'
  if (base === 'conclusion') return 'conclusion'
  if (hasSavedConclusion && base === 'refinement') return 'conclusion'
  return base
}

/** Aba inicial = etapa atual do projeto (fluxo linear briefing → … → conclusão). */
export function defaultProjectTab(status: ProjectStatus, hasSavedConclusion: boolean): string {
  const resolved = resolveWorkflowStatus(status, hasSavedConclusion)
  if (resolved === 'done') return 'briefing'
  const step = normalizeWorkflowStatus(resolved)
  if (step === 'briefing' || step === 'specification' || step === 'manual' || step === 'refinement' || step === 'conclusion') {
    return step
  }
  return 'briefing'
}

export function nextWorkflowStep(current: ProjectStatus): ProjectStatus | 'done' {
  const base = normalizeWorkflowStatus(current)
  const idx = STATUS_STEPS.indexOf(base)
  if (idx < 0) return 'specification'
  const next = STATUS_STEPS[idx + 1]
  return next ?? 'done'
}
