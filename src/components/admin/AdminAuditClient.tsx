'use client'

import LocalizedHeader from '@/components/layout/LocalizedHeader'
import Card from '@/components/ui/Card'
import { useI18n } from '@/components/i18n/I18nProvider'
import { intlLocaleTag } from '@/lib/i18n/locale-format'

type AuditRow = {
  id: string
  created_at: string
  action: string
  entity_type: string
  entity_id: string | null
  user_id: string | null
  metadata: unknown
}

type Props = {
  rows: AuditRow[]
  names: Record<string, string>
  loadError: boolean
}

export default function AdminAuditClient({ rows, names, loadError }: Props) {
  const { t, locale } = useI18n()

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(intlLocaleTag(locale), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))

  return (
    <div className="flex flex-col flex-1">
      <LocalizedHeader titleKey="admin.audit.title" subtitleKey="admin.audit.subtitle" />

      <div className="flex-1 p-6">
        {loadError && (
          <p className="text-sm text-[#DC2626] mb-4">{t('admin.audit.loadError')}</p>
        )}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                  <th className="px-4 py-3">{t('admin.audit.colWhen')}</th>
                  <th className="px-4 py-3">{t('admin.audit.colAction')}</th>
                  <th className="px-4 py-3">{t('admin.audit.colEntity')}</th>
                  <th className="px-4 py-3">{t('admin.audit.colUser')}</th>
                  <th className="px-4 py-3">{t('admin.audit.colDetails')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[#9CA3AF]">
                      {t('admin.audit.empty')}
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
