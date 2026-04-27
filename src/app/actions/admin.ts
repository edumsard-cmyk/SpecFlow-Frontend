'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient, createClient } from '@/lib/supabase/server'
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

export async function createUserAction(payload: {
  name: string
  email: string
  password: string
  role: UserRole
  company_id?: string | null
}): Promise<{ error?: string }> {
  if (!payload.name.trim()) return { error: 'Nome obrigatório.' }
  if (!payload.email.trim()) return { error: 'E-mail obrigatório.' }
  if (payload.password.length < 6) return { error: 'Senha deve ter pelo menos 6 caracteres.' }

  const admin = createAdminClient()

  const { data, error: authError } = await admin.auth.admin.createUser({
    email: payload.email.trim(),
    password: payload.password,
    email_confirm: true,
    user_metadata: { name: payload.name.trim() },
  })

  if (authError) return { error: authError.message }

  const userId = data.user.id

  const { error: profileError } = await admin.from('profiles').upsert({
    id: userId,
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: payload.role,
    company_id: payload.company_id ?? null,
  })

  if (profileError) return { error: 'Usuário criado mas erro ao salvar perfil.' }

  revalidatePath('/admin/usuarios')
  revalidatePath('/admin/empresas')
  return {}
}

export async function resetUserPasswordAction(email: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const vercelUrl = process.env.VERCEL_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  })

  if (error) return { error: 'Erro ao enviar e-mail de redefinição.' }
  return {}
}
