'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

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
