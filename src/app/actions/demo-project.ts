'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  DEMO_BRIEFING,
  DEMO_MANUAL,
  DEMO_PROJECT_DESCRIPTION,
  DEMO_PROJECT_MARKER,
  DEMO_PROJECT_NAME,
  DEMO_REFINEMENT_AI,
  DEMO_STORIES,
} from '@/lib/onboarding/demo-project'
import { createProject, getProjects } from '@/lib/data/projects'
import { saveBriefing } from '@/lib/data/briefings'
import { saveMessage } from '@/lib/data/refinement'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/data/audit'
import {
  getProjectQuota,
  ProjectLimitError,
  PROJECT_LIMIT_REACHED_CODE,
} from '@/lib/projects/quota'

export async function createDemoProjectAction(): Promise<{
  projectId?: string
  error?: string
  code?: string
}> {
  try {
    const existing = (await getProjects()).find(p =>
      p.description?.includes(DEMO_PROJECT_MARKER)
    )
    if (existing) {
      return { projectId: existing.id }
    }

    const quota = await getProjectQuota()
    if (quota && !quota.isUnlimited && !quota.canCreate) {
      return {
        error: `Limite de ${quota.limit} projetos por empresa atingido.`,
        code: PROJECT_LIMIT_REACHED_CODE,
      }
    }

    const project = await createProject({
      name: DEMO_PROJECT_NAME,
      description: `${DEMO_PROJECT_DESCRIPTION} ${DEMO_PROJECT_MARKER}`,
      status: 'specification',
      progress: 35,
    })

    await saveBriefing({
      project_id: project.id,
      input_type: 'text',
      content: DEMO_BRIEFING,
    })

    const supabase = await createClient()
    const { error: storiesError } = await supabase.from('user_stories').insert(
      DEMO_STORIES.map(s => ({
        project_id: project.id,
        code: s.code,
        title: s.title,
        description: s.description,
        acceptance_criteria: s.criteria,
      }))
    )
    if (storiesError) throw new Error(storiesError.message)

    await saveDocumentForDemo(project.id, JSON.stringify(DEMO_MANUAL))

    await saveMessage(project.id, 'ai', DEMO_REFINEMENT_AI)

    await logAudit({
      action: 'project.demo.create',
      entityType: 'project',
      entityId: project.id,
      companyId: project.company_id,
      metadata: { demo: true },
    })

    revalidatePath('/dashboard')
    revalidatePath('/projetos')
    return { projectId: project.id }
  } catch (err) {
    if (err instanceof ProjectLimitError) {
      return { error: err.message, code: PROJECT_LIMIT_REACHED_CODE }
    }
    return {
      error: err instanceof Error ? err.message : 'Erro ao criar projeto de exemplo.',
    }
  }
}

async function saveDocumentForDemo(projectId: string, content: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('documents').insert({
    project_id: projectId,
    type: 'manual',
    content,
    version: 1,
  })
  if (error) throw new Error(error.message)
}

/** Cria demo e redireciona para o projeto (uso em formulários). */
export async function createDemoProjectAndRedirectAction(): Promise<never> {
  const result = await createDemoProjectAction()
  if (result.projectId) {
    redirect(`/projetos/${result.projectId}`)
  }
  redirect(`/projetos?demo_error=${encodeURIComponent(result.error ?? 'Erro')}`)
}
