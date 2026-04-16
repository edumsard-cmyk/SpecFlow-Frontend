import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type MessageRow = Database['public']['Tables']['refinement_messages']['Row']

export async function getRefinementMessages(projectId: string): Promise<MessageRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('refinement_messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function saveMessage(
  projectId: string,
  role: 'ai' | 'user',
  content: string
): Promise<MessageRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('refinement_messages')
    .insert({ project_id: projectId, role, content })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
