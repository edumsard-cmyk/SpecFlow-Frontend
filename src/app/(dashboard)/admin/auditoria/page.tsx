import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

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

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Auditoria"
        subtitle="Registro de ações recentes na plataforma (visão administrador)"
      />

      <div className="flex-1 p-6">
        {error && (
          <p className="text-sm text-[#DC2626] mb-4">
            Não foi possível carregar os logs. Aplique a migration <code className="text-xs bg-[#F1F5F9] px-1 rounded">003_audit_and_story_comments.sql</code> no Supabase.
          </p>
        )}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                  <th className="px-4 py-3">Quando</th>
                  <th className="px-4 py-3">Ação</th>
                  <th className="px-4 py-3">Entidade</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[#9CA3AF]">
                      Nenhum evento registrado ainda.
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {formatDate(row.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#111827]">{row.action}</td>
                      <td className="px-4 py-3 text-[#374151]">
                        {row.entity_type}
                        {row.entity_id ? (
                          <span className="block text-xs text-[#9CA3AF] font-mono truncate max-w-[120px]">
                            {row.entity_id}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-[#374151]">
                        {row.user_id ? (names[row.user_id] ?? row.user_id.slice(0, 8)) : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7280] max-w-xs truncate font-mono">
                        {JSON.stringify(row.metadata)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
