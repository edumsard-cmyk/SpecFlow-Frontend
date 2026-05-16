import DashboardClient from '@/components/dashboard/DashboardClient'
import { getProjects } from '@/lib/data/projects'

export default async function DashboardPage() {
  const projects = await getProjects()
  return <DashboardClient projects={projects} />
}
