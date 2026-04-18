import ProjetosClient from '@/components/projects/ProjetosClient'
import { getProjects } from '@/lib/data/projects'

export default async function ProjetosPage() {
  const projects = await getProjects()
  return <ProjetosClient projects={projects} />
}
