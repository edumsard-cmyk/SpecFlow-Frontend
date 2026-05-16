import { createClient } from '@/lib/supabase/server'

export const BRIEFING_MEDIA_BUCKET = 'briefing-media'

export async function uploadBriefingMedia(
  projectId: string,
  buffer: Buffer,
  objectName: string,
  contentType: string
): Promise<string | null> {
  const supabase = await createClient()
  const objectPath = `${projectId}/${objectName}`

  const { error } = await supabase.storage.from(BRIEFING_MEDIA_BUCKET).upload(objectPath, buffer, {
    contentType,
    upsert: true,
  })

  if (error) {
    console.warn('Briefing media upload skipped:', error.message)
    return null
  }

  const { data } = supabase.storage.from(BRIEFING_MEDIA_BUCKET).getPublicUrl(objectPath)
  return data.publicUrl
}
