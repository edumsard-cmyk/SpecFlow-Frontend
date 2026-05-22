import { getProjectQuota } from '@/lib/projects/quota'
import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'
import { getProfile } from '@/lib/data/profile'

type Profile = Database['public']['Tables']['profiles']['Row']
type Company = Database['public']['Tables']['companies']['Row']

export type TeamMemberRow = {
  id: string
  name: string
  email: string
  role: Profile['role']
  created_at: string
  isYou: boolean
}

export type SettingsPageData = {
  profile: Profile
  company: Company | null
  quota: Awaited<ReturnType<typeof getProjectQuota>>
  teamMembers: TeamMemberRow[]
  projectCount: number
  supportEmail: string | null
}

export async function getSettingsPageData(): Promise<SettingsPageData | null> {
  const profile = await getProfile()
  if (!profile) return null

  const supabase = await createClient()
  const quota = await getProjectQuota()

  let company: Company | null = null
  let projectCount = 0
  let teamMembers: TeamMemberRow[] = []

  if (profile.company_id) {
    const [{ data: co }, { count: projects }] = await Promise.all([
      supabase.from('companies').select('*').eq('id', profile.company_id).single(),
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', profile.company_id),
    ])
    company = co ?? null
    projectCount = projects ?? 0

    const { data: members } = await supabase
      .from('profiles')
      .select('id, name, email, role, created_at')
      .eq('company_id', profile.company_id)
      .order('created_at', { ascending: true })

    teamMembers = (members ?? []).map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      created_at: m.created_at,
      isYou: m.id === profile.id,
    }))
  }

  return {
    profile,
    company,
    quota,
    teamMembers,
    projectCount,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || null,
  }
}
