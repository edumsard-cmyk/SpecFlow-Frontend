'use server'

import { revalidatePath } from 'next/cache'
import { createProject, updateProjectStatus } from '@/lib/data/projects'
import { saveBriefing } from '@/lib/data/briefings'
import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type ProjectStatus = Database['public']['Tables']['projects']['Row']['status']

interface CreateProjectPayload {
  name: string
  description: string
  inputType: 'text' | 'audio' | 'document' | 'form'
  briefingContent: string
}

export async function createProjectAction(payload: CreateProjectPayload): Promise<{ projectId?: string; error?: string }> {
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

    revalidatePath('/projetos')
    return { projectId: project.id }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao criar projeto.' }
  }
}

export async function updateProjectStatusAction(
  projectId: string,
  status: ProjectStatus
): Promise<{ error?: string }> {
  const STATUS_PROGRESS: Record<ProjectStatus, number> = {
    briefing: 10,
    refinement: 25,
    specification: 45,
    documentation: 65,
    manual: 85,
    done: 100,
  }
  try {
    await updateProjectStatus(projectId, status, STATUS_PROGRESS[status])
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

    revalidatePath(`/projetos/${projectId}`)
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao salvar especificação.' }
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

    revalidatePath(`/projetos/${projectId}`)
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao salvar documento.' }
  }
}
