'use client'

import { jsPDF } from 'jspdf'
import type { ProjectExportInput } from './project-spec'
import { buildSpecMarkdown } from './project-spec'

/** PDF simples a partir do mesmo conteúdo do Markdown (texto puro, várias páginas). */
export function downloadSpecPdf(input: ProjectExportInput, basename: string): void {
  const raw = buildSpecMarkdown(input)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 18
  const maxW = 210 - margin * 2
  let y = 18
  const lineH = 5.5
  const pageH = 297

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  const paragraphs = raw.split(/\n\n+/)
  for (const block of paragraphs) {
    const lines = doc.splitTextToSize(block.replace(/\n/g, ' '), maxW)
    for (const line of lines) {
      if (y + lineH > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += lineH
    }
    y += lineH * 0.35
  }

  doc.save(`${basename}.pdf`)
}
