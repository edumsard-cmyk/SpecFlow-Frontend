import ProjetosClient from '@/components/projects/ProjetosClient'
import { getProjects } from '@/lib/data/projects'
import { getProjectQuota } from '@/lib/projects/quota'

export default async function ProjetosPage() {
  const [projects, quota] = await Promise.all([getProjects(), getProjectQuota()])
  return <ProjetosClient projects={projects} projectQuota={quota} />
}
