import ProjetosClient from '@/components/projects/ProjetosClient'
import { getOnboardingProgress } from '@/lib/data/onboarding'
import { getProjects } from '@/lib/data/projects'
import { getProjectQuota } from '@/lib/projects/quota'

export default async function ProjetosPage() {
  const [projects, quota, progress] = await Promise.all([
    getProjects(),
    getProjectQuota(),
    getOnboardingProgress(),
  ])
  return (
    <ProjetosClient
      projects={projects}
      projectQuota={quota}
      existingDemoProjectId={progress.existingDemoProjectId}
    />
  )
}
