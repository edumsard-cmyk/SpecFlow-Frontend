'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const companyName = formData.get('company') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Criar usuário
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Erro ao criar usuário.' }
  }

  // 2. Criar empresa e atualizar perfil usando service role (bypassa RLS)
  const admin = createAdminClient()
  const slug = companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const { data: company, error: companyError } = await admin
    .from('companies')
    .insert({ name: companyName, slug: `${slug}-${Date.now()}` })
    .select('id')
    .single()

  if (companyError) {
    return { error: 'Erro ao criar empresa.' }
  }

  // 3. Vincular empresa ao perfil e promover para role 'company'
  const { error: profileError } = await admin
    .from('profiles')
    .update({ company_id: company.id, role: 'company' })
    .eq('id', authData.user.id)

  if (profileError) {
    return { error: 'Erro ao configurar perfil.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordResetForCurrentUser(): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'Sessão inválida.' }

  const vercelUrl = process.env.VERCEL_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${siteUrl}/reset-password`,
  })

  if (error) return { error: error.message }
  return { ok: true }
}
