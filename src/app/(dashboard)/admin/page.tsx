import AdminDashboardClient from '@/components/admin/AdminDashboardClient'
import { getPlatformStats } from '@/lib/data/admin'

export default async function AdminPage() {
  const stats = await getPlatformStats()
  return <AdminDashboardClient stats={stats} />
}
