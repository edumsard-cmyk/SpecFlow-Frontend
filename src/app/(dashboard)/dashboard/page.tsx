import DashboardClient from '@/components/dashboard/DashboardClient'
import { getOnboardingProgress } from '@/lib/data/onboarding'
import { getProjects } from '@/lib/data/projects'

export default async function DashboardPage() {
  const [projects, progress] = await Promise.all([
    getProjects(),
    getOnboardingProgress(),
  ])
  return (
    <DashboardClient
      projects={projects}
      onboardingProgress={progress}
    />
  )
}
