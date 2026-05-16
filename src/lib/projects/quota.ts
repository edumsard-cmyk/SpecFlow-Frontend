import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'
import {
  FREE_PROJECT_LIMIT,
  ProjectLimitError,
  type ProjectQuota,
} from '@/lib/projects/quota-constants'

export {
  FREE_PROJECT_LIMIT,
  PROJECT_LIMIT_REACHED_CODE,
  ProjectLimitError,
  type ProjectQuota,
} from '@/lib/projects/quota-constants'

type ProfileRole = Database['public']['Tables']['profiles']['Row']['role']

export async function getProjectQuota(): Promise<ProjectQuota | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, company_id')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  if (profile.role === 'admin') {
    return {
      limit: FREE_PROJECT_LIMIT,
      used: 0,
      remaining: Infinity,
      canCreate: true,
      isUnlimited: true,
    }
  }

  if (!profile.company_id) {
    return {
      limit: FREE_PROJECT_LIMIT,
      used: 0,
      remaining: 0,
      canCreate: false,
      isUnlimited: false,
    }
  }

  const used = await countCompanyProjects(profile.company_id)
  const remaining = Math.max(0, FREE_PROJECT_LIMIT - used)

  return {
    limit: FREE_PROJECT_LIMIT,
    used,
    remaining,
    canCreate: used < FREE_PROJECT_LIMIT,
    isUnlimited: false,
  }
}

async function countCompanyProjects(companyId: string): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)

  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function assertCanCreateProject(role?: ProfileRole, companyId?: string | null): Promise<void> {
  if (role === 'admin') return
  if (!companyId) {
    throw new Error('Usuário sem empresa vinculada.')
  }

  const used = await countCompanyProjects(companyId)
  if (used >= FREE_PROJECT_LIMIT) {
    throw new ProjectLimitError(used, FREE_PROJECT_LIMIT)
  }
}
