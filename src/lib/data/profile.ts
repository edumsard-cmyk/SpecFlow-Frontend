import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data
}

export { getProfileInitials } from '@/lib/utils'
