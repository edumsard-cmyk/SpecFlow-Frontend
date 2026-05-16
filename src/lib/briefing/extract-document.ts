import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

const MAX_EXTRACTED_CHARS = 120_000

function trimExtracted(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  if (normalized.length <= MAX_EXTRACTED_CHARS) return normalized
  return `${normalized.slice(0, MAX_EXTRACTED_CHARS)}\n\n[… texto truncado por limite de tamanho …]`
}

async function extractPdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default as (
    data: Buffer
  ) => Promise<{ text?: string }>
  const result = await pdfParse(buffer)
  return result.text?.trim() ?? ''
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value?.trim() ?? ''
}

function extractXlsx(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const parts: string[] = []
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) continue
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false })
    if (csv.trim()) {
      parts.push(`## Planilha: ${sheetName}\n\n${csv.trim()}`)
    }
  }
  return parts.join('\n\n')
}

function extractTxt(buffer: Buffer): string {
  return buffer.toString('utf8').trim()
}

export function documentExtFromName(filename: string): string {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? (parts.pop() ?? '') : ''
}

export async function extractTextFromDocument(
  buffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<string> {
  const ext = documentExtFromName(filename)
  const mime = (mimeType ?? '').toLowerCase()

  let text = ''

  if (ext === 'pdf' || mime.includes('pdf')) {
    text = await extractPdf(buffer)
  } else if (ext === 'docx' || mime.includes('wordprocessingml')) {
    text = await extractDocx(buffer)
  } else if (ext === 'doc' || mime.includes('msword')) {
    throw new Error('Formato .doc antigo não suportado. Converta para .docx ou PDF.')
  } else if (ext === 'xlsx' || ext === 'xls' || mime.includes('spreadsheet') || mime.includes('excel')) {
    text = extractXlsx(buffer)
  } else if (ext === 'txt' || mime.startsWith('text/')) {
    text = extractTxt(buffer)
  } else {
    throw new Error('Formato não suportado. Use PDF, Word (.docx), Excel ou TXT.')
  }

  const trimmed = trimExtracted(text)
  if (trimmed.length < 15) {
    throw new Error(
      'Pouco texto extraído do arquivo. Verifique se o documento não está vazio ou protegido.'
    )
  }

  return trimmed
}
