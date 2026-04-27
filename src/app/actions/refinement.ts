'use server'

import { revalidatePath } from 'next/cache'
import { saveMessage } from '@/lib/data/refinement'

export async function appendRefinementMessageAction(
  projectId: string,
  role: 'ai' | 'user',
  content: string
): Promise<{ error?: string }> {
  const text = content.trim()
  if (!text) return {}

  try {
    await saveMessage(projectId, role, text)
    revalidatePath(`/projetos/${projectId}`)
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao salvar mensagem.' }
  }
}
