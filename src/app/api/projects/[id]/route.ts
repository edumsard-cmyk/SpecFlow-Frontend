import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/data/projects'
import { getBriefing } from '@/lib/data/briefings'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    project,
    briefing,
    { data: stories },
    { data: documents },
    { data: refinementMessages },
    storyCommentsRes,
  ] = await Promise.all([
    getProject(id),
    getBriefing(id),
    supabase.from('user_stories').select('*').eq('project_id', id).order('created_at'),
    supabase.from('documents').select('*').eq('project_id', id),
    supabase.from('refinement_messages').select('*').eq('project_id', id).order('created_at'),
    supabase.from('story_comments').select('*').eq('project_id', id).order('created_at'),
  ])

  if (!project) return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })

  const { data: { user } } = await supabase.auth.getUser()
  const storyComments = storyCommentsRes.error ? [] : (storyCommentsRes.data ?? [])
  const userIds = [...new Set(storyComments.map(c => c.user_id))]
  const { data: nameRows } =
    userIds.length > 0
      ? await supabase.from('profiles').select('id, name').in('id', userIds)
      : { data: [] as { id: string; name: string }[] }
  const authorById = Object.fromEntries((nameRows ?? []).map(p => [p.id, p.name]))

  const storyCommentsEnriched = storyComments.map(c => ({
    ...c,
    author_name: authorById[c.user_id] ?? 'Usuário',
    is_owner: user?.id === c.user_id,
  }))

  return NextResponse.json({
    project,
    briefing,
    stories: stories ?? [],
    documents: documents ?? [],
    refinementMessages: refinementMessages ?? [],
    storyComments: storyCommentsEnriched,
  })
}
