import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

export async function getProjects(): Promise<ProjectRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createProject(
  payload: Omit<ProjectInsert, 'created_by' | 'company_id'>
): Promise<ProjectRow> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, company_id')
    .eq('id', (await supabase.auth.getUser()).data.user!.id)
    .single()

  if (!profile?.company_id) throw new Error('Usuário sem empresa vinculada.')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...payload,
      created_by: profile.id,
      company_id: profile.company_id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProjectStatus(
  id: string,
  status: ProjectRow['status'],
  progress: number
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('projects')
    .update({ status, progress })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
