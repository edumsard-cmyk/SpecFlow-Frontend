'use client'

import Link from 'next/link'
import LocalizedHeader from '@/components/layout/LocalizedHeader'
import Card from '@/components/ui/Card'
import { useI18n } from '@/components/i18n/I18nProvider'
import { formatAdminMonthChange } from '@/lib/i18n/admin-month-change'
import { intlLocaleTag } from '@/lib/i18n/locale-format'
import type { PlatformStats } from '@/lib/data/admin'

function formatCount(n: number, locale: ReturnType<typeof useI18n>['locale']) {
  return new Intl.NumberFormat(intlLocaleTag(locale)).format(n)
}

export default function AdminDashboardClient({ stats }: { stats: PlatformStats | null }) {
  const { t, locale } = useI18n()

  const changes = stats
    ? {
        companies: formatAdminMonthChange(t, stats.companiesThisMonth, stats.companiesPrevMonth),
        users: formatAdminMonthChange(t, stats.usersThisMonth, stats.usersPrevMonth),
        projects: formatAdminMonthChange(t, stats.projectsThisMonth, stats.projectsPrevMonth),
        stories: formatAdminMonthChange(t, stats.storiesThisMonth, stats.storiesPrevMonth),
      }
    : null

  const cards = stats
    ? [
        { labelKey: 'admin.stat.companies', value: formatCount(stats.companies, locale), icon: '🏢', href: '/admin/empresas', change: changes!.companies },
        { labelKey: 'admin.stat.users', value: formatCount(stats.users, locale), icon: '👥', href: '/admin/usuarios', change: changes!.users },
        { labelKey: 'admin.stat.projects', value: formatCount(stats.projects, locale), icon: '📁', href: '/projetos', change: changes!.projects },
        { labelKey: 'admin.stat.stories', value: formatCount(stats.stories, locale), icon: '✨', href: '/admin/auditoria', change: changes!.stories },
      ]
    : [
        { labelKey: 'admin.stat.companies', value: '—', icon: '🏢', href: '/admin/empresas', change: t('admin.statChange.noData') },
        { labelKey: 'admin.stat.users', value: '—', icon: '👥', href: '/admin/usuarios', change: t('admin.statChange.noData') },
        { labelKey: 'admin.stat.projects', value: '—', icon: '📁', href: '/projetos', change: t('admin.statChange.noData') },
        { labelKey: 'admin.stat.stories', value: '—', icon: '✨', href: '/admin/auditoria', change: t('admin.statChange.noData') },
      ]

  return (
    <div className="flex flex-col flex-1">
      <LocalizedHeader titleKey="admin.dashboard.title" subtitleKey="admin.dashboard.subtitle" />

      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map(stat => (
            <Link key={stat.labelKey} href={stat.href}>
              <Card hover padding="md">
                <div className="text-2xl mb-3">{stat.icon}</div>
                <p className="text-3xl font-bold text-[#111827]">{stat.value}</p>
                <p className="text-sm text-[#6B7280] mt-1">{t(stat.labelKey)}</p>
                <p className="text-xs text-[#10B981] mt-1">{stat.change}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/empresas">
            <Card hover padding="md" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#111827]">{t('admin.card.companiesTitle')}</p>
                <p className="text-sm text-[#6B7280]">{t('admin.card.companiesDesc')}</p>
              </div>
              <svg className="w-4 h-4 text-[#D1D5DB] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Card>
          </Link>

          <Link href="/admin/usuarios">
            <Card hover padding="md" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#111827]">{t('admin.card.usersTitle')}</p>
                <p className="text-sm text-[#6B7280]">{t('admin.card.usersDesc')}</p>
              </div>
              <svg className="w-4 h-4 text-[#D1D5DB] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
