import {
  uploadBriefingObject,
  type BriefingUploadFailure,
  type BriefingUploadResult,
} from '@/lib/briefing/storage-access'

export const BRIEFING_MEDIA_BUCKET = 'briefing-media'

export async function uploadBriefingMedia(
  projectId: string,
  buffer: Buffer,
  objectName: string,
  contentType: string
): Promise<BriefingUploadResult | BriefingUploadFailure> {
  const objectPath = `${projectId}/${objectName}`
  return uploadBriefingObject(objectPath, buffer, contentType)
}

export function isUploadFailure(
  r: BriefingUploadResult | BriefingUploadFailure
): r is BriefingUploadFailure {
  return 'ok' in r && r.ok === false
}
