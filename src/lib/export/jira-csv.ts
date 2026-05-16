import type { ProjectExportInput } from '@/lib/export/project-spec'
import { downloadTextFile } from '@/lib/export/project-spec'

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/** CSV compatível com importação em massa no Jira (Summary + Description). */
export function buildJiraImportCsv(input: ProjectExportInput): string {
  const header = ['Issue Type', 'Summary', 'Description']
  const rows = input.stories.map(story => {
    const summary = `${story.id}: ${story.title}`
    const criteria =
      story.criteria.length > 0
        ? `\n\n*Critérios de aceite:*\n${story.criteria.map(c => `* ${c}`).join('\n')}`
        : ''
    const description = `${story.description}${criteria}`
    return ['Story', summary, description].map(escapeCsv).join(',')
  })

  return [header.join(','), ...rows].join('\n')
}

export function downloadJiraCsv(input: ProjectExportInput, basename: string): void {
  downloadTextFile(`${basename}-jira.csv`, buildJiraImportCsv(input), 'text/csv;charset=utf-8')
}
