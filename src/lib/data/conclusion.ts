import { createClient } from '@/lib/supabase/server'
import type { ProjectConclusion } from '@/types'
import { parseProjectConclusion } from '@/lib/conclusion/parse'

/** Tipo `spec` na tabela documents — usado só para persistir a conclusão (não é especificação). */
const CONCLUSION_DOCUMENT_TYPE = 'spec' as const

export async function getProjectConclusion(
  projectId: string
): Promise<ProjectConclusion | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('documents')
    .select('content')
    .eq('project_id', projectId)
    .eq('type', CONCLUSION_DOCUMENT_TYPE)
    .maybeSingle()

  if (error || !data?.content?.trim()) return null

  try {
    return parseProjectConclusion(JSON.parse(data.content))
  } catch {
    return null
  }
}

export async function saveProjectConclusion(
  projectId: string,
  conclusion: ProjectConclusion
): Promise<void> {
  const supabase = await createClient()
  const content = JSON.stringify(conclusion)

  const { data: existing } = await supabase
    .from('documents')
    .select('id, version')
    .eq('project_id', projectId)
    .eq('type', CONCLUSION_DOCUMENT_TYPE)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('documents')
      .update({ content, version: existing.version + 1 })
      .eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('documents').insert({
      project_id: projectId,
      type: CONCLUSION_DOCUMENT_TYPE,
      content,
      version: 1,
    })
    if (error) throw new Error(error.message)
  }
}
