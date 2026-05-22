import { createBrowserClient } from '@supabase/ssr'
import { type Database } from './types'

export function createClient() {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}
