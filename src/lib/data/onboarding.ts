import { createClient } from '@/lib/supabase/server'
import { getProjects } from '@/lib/data/projects'
import { getProjectConclusion } from '@/lib/data/conclusion'
import { DEMO_PROJECT_MARKER } from '@/lib/onboarding/demo-project'

export type OnboardingProgress = {
  hasProject: boolean
  hasStories: boolean
  hasRefinement: boolean
  hasDoneOrConclusion: boolean
  projectIdForLinks: string | null
  existingDemoProjectId: string | null
}

export async function getOnboardingProgress(): Promise<OnboardingProgress> {
  const projects = await getProjects()
  const demo = projects.find(p => p.description?.includes(DEMO_PROJECT_MARKER))
  const projectIdForLinks = projects[0]?.id ?? null

  if (projects.length === 0) {
    return {
      hasProject: false,
      hasStories: false,
      hasRefinement: false,
      hasDoneOrConclusion: false,
      projectIdForLinks: null,
      existingDemoProjectId: null,
    }
  }

  const supabase = await createClient()
  const ids = projects.map(p => p.id)

  const [{ count: storyCount }, { count: refinementCount }] = await Promise.all([
    supabase
      .from('user_stories')
      .select('id', { count: 'exact', head: true })
      .in('project_id', ids),
    supabase
      .from('refinement_messages')
      .select('id', { count: 'exact', head: true })
      .in('project_id', ids),
  ])

  let hasDoneOrConclusion = projects.some(p => p.status === 'done')
  if (!hasDoneOrConclusion) {
    for (const id of ids) {
      const conclusion = await getProjectConclusion(id)
      if (conclusion?.summary) {
        hasDoneOrConclusion = true
        break
      }
    }
  }

  return {
    hasProject: true,
    hasStories: (storyCount ?? 0) > 0,
    hasRefinement: (refinementCount ?? 0) > 0,
    hasDoneOrConclusion,
    projectIdForLinks,
    existingDemoProjectId: demo?.id ?? null,
  }
}
