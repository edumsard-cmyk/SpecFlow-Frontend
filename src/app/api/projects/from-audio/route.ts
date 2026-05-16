import Groq, { toFile } from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { consumeAiRateLimit } from '@/lib/api/ai-rate-limit'
import { logAudit } from '@/lib/data/audit'
import { saveBriefing } from '@/lib/data/briefings'
import { createProject } from '@/lib/data/projects'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 120

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MAX_AUDIO_BYTES = 25 * 1024 * 1024

const BUCKET = 'briefing-media'

function extFromMime(mime: string): string {
  const m = mime.toLowerCase().split(';')[0]?.trim() ?? ''
  const map: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/mp4': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/ogg': 'ogg',
    'audio/opus': 'opus',
  }
  return map[m] ?? 'webm'
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    if (!process.env.GROQ_API_KEY?.trim()) {
      return NextResponse.json(
        { error: 'Transcrição indisponível: GROQ_API_KEY não configurada.' },
        { status: 503 }
      )
    }

    const rl = consumeAiRateLimit(`transcribe:${user.id}`, 20, 60_000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Muitas transcrições. Aguarde um instante.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const form = await req.formData()
    const nameRaw = form.get('name')
    const descriptionRaw = form.get('description')
    const audio = form.get('audio')

    const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
    if (!name) {
      return NextResponse.json({ error: 'Nome do projeto é obrigatório.' }, { status: 400 })
    }

    if (!audio || !(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: 'Arquivo de áudio é obrigatório.' }, { status: 400 })
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: 'Áudio muito grande. Use até 25 MB.' },
        { status: 400 }
      )
    }

    const description =
      typeof descriptionRaw === 'string' && descriptionRaw.trim()
        ? descriptionRaw.trim()
        : ''

    const project = await createProject({
      name,
      description: description || null,
      status: 'briefing',
      progress: 0,
    })

    const ext = extFromMime(audio.type)
    const objectPath = `${project.id}/briefing.${ext}`
    const audioBuf = Buffer.from(await audio.arrayBuffer())

    let transcriptionText = ''
    try {
      const fileForGroq = await toFile(audioBuf, `briefing.${ext}`, {
        type: audio.type || `audio/${ext}`,
      })

      const transcription = await groq.audio.transcriptions.create({
        file: fileForGroq,
        model: 'whisper-large-v3-turbo',
        language: 'pt',
      })
      transcriptionText = transcription.text?.trim() ?? ''
    } catch (err) {
      console.error('Transcription error:', err)
      await supabase.from('projects').delete().eq('id', project.id)
      return NextResponse.json(
        {
          error:
            'Não foi possível transcrever o áudio. Verifique o arquivo ou tente novamente.',
        },
        { status: 422 }
      )
    }

    const briefingContent =
      transcriptionText.length >= 3
        ? transcriptionText
        : `[Briefing por áudio — transcrição vazia ou inaudível. Descreva a demanda na aba Briefing ou grave novamente.]\n\n${transcriptionText}`.trim()

    let audioPublicUrl: string | null = null
    try {
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, audioBuf, {
          contentType: audio.type || `audio/${ext}`,
          upsert: true,
        })
      if (!upErr) {
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
        audioPublicUrl = pub.publicUrl
      } else {
        console.warn('Briefing audio upload skipped:', upErr.message)
      }
    } catch (e) {
      console.warn('Briefing audio upload failed:', e)
    }

    try {
      await saveBriefing({
        project_id: project.id,
        input_type: 'audio',
        content: briefingContent,
        audio_url: audioPublicUrl,
      })
    } catch (saveErr) {
      console.error('saveBriefing:', saveErr)
      await supabase.storage.from(BUCKET).remove([objectPath]).catch(() => {})
      await supabase.from('projects').delete().eq('id', project.id)
      return NextResponse.json(
        { error: 'Erro ao gravar o briefing no banco.' },
        { status: 500 }
      )
    }

    await logAudit({
      action: 'project.create',
      entityType: 'project',
      entityId: project.id,
      companyId: project.company_id,
      metadata: { name: project.name, inputType: 'audio' },
    })

    revalidatePath('/projetos')
    revalidatePath(`/projetos/${project.id}`)

    return NextResponse.json({ projectId: project.id })
  } catch (error) {
    console.error('from-audio route:', error)
    return NextResponse.json({ error: 'Erro ao criar projeto com áudio.' }, { status: 500 })
  }
}
