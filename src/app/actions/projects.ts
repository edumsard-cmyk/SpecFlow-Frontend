'use server'

import { revalidatePath } from 'next/cache'
import { createProject, updateProjectStatus, getProject } from '@/lib/data/projects'
import { toDatabaseStatus } from '@/lib/projects/workflow-status'
import {
  getProjectQuota,
  ProjectLimitError,
  PROJECT_LIMIT_REACHED_CODE,
  type ProjectQuota,
} from '@/lib/projects/quota'

export async function getProjectQuotaAction(): Promise<ProjectQuota | null> {
  return getProjectQuota()
}
import { saveBriefing, updateBriefingContent } from '@/lib/data/briefings'
import { logAudit } from '@/lib/data/audit'
import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type ProjectStatus = Database['public']['Tables']['projects']['Row']['status']

interface CreateProjectPayload {
  name: string
  description: string
  inputType: 'text' | 'audio' | 'document' | 'form' | 'video'
  briefingContent: string
}

export async function createProjectAction(
  payload: CreateProjectPayload
): Promise<{ projectId?: string; error?: string; code?: string }> {
  try {
    const project = await createProject({
      name: payload.name,
      description: payload.description || null,
      status: 'briefing',
      progress: 0,
    })

    await saveBriefing({
      project_id: project.id,
      input_type: payload.inputType,
      content: payload.briefingContent,
    })

    await logAudit({
      action: 'project.create',
      entityType: 'project',
      entityId: project.id,
      companyId: project.company_id,
      metadata: { name: project.name },
    })

    revalidatePath('/projetos')
    return { projectId: project.id }
  } catch (err) {
    if (err instanceof ProjectLimitError) {
      return {
        error: err.message,
        code: PROJECT_LIMIT_REACHED_CODE,
      }
    }
    return { error: err instanceof Error ? err.message : 'Erro ao criar projeto.' }
  }
}

export async function saveBriefingContentAction(
  projectId: string,
  content: string
): Promise<{ error?: string }> {
  const trimmed = content.trim()
  if (trimmed.length < 15) {
    return { error: 'Briefing muito curto — use pelo menos 15 caracteres para as próximas etapas ficarem úteis.' }
  }

  try {
    const proj = await getProject(projectId)
    if (!proj) return { error: 'Projeto não encontrado.' }

    await updateBriefingContent(projectId, trimmed)

    await logAudit({
      action: 'briefing.save',
      entityType: 'project',
      entityId: projectId,
      companyId: proj.company_id,
      metadata: { length: trimmed.length },
    })

    revalidatePath(`/projetos/${projectId}`)
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao guardar briefing.' }
  }
}

export async function updateProjectStatusAction(
  projectId: string,
  status: ProjectStatus
): Promise<{ error?: string }> {
  const STATUS_PROGRESS: Record<ProjectStatus, number> = {
    briefing: 10,
    specification: 35,
    documentation: 55,
    manual: 55,
    refinement: 75,
    conclusion: 90,
    done: 100,
  }
  try {
    const proj = await getProject(projectId)
    await updateProjectStatus(
      projectId,
      toDatabaseStatus(status),
      STATUS_PROGRESS[status]
    )
    await logAudit({
      action: 'project.status',
      entityType: 'project',
      entityId: projectId,
      companyId: proj?.company_id ?? null,
      metadata: { status },
    })
    revalidatePath(`/projetos/${projectId}`)
    revalidatePath('/projetos')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao atualizar status.' }
  }
}

export interface StoryPayload {
  id?: string
  code: string
  title: string
  description: string
  criteria: string[]
}

export async function saveUserStoriesAction(
  projectId: string,
  stories: StoryPayload[]
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()

    // Remove all existing stories for this project and re-insert
    await supabase.from('user_stories').delete().eq('project_id', projectId)

    if (stories.length > 0) {
      const { error } = await supabase.from('user_stories').insert(
        stories.map(s => ({
          project_id: projectId,
          code: s.code,
          title: s.title,
          description: s.description,
          acceptance_criteria: s.criteria,
        }))
      )
      if (error) throw new Error(error.message)
    }

    const proj = await getProject(projectId)
    await logAudit({
      action: 'project.stories.save',
      entityType: 'project',
      entityId: projectId,
      companyId: proj?.company_id ?? null,
      metadata: { count: stories.length },
    })

    revalidatePath(`/projetos/${projectId}`)
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao salvar especificação.' }
  }
}

export async function deleteProjectAction(projectId: string): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const proj = await getProject(projectId)
    await logAudit({
      action: 'project.delete',
      entityType: 'project',
      entityId: projectId,
      companyId: proj?.company_id ?? null,
      metadata: { name: proj?.name },
    })

    await Promise.all([
      supabase.from('user_stories').delete().eq('project_id', projectId),
      supabase.from('documents').delete().eq('project_id', projectId),
      supabase.from('briefings').delete().eq('project_id', projectId),
    ])

    const { error } = await supabase.from('projects').delete().eq('id', projectId)
    if (error) throw new Error(error.message)

    revalidatePath('/projetos')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao apagar projeto.' }
  }
}

export async function saveDocumentAction(
  projectId: string,
  type: 'doc' | 'manual' | 'spec',
  content: string
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('documents')
      .select('id, version')
      .eq('project_id', projectId)
      .eq('type', type)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('documents')
        .update({ content, version: existing.version + 1 })
        .eq('id', existing.id)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from('documents')
        .insert({ project_id: projectId, type, content, version: 1 })
      if (error) throw new Error(error.message)
    }

    const proj = await getProject(projectId)
    await logAudit({
      action: 'document.save',
      entityType: 'project',
      entityId: projectId,
      companyId: proj?.company_id ?? null,
      metadata: { docType: type },
    })

    revalidatePath(`/projetos/${projectId}`)
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao salvar documento.' }
  }
}
