import type { ProjectConclusion } from '@/types'

export function parseProjectConclusion(raw: unknown): ProjectConclusion | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>

  const summary = typeof o.summary === 'string' ? o.summary.trim() : ''
  const narrative =
    typeof o.narrative === 'string' && o.narrative.trim()
      ? o.narrative.trim()
      : summary

  if (!narrative) return null

  const highlights = Array.isArray(o.highlights)
    ? o.highlights.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : []

  const actionItems = Array.isArray(o.actionItems)
    ? o.actionItems.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : Array.isArray(o.recommendations)
      ? o.recommendations.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
      : []

  return {
    narrative,
    summary: summary || narrative,
    highlights,
    actionItems,
    readyToFinish: o.readyToFinish === true,
    generatedAt: typeof o.generatedAt === 'string' ? o.generatedAt : new Date().toISOString(),
  }
}
