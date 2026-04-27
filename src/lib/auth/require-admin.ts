import { getProfile } from '@/lib/data/profile'

/** Retorna erro se o usuário atual não for administrador. */
export async function requireAdmin(): Promise<{ error: string } | undefined> {
  const profile = await getProfile()
  if (!profile) return { error: 'Não autenticado.' }
  if (profile.role !== 'admin') return { error: 'Acesso restrito a administradores.' }
  return undefined
}
