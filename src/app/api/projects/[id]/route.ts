import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/data/projects'
import { getBriefing } from '@/lib/data/briefings'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [project, briefing, { data: stories }, { data: documents }, { data: refinementMessages }] =
    await Promise.all([
      getProject(id),
      getBriefing(id),
      supabase.from('user_stories').select('*').eq('project_id', id).order('created_at'),
      supabase.from('documents').select('*').eq('project_id', id),
      supabase.from('refinement_messages').select('*').eq('project_id', id).order('created_at'),
    ])

  if (!project) return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })

  return NextResponse.json({
    project,
    briefing,
    stories: stories ?? [],
    documents: documents ?? [],
    refinementMessages: refinementMessages ?? [],
  })
}
