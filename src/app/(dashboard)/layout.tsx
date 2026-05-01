import DashboardShell from '@/components/layout/DashboardShell'
import { I18nProvider } from '@/components/i18n/I18nProvider'
import { getProfile } from '@/lib/data/profile'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  return (
    <I18nProvider>
      <DashboardShell profile={profile}>{children}</DashboardShell>
    </I18nProvider>
  )
}
