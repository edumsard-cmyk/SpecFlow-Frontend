import type { ProjectExportInput } from './project-spec'

/** Monta o pacote de exportação a partir da API (dados persistidos no servidor). */
export async function fetchProjectExportInput(projectId: string): Promise<ProjectExportInput | null> {
  const res = await fetch(`/api/projects/${projectId}`)
  if (!res.ok) return null

  const data = (await res.json()) as {
    project?: { name?: string; description?: string | null }
    briefing?: { content?: string } | null
    stories?: Array<{
      code: string
      title: string
      description: string
      acceptance_criteria: unknown
    }>
    documents?: Array<{ type: string; content: string }>
    refinementMessages?: Array<{ role: string; content: string }>
  }

  const name = data.project?.name?.trim() || 'Projeto'
  const briefing = data.briefing?.content ?? null

  const stories = (data.stories ?? []).map(s => ({
    id: s.code,
    title: s.title,
    description: s.description,
    criteria: Array.isArray(s.acceptance_criteria)
      ? (s.acceptance_criteria as string[])
      : [],
  }))

  let docSections: ProjectExportInput['docSections'] = null
  const docRow = data.documents?.find(d => d.type === 'doc')
  if (docRow?.content) {
    try {
      const parsed = JSON.parse(docRow.content) as unknown
      if (Array.isArray(parsed)) {
        docSections = parsed.map((row: Record<string, unknown>) => ({
          title: String(row.title ?? ''),
          content: String(row.content ?? ''),
          type: String(row.type ?? 'text'),
          items: Array.isArray(row.items) ? row.items.map(String) : undefined,
        }))
      }
    } catch {
      /* ignore */
    }
  }

  let manualSections: ProjectExportInput['manualSections'] = null
  const manualRow = data.documents?.find(d => d.type === 'manual')
  if (manualRow?.content) {
    try {
      const parsed = JSON.parse(manualRow.content) as unknown
      if (Array.isArray(parsed)) {
        manualSections = parsed.map((row: Record<string, unknown>) => ({
          title: String(row.title ?? ''),
          steps: Array.isArray(row.steps) ? row.steps.map(String) : [],
        }))
      }
    } catch {
      /* ignore */
    }
  }

  const refinementMessages = (data.refinementMessages ?? []).map(m => ({
    role: m.role,
    content: m.content,
  }))

  return {
    projectName: name,
    projectDescription: data.project?.description ?? null,
    briefing,
    stories,
    docSections,
    manualSections,
    refinementMessages: refinementMessages.length > 0 ? refinementMessages : null,
  }
}
