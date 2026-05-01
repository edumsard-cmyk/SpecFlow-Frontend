/** Geração de conteúdo para exportação (Markdown / PDF). Sem dependência de DOM. */

export interface ExportStory {
  id: string
  title: string
  description: string
  criteria: string[]
}

export interface ExportDocSection {
  title: string
  content: string
  type: string
  items?: string[]
}

export interface ExportManualSection {
  title: string
  steps: string[]
}

export interface ProjectExportInput {
  projectName: string
  projectDescription?: string | null
  briefing: string | null
  stories: ExportStory[]
  docSections?: ExportDocSection[] | null
  manualSections?: ExportManualSection[] | null
  refinementMessages?: { role: string; content: string }[] | null
}

function slugifyFilename(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 80) || 'projeto'
}

export function buildSpecMarkdown(input: ProjectExportInput): string {
  const lines: string[] = []
  lines.push(`# ${input.projectName}`)
  if (input.projectDescription?.trim()) {
    lines.push('')
    lines.push(input.projectDescription.trim())
  }
  lines.push('')
  lines.push('## Briefing')
  lines.push('')
  lines.push((input.briefing ?? '(sem briefing registrado)').trim())
  lines.push('')
  lines.push('## Histórias de usuário')
  lines.push('')

  if (input.stories.length === 0) {
    lines.push('_(Nenhuma história registrada)_')
  } else {
    for (const s of input.stories) {
      lines.push(`### ${s.id} — ${s.title}`)
      lines.push('')
      lines.push(s.description.trim())
      lines.push('')
      if (s.criteria.length > 0) {
        lines.push('**Critérios de aceite:**')
        for (const c of s.criteria) {
          lines.push(`- ${c}`)
        }
        lines.push('')
      }
    }
  }

  const refin = input.refinementMessages?.filter(m => m.content?.trim()) ?? []
  if (refin.length > 0) {
    lines.push('')
    lines.push('## Refinamento (conversa com IA)')
    lines.push('')
    for (const m of refin) {
      const who = m.role === 'user' ? 'Usuário' : 'IA'
      lines.push(`**${who}:** ${m.content.trim()}`)
      lines.push('')
    }
  }

  const docs = input.docSections?.filter(s => s.title?.trim()) ?? []
  if (docs.length > 0) {
    lines.push('')
    lines.push('## Documentação')
    lines.push('')
    for (const s of docs) {
      lines.push(`### ${s.title}`)
      lines.push('')
      if (s.type === 'text' && s.content?.trim()) {
        lines.push(s.content.trim())
        lines.push('')
      }
      if ((s.type === 'list' || s.type === 'grid') && s.items?.length) {
        for (const it of s.items) {
          lines.push(`- ${it}`)
        }
        lines.push('')
      }
    }
  }

  const manual = input.manualSections?.filter(s => s.title?.trim()) ?? []
  if (manual.length > 0) {
    lines.push('')
    lines.push('## Manual do usuário')
    lines.push('')
    for (const s of manual) {
      lines.push(`### ${s.title}`)
      lines.push('')
      ;(s.steps ?? []).forEach((step, i) => {
        lines.push(`${i + 1}. ${step}`)
      })
      lines.push('')
    }
  }

  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push(`_Gerado pelo SpecFlow em ${new Date().toLocaleString('pt-BR')}_`)

  return lines.join('\n')
}

export function specExportBasename(projectName: string): string {
  return `${slugifyFilename(projectName)}-pacote-specflow`
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
