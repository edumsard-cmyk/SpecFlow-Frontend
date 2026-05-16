'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import {
  buildSpecMarkdown,
  downloadTextFile,
  specExportBasename,
} from '@/lib/export/project-spec'
import { downloadSpecPdf } from '@/lib/export/project-pdf'
import { downloadJiraCsv } from '@/lib/export/jira-csv'
import { downloadNotionMarkdown } from '@/lib/export/notion-markdown'
import { fetchProjectExportInput } from '@/lib/export/fetch-project-export'
import { useI18n } from '@/components/i18n/I18nProvider'

interface ProjectExportButtonsProps {
  projectId: string
  disabled?: boolean
}

type ExportKind = 'md' | 'pdf' | 'jira' | 'notion'

/** Exporta o pacote completo (briefing, refinamento, histórias, documentação, manual) a partir dos dados salvos. */
export default function ProjectExportButtons({ projectId, disabled }: ProjectExportButtonsProps) {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const run = async (kind: ExportKind) => {
    setErr(null)
    setBusy(true)
    try {
      const input = await fetchProjectExportInput(projectId)
      if (!input) {
        setErr(t('export.loadError'))
        return
      }
      const basename = specExportBasename(input.projectName)
      if (kind === 'md') {
        downloadTextFile(
          `${basename}.md`,
          buildSpecMarkdown(input),
          'text/markdown;charset=utf-8'
        )
      } else if (kind === 'pdf') {
        downloadSpecPdf(input, basename)
      } else if (kind === 'jira') {
        if (input.stories.length === 0) {
          setErr(t('export.jiraNeedsStories'))
          return
        }
        downloadJiraCsv(input, basename)
      } else {
        downloadNotionMarkdown(input, basename)
      }
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? e.message
          : t('export.fail')
      setErr(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <p className="text-[10px] text-[#9CA3AF] text-right max-w-[280px] leading-tight mb-0.5">
        {t('export.hint')}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={() => run('md')}
          title={t('export.titleMd')}
        >
          .md
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={() => run('pdf')}
          title={t('export.titlePdf')}
        >
          PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={() => run('jira')}
          title={t('export.titleJira')}
        >
          Jira
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={() => run('notion')}
          title={t('export.titleNotion')}
        >
          Notion
        </Button>
      </div>
      {err && <p className="text-xs text-[#DC2626] max-w-[260px] text-right">{err}</p>}
    </div>
  )
}