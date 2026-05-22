import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'
import {
  downloadBriefingObject,
  listBriefingObjects,
  objectPathFromBriefingRef,
  probeBriefingObjectPath,
} from '@/lib/briefing/storage-access'

type BriefingRow = Database['public']['Tables']['briefings']['Row']

export type BriefingSourceKind = 'audio' | 'video' | 'document'

export type BriefingSourceMeta = {
  kind: BriefingSourceKind
  objectPath: string
  fileName: string
  mimeType: string
}

export type BriefingMediaUi = {
  kind: BriefingSourceKind
  fileName: string
  available: boolean
}

const MIME_BY_EXT: Record<string, string> = {
  webm: 'audio/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  opus: 'audio/ogg',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  txt: 'text/plain',
}

function mimeFromFileName(
  name: string,
  inputType?: BriefingRow['input_type']
): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'webm') {
    return inputType === 'video' ? 'video/webm' : 'audio/webm'
  }
  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

function kindFromInputAndName(
  inputType: BriefingRow['input_type'],
  fileName: string
): BriefingSourceKind {
  if (inputType === 'audio') return 'audio'
  if (inputType === 'video') return 'video'
  if (inputType === 'document') return 'document'
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  if (['webm', 'mp3', 'wav', 'm4a', 'ogg', 'opus'].includes(ext)) return 'audio'
  if (['mp4', 'mov', 'mkv'].includes(ext)) return 'video'
  return 'document'
}

function probeCandidates(inputType: BriefingRow['input_type']): string[] {
  if (inputType === 'audio') {
    return ['briefing.webm', 'briefing.mp3', 'briefing.wav', 'briefing.m4a', 'briefing.ogg']
  }
  if (inputType === 'video') {
    return [
      'briefing-video.webm',
      'briefing-video.mp4',
      'briefing-video.mov',
      'briefing-video.mkv',
      'briefing-video.ogg',
    ]
  }
  if (inputType === 'document') {
    return ['briefing-document.pdf', 'briefing-document.docx', 'briefing-document.txt']
  }
  return [
    'briefing-video.webm',
    'briefing-video.mp4',
    'briefing.webm',
    'briefing-document.pdf',
  ]
}

function pickObjectPathFromList(paths: string[], inputType: BriefingRow['input_type']): string | null {
  const preferred = [
    inputType === 'video' ? /^briefing-video\./i : null,
    inputType === 'audio' ? /^briefing\.(webm|mp3|wav|m4a|ogg)$/i : null,
    inputType === 'document' ? /^briefing-document\./i : null,
    /^briefing-video\./i,
    /^briefing\./i,
    /^briefing-document\./i,
  ].filter(Boolean) as RegExp[]

  for (const re of preferred) {
    const hit = paths.find(p => re.test(p.split('/').pop() ?? ''))
    if (hit) return hit
  }
  return paths[0] ?? null
}

/** Resolve ficheiro original do briefing no storage (áudio, vídeo ou documento). */
export async function resolveBriefingSourceMeta(
  briefing: BriefingRow | null,
  projectId: string
): Promise<BriefingSourceMeta | null> {
  if (!briefing) return null

  const storedRef =
    briefing.input_type === 'audio'
      ? briefing.audio_url
      : briefing.input_type === 'document' || briefing.input_type === 'video'
        ? briefing.document_url
        : briefing.audio_url || briefing.document_url

  let objectPath = objectPathFromBriefingRef(storedRef)

  if (!objectPath) {
    const listed = await listBriefingObjects(projectId)
    objectPath = pickObjectPathFromList(listed, briefing.input_type)
  }

  if (!objectPath) {
    objectPath = await probeBriefingObjectPath(projectId, probeCandidates(briefing.input_type))
  }

  if (!objectPath) return null

  const check = await downloadBriefingObject(objectPath)
  if (!check.data) return null

  const fileName = objectPath.split('/').pop() ?? 'arquivo'
  const kind = kindFromInputAndName(briefing.input_type, fileName)

  return {
    kind,
    objectPath,
    fileName,
    mimeType: mimeFromFileName(fileName, briefing.input_type),
  }
}

export async function briefingMediaForUi(
  briefing: BriefingRow | null,
  projectId: string
): Promise<BriefingMediaUi | null> {
  if (!briefing) return null
  const resolved = await resolveBriefingSourceMeta(briefing, projectId)
  if (resolved) {
    return {
      kind: resolved.kind,
      fileName: resolved.fileName,
      available: true,
    }
  }
  const inputType = briefing.input_type
  if (inputType === 'video') return { kind: 'video', fileName: 'briefing-video.webm', available: false }
  if (inputType === 'audio') return { kind: 'audio', fileName: 'briefing.webm', available: false }
  if (inputType === 'document') {
    return { kind: 'document', fileName: 'briefing-document.pdf', available: false }
  }
  return null
}
