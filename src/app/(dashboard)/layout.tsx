import DashboardShell from '@/components/layout/DashboardShell'
import { getProfile } from '@/lib/data/profile'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  return <DashboardShell profile={profile}>{children}</DashboardShell>
}
