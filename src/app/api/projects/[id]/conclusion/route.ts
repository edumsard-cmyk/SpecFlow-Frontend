import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getBriefing } from '@/lib/data/briefings'
import { getProject, updateProjectStatus } from '@/lib/data/projects'
import { saveProjectConclusion } from '@/lib/data/conclusion'
import { generateProjectConclusion } from '@/lib/refinement/generate-conclusion'
import { createClient } from '@/lib/supabase/server'
import { consumeAiRateLimit } from '@/lib/api/ai-rate-limit'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const rl = consumeAiRateLimit(`conclusion:${user.id}`, 20, 60_000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Muitas requisições. Aguarde um instante.' },
        { status: 429 }
      )
    }

    const project = await getProject(projectId)
    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })
    }

    const briefingRow = await getBriefing(projectId)
    if (!briefingRow?.content?.trim()) {
      return NextResponse.json({ error: 'Briefing não encontrado.' }, { status: 404 })
    }

    const { data: messages, error: msgErr } = await supabase
      .from('refinement_messages')
      .select('role, content')
      .eq('project_id', projectId)
      .order('created_at')

    if (msgErr) {
      return NextResponse.json({ error: msgErr.message }, { status: 500 })
    }

    const aiMessages = (messages ?? []).filter(m => m.role === 'ai' && m.content?.trim())
    if (aiMessages.length === 0) {
      return NextResponse.json(
        { error: 'Inicie o refinamento antes de gerar a conclusão.' },
        { status: 400 }
      )
    }

    const transcript = (messages ?? [])
      .map(m => `${m.role === 'user' ? 'Cliente' : 'IA'}: ${m.content.trim()}`)
      .join('\n\n')

    const conclusion = await generateProjectConclusion({
      briefing: briefingRow.content.trim(),
      refinementTranscript: transcript,
      projectName: project.name,
    })

    await saveProjectConclusion(projectId, conclusion)
    await updateProjectStatus(projectId, 'refinement', 90)

    revalidatePath(`/projetos/${projectId}`)

    return NextResponse.json({ conclusion })
  } catch (error) {
    console.error('conclusion route:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao gerar conclusão.' },
      { status: 500 }
    )
  }
}
