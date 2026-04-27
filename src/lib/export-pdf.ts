import jsPDF from 'jspdf'

interface ManualSection {
  id: string
  title: string
  steps: string[]
}

export function exportManualPDF(projectName: string, sections: ManualSection[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const margin = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = pageWidth - margin * 2
  let y = margin

  const checkNewPage = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
  }

  // Header
  doc.setFillColor(30, 58, 138)
  doc.rect(0, 0, pageWidth, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('SpecFlow', margin, 11)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Manual do Usuário', pageWidth - margin, 11, { align: 'right' })

  y = 30

  // Title
  doc.setTextColor(17, 24, 39)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(projectName, maxWidth)
  doc.text(titleLines, margin, y)
  y += titleLines.length * 8 + 4

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(107, 114, 128)
  doc.text(`Manual do Usuário — Versão 1.0`, margin, y)
  y += 5

  doc.setDrawColor(229, 231, 235)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // Sections
  for (const section of sections) {
    checkNewPage(20)

    // Section title
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 58, 138)
    const sectionLines = doc.splitTextToSize(section.title, maxWidth)
    doc.text(sectionLines, margin, y)
    y += sectionLines.length * 6 + 4

    // Steps
    for (let i = 0; i < section.steps.length; i++) {
      const stepText = section.steps[i]
      const lines = doc.splitTextToSize(stepText, maxWidth - 14)
      checkNewPage(lines.length * 5 + 6)

      // Step number circle
      doc.setFillColor(30, 58, 138)
      doc.circle(margin + 3, y - 1.5, 3, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(String(i + 1), margin + 3, y - 0.2, { align: 'center' })

      // Step text
      doc.setTextColor(55, 65, 81)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(lines, margin + 9, y)
      y += lines.length * 5 + 4
    }

    y += 6
    checkNewPage(2)
    doc.setDrawColor(241, 245, 249)
    doc.line(margin, y - 3, pageWidth - margin, y - 3)
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Gerado pelo SpecFlow · Página ${p} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    )
  }

  const filename = `${projectName.toLowerCase().replace(/\s+/g, '-')}-manual.pdf`
  doc.save(filename)
}
