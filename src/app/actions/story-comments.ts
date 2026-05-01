'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/data/profile'
import { getProject } from '@/lib/data/projects'
import { logAudit } from '@/lib/data/audit'

export async function addStoryCommentAction(
  projectId: string,
  storyCode: string,
  body: string
): Promise<{
  error?: string
  comment?: {
    id: string
    project_id: string
    story_code: string
    user_id: string
    body: string
    created_at: string
    author_name: string
    is_owner: boolean
  }
}> {
  const text = body.trim()
  if (!text) return { error: 'Comentário vazio.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado.' }

  const profile = await getProfile()
  if (!profile) return { error: 'Perfil não encontrado.' }

  const { data, error } = await supabase
    .from('story_comments')
    .insert({
      project_id: projectId,
      story_code: storyCode.trim(),
      user_id: user.id,
      body: text,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  const proj = await getProject(projectId)
  await logAudit({
    action: 'story.comment',
    entityType: 'project',
    entityId: projectId,
    companyId: proj?.company_id ?? null,
    metadata: { storyCode: storyCode.trim(), commentId: data.id },
  })

  revalidatePath(`/projetos/${projectId}`)

  return {
    comment: {
      ...data,
      author_name: profile.name,
      is_owner: true,
    },
  }
}

export async function deleteStoryCommentAction(
  commentId: string,
  projectId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const proj = await getProject(projectId)
  const { error } = await supabase.from('story_comments').delete().eq('id', commentId)
  if (error) return { error: error.message }

  await logAudit({
    action: 'story.comment.delete',
    entityType: 'project',
    entityId: projectId,
    companyId: proj?.company_id ?? null,
    metadata: { commentId },
  })

  revalidatePath(`/projetos/${projectId}`)
  return {}
}
