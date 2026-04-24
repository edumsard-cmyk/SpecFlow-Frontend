'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { type Database } from '@/lib/supabase/types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

export async function createCompanyAction(name: string): Promise<{ error?: string }> {
  if (!name.trim()) return { error: 'Nome obrigatório.' }

  const admin = createAdminClient()
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { error } = await admin
    .from('companies')
    .insert({ name: name.trim(), slug: `${slug}-${Date.now()}` })

  if (error) return { error: 'Erro ao criar empresa.' }

  revalidatePath('/admin/empresas')
  return {}
}

export async function updateCompanyNameAction(id: string, name: string): Promise<{ error?: string }> {
  if (!name.trim()) return { error: 'Nome obrigatório.' }

  const admin = createAdminClient()
  const { error } = await admin.from('companies').update({ name: name.trim() }).eq('id', id)

  if (error) return { error: 'Erro ao atualizar empresa.' }

  revalidatePath('/admin/empresas')
  revalidatePath(`/admin/empresas/${id}`)
  return {}
}

export async function updateUserRoleAction(userId: string, role: UserRole): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({ role }).eq('id', userId)

  if (error) return { error: 'Erro ao atualizar perfil.' }

  revalidatePath('/admin/usuarios')
  revalidatePath('/admin/empresas')
  return {}
}

export async function removeUserFromCompanyAction(userId: string, companyId: string): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({ company_id: null }).eq('id', userId)

  if (error) return { error: 'Erro ao remover usuário.' }

  revalidatePath(`/admin/empresas/${companyId}`)
  revalidatePath('/admin/usuarios')
  return {}
}
