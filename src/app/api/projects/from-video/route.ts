import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { consumeAiRateLimit } from '@/lib/api/ai-rate-limit'
import { extractAudioFromVideo, videoExtFromMime } from '@/lib/briefing/extract-video-audio'
import { normalizeBriefingFromTranscription, transcribeAudioBuffer } from '@/lib/briefing/transcribe'
import { isUploadFailure, uploadBriefingMedia } from '@/lib/briefing/upload-briefing-media'
import { logAudit } from '@/lib/data/audit'
import { saveBriefing } from '@/lib/data/briefings'
import { createProject } from '@/lib/data/projects'
import { ProjectLimitError, PROJECT_LIMIT_REACHED_CODE } from '@/lib/projects/quota'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 180

const MAX_VIDEO_BYTES = 50 * 1024 * 1024

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

    const rl = consumeAiRateLimit(`video:${user.id}`, 10, 60_000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Muitos vídeos. Aguarde um instante.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const form = await req.formData()
    const nameRaw = form.get('name')
    const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
    const descriptionRaw = form.get('description')
    const video = form.get('video')

    if (!name) {
      return NextResponse.json({ error: 'Nome do projeto é obrigatório.' }, { status: 400 })
    }

    if (!video || !(video instanceof File) || video.size === 0) {
      return NextResponse.json({ error: 'Arquivo de vídeo é obrigatório.' }, { status: 400 })
    }

    if (video.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: 'Vídeo muito grande. Use até 50 MB.' },
        { status: 400 }
      )
    }

    const description =
      typeof descriptionRaw === 'string' && descriptionRaw.trim() ? descriptionRaw.trim() : ''

    const videoBuf = Buffer.from(await video.arrayBuffer())
    const ext = videoExtFromMime(video.type || 'video/webm')
    const videoObjectName = `briefing-video.${ext}`

    const project = await createProject({
      name,
      description: description || null,
      status: 'briefing',
      progress: 0,
    })

    let transcriptionText = ''
    try {
      const { buffer: audioBuf, mimeType, filename } = await extractAudioFromVideo(videoBuf, ext)
      transcriptionText = await transcribeAudioBuffer(audioBuf, filename, mimeType)
    } catch (ffmpegErr) {
      console.warn('ffmpeg extract failed, trying direct whisper:', ffmpegErr)
      try {
        transcriptionText = await transcribeAudioBuffer(
          videoBuf,
          `briefing.${ext}`,
          video.type || `video/${ext}`
        )
      } catch {
        await supabase.from('projects').delete().eq('id', project.id)
        return NextResponse.json(
          {
            error:
              'Não foi possível extrair áudio do vídeo. Tente um arquivo menor ou use briefing em áudio.',
          },
          { status: 422 }
        )
      }
    }

    const uploadResult = await uploadBriefingMedia(
      project.id,
      videoBuf,
      videoObjectName,
      video.type || `video/${ext}`
    )

    const videoStored = !isUploadFailure(uploadResult)
    const videoStorageRef = videoStored ? uploadResult.storageRef : null

    let briefingContent = normalizeBriefingFromTranscription(
      transcriptionText,
      'Briefing por vídeo'
    )

    if (!videoStored) {
      briefingContent += `\n\n[O vídeo não foi guardado no servidor: ${uploadResult.message}]`
    }

    try {
      await saveBriefing({
        project_id: project.id,
        input_type: 'video',
        content: briefingContent,
        document_url: videoStorageRef,
      })
    } catch (saveErr) {
      console.error('saveBriefing video:', saveErr)
      await supabase.from('projects').delete().eq('id', project.id)
      return NextResponse.json({ error: 'Erro ao gravar o briefing no banco.' }, { status: 500 })
    }

    await logAudit({
      action: 'project.create',
      entityType: 'project',
      entityId: project.id,
      companyId: project.company_id,
      metadata: { name: project.name, inputType: 'video', videoStored },
    })

    revalidatePath('/projetos')
    revalidatePath(`/projetos/${project.id}`)

    return NextResponse.json({
      projectId: project.id,
      videoStored,
      warning: videoStored ? undefined : uploadResult.message,
    })
  } catch (error) {
    if (error instanceof ProjectLimitError) {
      return NextResponse.json(
        { error: error.message, code: PROJECT_LIMIT_REACHED_CODE },
        { status: 403 }
      )
    }
    console.error('from-video route:', error)
    const msg = error instanceof Error ? error.message : 'Erro ao criar projeto com vídeo.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
