import type { User } from '@supabase/supabase-js'

/** Utilizador ainda não confirmou o e-mail (Supabase Auth). */
export function isEmailConfirmed(user: User | null | undefined): boolean {
  if (!user) return false
  return Boolean(user.email_confirmed_at)
}

export function needsEmailConfirmation(user: User | null | undefined): boolean {
  return Boolean(user && !isEmailConfirmed(user))
}

export const AUTH_ERROR_EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED'
