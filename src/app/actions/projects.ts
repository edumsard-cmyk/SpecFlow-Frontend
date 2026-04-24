'use server'

import { revalidatePath } from 'next/cache'
import { createProject } from '@/lib/data/projects'
import { saveBriefing } from '@/lib/data/briefings'

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
