'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/data/profile'

/** Convite por e-mail para usuário `user` na mesma empresa do gestor (role `company`). */
export async function inviteTeamMemberAction(
  name: string,
  email: string
): Promise<{ error?: string; ok?: boolean }> {
  const profile = await getProfile()
  if (!profile) return { error: 'Não autenticado.' }
  if (profile.role !== 'company' || !profile.company_id) {
    return { error: 'Apenas gestores de empresa podem convidar membros da equipe.' }
  }

  const n = name.trim()
  const em = email.trim().toLowerCase()
  if (!n) return { error: 'Nome obrigatório.' }
  if (!em) return { error: 'E-mail obrigatório.' }

  const vercelUrl = process.env.VERCEL_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.inviteUserByEmail(em, {
    data: { name: n },
    redirectTo: `${siteUrl}/login`,
  })

  if (error) return { error: error.message }
  if (!data.user) return { error: 'Não foi possível enviar o convite.' }

  const { error: profileError } = await admin
    .from('profiles')
    .update({
      company_id: profile.company_id,
      name: n,
      role: 'user',
    })
    .eq('id', data.user.id)

  if (profileError) return { error: 'Convite enviado, mas falhou ao vincular o perfil à empresa.' }

  return { ok: true }
}
