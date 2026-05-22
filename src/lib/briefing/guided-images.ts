export const GUIDED_IMAGES_MARKER = '<!--specflow-guided-images:'

export type GuidedImageStoredBlock = {
  text: string
  fileName: string
  storageRef: string
}

export type GuidedImagesMeta = {
  version: 1
  blocks: GuidedImageStoredBlock[]
}

export function serializeGuidedImagesContent(blocks: GuidedImageStoredBlock[]): string {
  const narrative = blocks
    .map((b, i) => `### Imagem ${i + 1}\n${b.text.trim()}`)
    .join('\n\n')
  const meta: GuidedImagesMeta = { version: 1, blocks }
  return `${narrative}\n\n${GUIDED_IMAGES_MARKER}${JSON.stringify(meta)}-->`
}

export function parseGuidedImagesContent(content: string): GuidedImagesMeta | null {
  const idx = content.lastIndexOf(GUIDED_IMAGES_MARKER)
  if (idx === -1) return null
  const start = idx + GUIDED_IMAGES_MARKER.length
  const end = content.indexOf('-->', start)
  if (end === -1) return null
  try {
    const parsed = JSON.parse(content.slice(start, end)) as GuidedImagesMeta
    if (parsed?.version !== 1 || !Array.isArray(parsed.blocks)) return null
    return parsed
  } catch {
    return null
  }
}

export function stripGuidedImagesMarker(content: string): string {
  const idx = content.lastIndexOf(GUIDED_IMAGES_MARKER)
  if (idx === -1) return content.trim()
  return content.slice(0, idx).trim()
}

export function imageExtFromName(name: string): string {
  const m = name.match(/\.([a-z0-9]+)$/i)
  return m ? m[1].toLowerCase() : 'jpg'
}

export function imageMimeFromExt(ext: string): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  }
  return map[ext] ?? 'image/jpeg'
}
