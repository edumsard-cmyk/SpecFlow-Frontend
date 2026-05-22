'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  AUTH_ERROR_EMAIL_NOT_CONFIRMED,
  isEmailConfirmed,
} from '@/lib/auth/email-confirmation'
import { sendSignupConfirmationEmail } from '@/lib/auth/send-confirmation-email'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { authCallbackUrl } from '@/lib/site-url'

const SUPABASE_CONFIRM_DISABLED =
  'A confirmação por e-mail está desativada no Supabase. Em Authentication → Providers → Email, ative "Confirm email". Veja supabase/SETUP.md.'

export async function login(
  formData: FormData
): Promise<{ error?: string } | void> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  if (data.user && !isEmailConfirmed(data.user)) {
    await supabase.auth.signOut()
    return { error: AUTH_ERROR_EMAIL_NOT_CONFIRMED }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(
  formData: FormData
): Promise<{ error: string } | { needsEmailConfirmation: true; email: string }> {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const companyName = formData.get('company') as string
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string

  // 1. Criar usuário (exige "Confirm email" ativo no Supabase para enviar o e-mail)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: authCallbackUrl('/confirmacao-email'),
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

  // Nunca manter sessão após cadastro — evita entrar sem confirmar o e-mail
  if (authData.session) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')

  if (isEmailConfirmed(authData.user)) {
    return { error: SUPABASE_CONFIRM_DISABLED }
  }

  const mail = await sendSignupConfirmationEmail(email, password)
  if (!mail.ok) {
    return {
      error: `${mail.error} Verifique spam e use "Reenviar" em alguns minutos.`,
    }
  }

  return { needsEmailConfirmation: true, email }
}

/** Reenvia o e-mail de confirmação de cadastro (Supabase Auth). */
export async function resendSignupConfirmationEmail(
  email: string
): Promise<{ error?: string; ok?: boolean }> {
  const trimmed = email.trim()
  if (!trimmed) return { error: 'Informe o e-mail.' }

  const mail = await sendSignupConfirmationEmail(trimmed)
  if (!mail.ok) return { error: mail.error }
  return { ok: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordResetForEmail(
  email: string
): Promise<{ error?: string; ok?: boolean }> {
  const trimmed = email.trim()
  if (!trimmed) return { error: 'Informe o e-mail.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo: authCallbackUrl('/reset-password'),
  })

  if (error) return { error: error.message }
  return { ok: true }
}

export async function requestPasswordResetForCurrentUser(): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'Sessão inválida.' }

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: authCallbackUrl('/reset-password'),
  })

  if (error) return { error: error.message }
  return { ok: true }
}
