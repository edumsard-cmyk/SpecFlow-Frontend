import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/data/profile'
import { type Json } from '@/lib/supabase/types'

export async function logAudit(entry: {
  action: string
  entityType: string
  entityId?: string | null
  companyId?: string | null
  metadata?: Record<string, unknown>
}): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const profile = await getProfile()
    const companyId = entry.companyId ?? profile?.company_id ?? null

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      company_id: companyId,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId ?? null,
      metadata: (entry.metadata ?? {}) as Json,
    })
  } catch {
    /* auditoria não deve bloquear o fluxo principal */
  }
}
