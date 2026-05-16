import Groq, { toFile } from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function transcribeAudioBuffer(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  if (!process.env.GROQ_API_KEY?.trim()) {
    throw new Error('GROQ_API_KEY não configurada.')
  }

  const fileForGroq = await toFile(buffer, filename, {
    type: mimeType || 'audio/webm',
  })

  const transcription = await groq.audio.transcriptions.create({
    file: fileForGroq,
    model: 'whisper-large-v3-turbo',
    language: 'pt',
  })

  return transcription.text?.trim() ?? ''
}

export function normalizeBriefingFromTranscription(text: string, fallbackLabel: string): string {
  if (text.length >= 3) return text
  return `[${fallbackLabel} — transcrição vazia ou inaudível. Complete o briefing na aba Briefing.]\n\n${text}`.trim()
}
