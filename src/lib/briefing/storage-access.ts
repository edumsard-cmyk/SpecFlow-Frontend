import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseSecretKey } from '@/lib/supabase/keys'
import { BRIEFING_MEDIA_BUCKET } from '@/lib/briefing/upload-briefing-media'

const STORAGE_REF_PREFIX = 'storage://'
const BUCKET_FILE_LIMIT = 52_428_800 // 50 MB

export type BriefingUploadResult = {
  objectPath: string
  publicUrl: string | null
  storageRef: string
}

export type BriefingUploadFailure = {
  ok: false
  message: string
}

export type BriefingUploadResponse = BriefingUploadResult | BriefingUploadFailure

export function formatBriefingStorageRef(objectPath: string): string {
  return `${STORAGE_REF_PREFIX}${objectPath}`
}

export function objectPathFromBriefingRef(ref: string | null | undefined): string | null {
  if (!ref?.trim()) return null
  const trimmed = ref.trim()
  if (trimmed.startsWith(STORAGE_REF_PREFIX)) {
    return trimmed.slice(STORAGE_REF_PREFIX.length)
  }
  const patterns = [
    `/object/public/${BRIEFING_MEDIA_BUCKET}/`,
    `/object/sign/${BRIEFING_MEDIA_BUCKET}/`,
    `/object/authenticated/${BRIEFING_MEDIA_BUCKET}/`,
  ]
  for (const marker of patterns) {
    const i = trimmed.indexOf(marker)
    if (i !== -1) {
      return decodeURIComponent(trimmed.slice(i + marker.length).split('?')[0] ?? '')
    }
  }
  return null
}

async function storageClients() {
  const user = await createClient()
  let admin: ReturnType<typeof createAdminClient> | null = null
  if (hasSupabaseSecretKey()) {
    try {
      admin = createAdminClient()
    } catch {
      admin = null
    }
  }
  return { user, admin }
}

/** Cria o bucket briefing-media via service role (ignora RLS). */
export async function ensureBriefingMediaBucket(): Promise<{ ok: true } | { ok: false; message: string }> {
  const { admin } = await storageClients()
  if (!admin) {
    return {
      ok: false,
      message:
        'Defina SUPABASE_SECRET_KEY (sb_secret_...) no .env.local: Supabase → Settings → API Keys → Secret keys → revelar e copiar. Reinicie npm run dev.',
    }
  }

  const { data: buckets, error: listErr } = await admin.storage.listBuckets()
  if (listErr) {
    return { ok: false, message: `Storage: ${listErr.message}` }
  }

  const exists = (buckets ?? []).some(
    b => b.id === BRIEFING_MEDIA_BUCKET || b.name === BRIEFING_MEDIA_BUCKET
  )
  if (exists) return { ok: true }

  const { error: createErr } = await admin.storage.createBucket(BRIEFING_MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: BUCKET_FILE_LIMIT,
  })

  if (createErr) {
    return {
      ok: false,
      message: `Não foi possível criar o bucket "${BRIEFING_MEDIA_BUCKET}": ${createErr.message}. Execute também a migração 004 no SQL Editor do Supabase.`,
    }
  }

  return { ok: true }
}

export async function uploadBriefingObject(
  objectPath: string,
  buffer: Buffer,
  contentType: string
): Promise<BriefingUploadResponse> {
  const bucketReady = await ensureBriefingMediaBucket()
  if (!bucketReady.ok) {
    return { ok: false, message: bucketReady.message }
  }

  const { user, admin } = await storageClients()
  const bucket = BRIEFING_MEDIA_BUCKET
  const opts = { contentType, upsert: true }
  const errors: string[] = []

  if (admin) {
    const { error } = await admin.storage.from(bucket).upload(objectPath, buffer, opts)
    if (!error) {
      const pub = admin.storage.from(bucket).getPublicUrl(objectPath)
      return {
        objectPath,
        publicUrl: pub.data.publicUrl,
        storageRef: formatBriefingStorageRef(objectPath),
      }
    }
    errors.push(`admin: ${error.message}`)
  }

  const { error: userErr } = await user.storage.from(bucket).upload(objectPath, buffer, opts)
  if (!userErr) {
    const pub = user.storage.from(bucket).getPublicUrl(objectPath)
    return {
      objectPath,
      publicUrl: pub.data.publicUrl,
      storageRef: formatBriefingStorageRef(objectPath),
    }
  }
  errors.push(`user: ${userErr.message}`)

  const hint = admin
    ? 'Verifique as políticas do storage (migração 004 e 009 no Supabase).'
    : 'Configure SUPABASE_SECRET_KEY (sb_secret_...) no .env.local e reinicie npm run dev.'

  return {
    ok: false,
    message: `Upload falhou (${errors.join('; ')}). ${hint}`,
  }
}

export async function downloadBriefingObject(
  objectPath: string
): Promise<{ data: Blob; error: null } | { data: null; error: string }> {
  const { user, admin } = await storageClients()
  const bucket = BRIEFING_MEDIA_BUCKET

  const userRes = await user.storage.from(bucket).download(objectPath)
  if (!userRes.error && userRes.data) {
    return { data: userRes.data, error: null }
  }

  if (admin) {
    const adminRes = await admin.storage.from(bucket).download(objectPath)
    if (!adminRes.error && adminRes.data) {
      return { data: adminRes.data, error: null }
    }
    return { data: null, error: adminRes.error?.message ?? userRes.error?.message ?? 'download failed' }
  }

  return { data: null, error: userRes.error?.message ?? 'download failed' }
}

export async function listBriefingObjects(projectId: string): Promise<string[]> {
  const { user, admin } = await storageClients()
  const bucket = BRIEFING_MEDIA_BUCKET

  const listFrom = async (client: typeof user) => {
    const { data, error } = await client.storage.from(bucket).list(projectId, { limit: 50 })
    if (error || !data?.length) return [] as string[]
    return data
      .filter(f => f.name && f.name !== '.emptyFolderPlaceholder')
      .map(f => `${projectId}/${f.name}`)
  }

  const userList = await listFrom(user)
  if (userList.length > 0) return userList
  if (admin) return listFrom(admin)
  return []
}

export async function probeBriefingObjectPath(
  projectId: string,
  candidates: string[]
): Promise<string | null> {
  for (const name of candidates) {
    const path = `${projectId}/${name}`
    const res = await downloadBriefingObject(path)
    if (res.data) return path
  }
  return null
}
