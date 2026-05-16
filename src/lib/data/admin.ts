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

export interface PlatformStats {
  companies: number
  users: number
  projects: number
  stories: number
  companiesThisMonth: number
  usersThisMonth: number
  projectsThisMonth: number
  storiesThisMonth: number
  companiesPrevMonth: number
  usersPrevMonth: number
  projectsPrevMonth: number
  storiesPrevMonth: number
}

function startOfMonthUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function formatMonthChange(thisMonth: number, previousMonth: number): string {
  if (thisMonth === 0 && previousMonth === 0) return 'Sem novos este mês'
  if (thisMonth === 0) return 'Nenhum novo este mês'
  if (previousMonth === 0) return `+${thisMonth} este mês`
  const diff = thisMonth - previousMonth
  if (diff > 0) return `+${diff} vs. mês anterior`
  if (diff < 0) return `${diff} vs. mês anterior`
  return `${thisMonth} este mês`
}

/** Totais globais para o painel admin (requer perfil admin via RLS). */
export async function getPlatformStats(): Promise<PlatformStats | null> {
  const supabase = await createClient()

  const now = new Date()
  const thisMonthStart = startOfMonthUTC(now)
  const prevMonthStart = startOfMonthUTC(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  )
  const thisMonthIso = thisMonthStart.toISOString()
  const prevMonthIso = prevMonthStart.toISOString()

  const [
    companies,
    users,
    projects,
    stories,
    companiesThisMonth,
    usersThisMonth,
    projectsThisMonth,
    storiesThisMonth,
    companiesPrevMonth,
    usersPrevMonth,
    projectsPrevMonth,
    storiesPrevMonth,
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('user_stories').select('*', { count: 'exact', head: true }),
    supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonthIso),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonthIso),
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonthIso),
    supabase
      .from('user_stories')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonthIso),
    supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', prevMonthIso)
      .lt('created_at', thisMonthIso),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', prevMonthIso)
      .lt('created_at', thisMonthIso),
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', prevMonthIso)
      .lt('created_at', thisMonthIso),
    supabase
      .from('user_stories')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', prevMonthIso)
      .lt('created_at', thisMonthIso),
  ])

  const firstError =
    companies.error ??
    users.error ??
    projects.error ??
    stories.error ??
    companiesThisMonth.error ??
    usersThisMonth.error ??
    projectsThisMonth.error ??
    storiesThisMonth.error

  if (firstError) return null

  return {
    companies: companies.count ?? 0,
    users: users.count ?? 0,
    projects: projects.count ?? 0,
    stories: stories.count ?? 0,
    companiesThisMonth: companiesThisMonth.count ?? 0,
    usersThisMonth: usersThisMonth.count ?? 0,
    projectsThisMonth: projectsThisMonth.count ?? 0,
    storiesThisMonth: storiesThisMonth.count ?? 0,
    companiesPrevMonth: companiesPrevMonth.count ?? 0,
    usersPrevMonth: usersPrevMonth.count ?? 0,
    projectsPrevMonth: projectsPrevMonth.count ?? 0,
    storiesPrevMonth: storiesPrevMonth.count ?? 0,
  }
}

export function platformStatChangeLabels(stats: PlatformStats) {
  return {
    companies: formatMonthChange(stats.companiesThisMonth, stats.companiesPrevMonth),
    users: formatMonthChange(stats.usersThisMonth, stats.usersPrevMonth),
    projects: formatMonthChange(stats.projectsThisMonth, stats.projectsPrevMonth),
    stories: formatMonthChange(stats.storiesThisMonth, stats.storiesPrevMonth),
  }
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
