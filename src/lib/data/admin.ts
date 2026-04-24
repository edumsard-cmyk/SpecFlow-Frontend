import { createClient } from '@/lib/supabase/server'

export interface CompanyWithStats {
  id: string
  name: string
  slug: string
  created_at: string
  users: number
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
