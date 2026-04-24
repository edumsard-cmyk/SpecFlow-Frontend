import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/data/projects'
import { getBriefing } from '@/lib/data/briefings'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, briefing] = await Promise.all([getProject(id), getBriefing(id)])

  if (!project) return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })

  return NextResponse.json({ project, briefing })
}
