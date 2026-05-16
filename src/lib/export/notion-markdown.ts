import type { ProjectExportInput } from '@/lib/export/project-spec'
import { downloadTextFile } from '@/lib/export/project-spec'

/** Markdown estruturado para colar ou importar no Notion. */
export function buildNotionMarkdown(input: ProjectExportInput): string {
  const lines: string[] = [`# ${input.projectName}`, '']

  if (input.projectDescription?.trim()) {
    lines.push(input.projectDescription.trim(), '')
  }

  if (input.briefing?.trim()) {
    lines.push('## Briefing', '', input.briefing.trim(), '')
  }

  if (input.refinementMessages && input.refinementMessages.length > 0) {
    lines.push('## Refinamento', '')
    for (const m of input.refinementMessages) {
      const label = m.role === 'user' ? 'Solicitante' : 'SpecFlow'
      lines.push(`### ${label}`, '', m.content.trim(), '')
    }
  }

  if (input.stories.length > 0) {
    lines.push('## Histórias de usuário', '')
    for (const s of input.stories) {
      lines.push(`### ${s.id} — ${s.title}`, '', s.description.trim(), '')
      if (s.criteria.length > 0) {
        lines.push('**Critérios de aceite**', '')
        for (const c of s.criteria) {
          lines.push(`- [ ] ${c}`)
        }
        lines.push('')
      }
    }
  }

  if (input.docSections && input.docSections.length > 0) {
    lines.push('## Documentação técnica', '')
    for (const sec of input.docSections) {
      lines.push(`### ${sec.title}`, '')
      if (sec.type === 'list' && sec.items?.length) {
        for (const item of sec.items) lines.push(`- ${item}`)
      } else {
        lines.push(sec.content.trim())
      }
      lines.push('')
    }
  }

  if (input.manualSections && input.manualSections.length > 0) {
    lines.push('## Manual do usuário', '')
    for (const sec of input.manualSections) {
      lines.push(`### ${sec.title}`, '')
      sec.steps.forEach((step, i) => {
        lines.push(`${i + 1}. ${step}`)
      })
      lines.push('')
    }
  }

  return lines.join('\n').trim() + '\n'
}

export function downloadNotionMarkdown(input: ProjectExportInput, basename: string): void {
  downloadTextFile(
    `${basename}-notion.md`,
    buildNotionMarkdown(input),
    'text/markdown;charset=utf-8'
  )
}
