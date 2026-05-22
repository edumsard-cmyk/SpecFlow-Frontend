import AdminAuditClient from '@/components/admin/AdminAuditClient'
import { createAdminClient } from '@/lib/supabase/server'

export default async function AuditoriaPage() {
  const admin = createAdminClient()
  const { data: logs, error } = await admin
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(250)

  const rows = error ? [] : (logs ?? [])

  const userIds = [...new Set(rows.map(r => r.user_id).filter(Boolean))] as string[]
  let names: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profs } = await admin.from('profiles').select('id, name').in('id', userIds)
    names = Object.fromEntries((profs ?? []).map(p => [p.id, p.name]))
  }

  return <AdminAuditClient rows={rows} names={names} loadError={Boolean(error)} />
}
