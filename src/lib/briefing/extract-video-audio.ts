import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

/** Extrai faixa de áudio de um vídeo (requer ffmpeg no ambiente Node). */
export async function extractAudioFromVideo(
  videoBuffer: Buffer,
  inputExt: string
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  const id = randomUUID()
  const dir = join(tmpdir(), `specflow-vid-${id}`)
  await mkdir(dir, { recursive: true })

  const safeExt = inputExt.replace(/[^a-z0-9]/gi, '') || 'webm'
  const inputPath = join(dir, `input.${safeExt}`)
  const outputPath = join(dir, 'audio.mp3')

  try {
    await writeFile(inputPath, videoBuffer)

    const ffmpeg = (await import('fluent-ffmpeg')).default
    const installer = await import('@ffmpeg-installer/ffmpeg')
    ffmpeg.setFfmpegPath(installer.default.path)

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .format('mp3')
        .on('error', err => reject(err))
        .on('end', () => resolve())
        .save(outputPath)
    })

    const buffer = await readFile(outputPath)
    return { buffer, mimeType: 'audio/mpeg', filename: 'briefing-audio.mp3' }
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}

export function videoExtFromMime(mime: string): string {
  const m = mime.toLowerCase().split(';')[0]?.trim() ?? ''
  const map: Record<string, string> = {
    'video/webm': 'webm',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/ogg': 'ogv',
  }
  return map[m] ?? 'webm'
}
