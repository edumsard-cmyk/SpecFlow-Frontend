import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

export interface CompanyWithStats {
  id: string
  name: string
  slug: string
  created_at: string
  users: number
  projects: number
}

export interface UserWithStats {
  id: string
  name: string
  email: string
  role: UserRole
  company_id: string | null
  company_name: string | null
  created_at: string
  projects: number
}

export async function getCompaniesWithStats(): Promise<CompanyWithStats[]> {
  const supabase = await createClient()

  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !companies) return []

  const stats = await Promise.all(
    companies.map(async company => {
      const [{ count: users }, { count: projects }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('company_id', company.id),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('company_id', company.id),
      ])
      return { ...company, users: users ?? 0, projects: projects ?? 0 }
    })
  )

  return stats
}

export async function getCompanyById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('companies').select('*').eq('id', id).single()
  return data ?? null
}

export async function getCompanyUsers(companyId: string): Promise<UserWithStats[]> {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: true })

  if (!profiles) return []

  const users = await Promise.all(
    profiles.map(async p => {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', p.id)
      return { ...p, company_name: null, projects: count ?? 0 }
    })
  )

  return users
}

export async function getAllUsersWithStats(): Promise<UserWithStats[]> {
  const supabase = await createClient()

  const [{ data: profiles }, { data: companies }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('companies').select('id, name'),
  ])

  if (!profiles) return []

  const companyMap = new Map((companies ?? []).map(c => [c.id, c.name]))

  const users = await Promise.all(
    profiles.map(async p => {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', p.id)
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role,
        company_id: p.company_id,
        company_name: p.company_id ? (companyMap.get(p.company_id) ?? null) : null,
        created_at: p.created_at,
        projects: count ?? 0,
      }
    })
  )

  return users
}
