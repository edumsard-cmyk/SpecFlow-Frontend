/**
 * Supabase suporta chaves novas (sb_publishable / sb_secret) e legadas (anon / service_role eyJ...).
 * @see https://supabase.com/docs/guides/api/api-keys
 */

export function getSupabaseAnonOrPublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!key) {
    throw new Error(
      'Defina NEXT_PUBLIC_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local'
    )
  }
  return key
}

/** Chave de servidor com privilégios elevados (upload storage, convites, etc.). */
export function getSupabaseSecretKey(): string | undefined {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    undefined
  )
}

export function hasSupabaseSecretKey(): boolean {
  return !!getSupabaseSecretKey()
}
