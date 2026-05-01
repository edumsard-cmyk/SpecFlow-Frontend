'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import {
  buildSpecMarkdown,
  downloadTextFile,
  specExportBasename,
} from '@/lib/export/project-spec'
import { downloadSpecPdf } from '@/lib/export/project-pdf'
import { fetchProjectExportInput } from '@/lib/export/fetch-project-export'

interface ProjectExportButtonsProps {
  projectId: string
  disabled?: boolean
}

/** Exporta o pacote completo (briefing, refinamento, histórias, documentação, manual) a partir dos dados salvos. */
export default function ProjectExportButtons({ projectId, disabled }: ProjectExportButtonsProps) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const run = async (kind: 'md' | 'pdf') => {
    setErr(null)
    setBusy(true)
    try {
      const input = await fetchProjectExportInput(projectId)
      if (!input) {
        setErr('Não foi possível carregar o projeto.')
        return
      }
      const basename = specExportBasename(input.projectName)
      if (kind === 'md') {
        downloadTextFile(
          `${basename}.md`,
          buildSpecMarkdown(input),
          'text/markdown;charset=utf-8'
        )
      } else {
        downloadSpecPdf(input, basename)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={() => run('md')}
          title="Baixar pacote completo em Markdown (dados salvos)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          .md
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={() => run('pdf')}
          title="Baixar pacote completo em PDF (dados salvos)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          PDF
        </Button>
      </div>
      {err && <p className="text-xs text-[#DC2626] max-w-[220px] text-right">{err}</p>}
    </div>
  )
}
