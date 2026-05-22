'use server'

import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/data/audit'
import { getProfile } from '@/lib/data/profile'
import { createClient } from '@/lib/supabase/server'

export async function updateProfileNameAction(
  name: string
): Promise<{ error?: string; ok?: boolean }> {
  const trimmed = name.trim()
  if (trimmed.length < 2) {
    return { error: 'O nome precisa ter pelo menos 2 caracteres.' }
  }
  if (trimmed.length > 120) {
    return { error: 'O nome é muito longo.' }
  }

  const profile = await getProfile()
  if (!profile) return { error: 'Não autenticado.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ name: trimmed })
    .eq('id', profile.id)

  if (error) return { error: error.message }

  await logAudit({
    action: 'profile.update',
    entityType: 'profile',
    entityId: profile.id,
    companyId: profile.company_id,
    metadata: { field: 'name' },
  })

  revalidatePath('/configuracoes')
  revalidatePath('/', 'layout')
  return { ok: true }
}
