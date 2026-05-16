import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type BriefingInsert = Database['public']['Tables']['briefings']['Insert']
type BriefingRow = Database['public']['Tables']['briefings']['Row']

export async function getBriefing(projectId: string): Promise<BriefingRow | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('briefings')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data ?? null
}

export async function updateBriefingContent(projectId: string, content: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('briefings').update({ content }).eq('project_id', projectId)

  if (error) throw new Error(error.message)
}

export async function saveBriefing(payload: BriefingInsert): Promise<BriefingRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('briefings')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
