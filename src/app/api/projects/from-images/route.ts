import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { consumeAiRateLimit } from '@/lib/api/ai-rate-limit'
import {
  imageExtFromName,
  imageMimeFromExt,
  serializeGuidedImagesContent,
  type GuidedImageStoredBlock,
} from '@/lib/briefing/guided-images'
import { isUploadFailure, uploadBriefingMedia } from '@/lib/briefing/upload-briefing-media'
import { logAudit } from '@/lib/data/audit'
import { saveBriefing } from '@/lib/data/briefings'
import { createProject } from '@/lib/data/projects'
import { ProjectLimitError, PROJECT_LIMIT_REACHED_CODE } from '@/lib/projects/quota'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 120

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_BLOCKS = 15
const MIN_TEXT_LEN = 3

type PayloadBlock = { text: string }

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const rl = consumeAiRateLimit(`images:${user.id}`, 20, 60_000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Muitos envios. Aguarde um instante.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const form = await req.formData()
    const nameRaw = form.get('name')
    const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
    const descriptionRaw = form.get('description')
    const payloadRaw = form.get('payload')

    if (!name) {
      return NextResponse.json({ error: 'Nome do projeto é obrigatório.' }, { status: 400 })
    }

    if (typeof payloadRaw !== 'string') {
      return NextResponse.json({ error: 'Dados do briefing inválidos.' }, { status: 400 })
    }

    let payloadBlocks: PayloadBlock[]
    try {
      const parsed = JSON.parse(payloadRaw) as { blocks?: PayloadBlock[] }
      payloadBlocks = Array.isArray(parsed.blocks) ? parsed.blocks : []
    } catch {
      return NextResponse.json({ error: 'Dados do briefing inválidos.' }, { status: 400 })
    }

    if (payloadBlocks.length === 0 || payloadBlocks.length > MAX_BLOCKS) {
      return NextResponse.json(
        { error: `Envie entre 1 e ${MAX_BLOCKS} blocos (imagem + texto).` },
        { status: 400 }
      )
    }

    const description =
      typeof descriptionRaw === 'string' && descriptionRaw.trim() ? descriptionRaw.trim() : ''

    const stored: GuidedImageStoredBlock[] = []
    const uploadWarnings: string[] = []

    for (let i = 0; i < payloadBlocks.length; i++) {
      const text = (payloadBlocks[i]?.text ?? '').trim()
      if (text.length < MIN_TEXT_LEN) {
        return NextResponse.json(
          { error: `O texto do bloco ${i + 1} precisa ter pelo menos ${MIN_TEXT_LEN} caracteres.` },
          { status: 400 }
        )
      }

      const file = form.get(`image-${i}`)
      if (!file || !(file instanceof File) || file.size === 0) {
        return NextResponse.json(
          { error: `A imagem do bloco ${i + 1} é obrigatória.` },
          { status: 400 }
        )
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `O bloco ${i + 1} deve ser um arquivo de imagem (JPG, PNG, WebP ou GIF).` },
          { status: 400 }
        )
      }

      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: `A imagem do bloco ${i + 1} é muito grande. Use até 5 MB por imagem.` },
          { status: 400 }
        )
      }
    }

    const project = await createProject({
      name,
      description: description || null,
      status: 'briefing',
      progress: 0,
    })

    for (let i = 0; i < payloadBlocks.length; i++) {
      const text = (payloadBlocks[i]?.text ?? '').trim()
      const file = form.get(`image-${i}`) as File
      const ext = imageExtFromName(file.name)
      const fileName = `briefing-image-${i + 1}.${ext}`
      const buf = Buffer.from(await file.arrayBuffer())
      const uploadResult = await uploadBriefingMedia(
        project.id,
        buf,
        fileName,
        file.type || imageMimeFromExt(ext)
      )

      if (isUploadFailure(uploadResult)) {
        uploadWarnings.push(`bloco ${i + 1}: ${uploadResult.message}`)
        stored.push({ text, fileName, storageRef: '' })
      } else {
        stored.push({ text, fileName, storageRef: uploadResult.storageRef })
      }
    }

    let contentToSave = serializeGuidedImagesContent(stored)
    if (uploadWarnings.length > 0) {
      contentToSave += `\n\n[Algumas imagens não foram guardadas no servidor: ${uploadWarnings.join('; ')}]`
    }

    try {
      await saveBriefing({
        project_id: project.id,
        input_type: 'images',
        content: contentToSave,
      })
    } catch (saveErr) {
      const msg = saveErr instanceof Error ? saveErr.message : ''
      console.error('saveBriefing images:', saveErr)
      await supabase.from('projects').delete().eq('id', project.id)
      if (msg.includes('enum input_type') && msg.includes('images')) {
        return NextResponse.json(
          {
            error:
              'O banco ainda não reconhece o tipo "images". No Supabase → SQL Editor, execute o ficheiro supabase/migrations/010_input_type_images.sql e tente de novo.',
            code: 'INPUT_TYPE_IMAGES_MISSING',
          },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { error: msg ? `Erro ao gravar o briefing: ${msg}` : 'Erro ao gravar o briefing no banco.' },
        { status: 500 }
      )
    }

    await logAudit({
      action: 'project.create',
      entityType: 'project',
      entityId: project.id,
      companyId: project.company_id,
      metadata: { name: project.name, inputType: 'images', blocks: stored.length },
    })

    revalidatePath('/projetos')
    revalidatePath(`/projetos/${project.id}`)

    return NextResponse.json({
      projectId: project.id,
      warning: uploadWarnings.length > 0 ? uploadWarnings.join('; ') : undefined,
    })
  } catch (error) {
    if (error instanceof ProjectLimitError) {
      return NextResponse.json(
        { error: error.message, code: PROJECT_LIMIT_REACHED_CODE },
        { status: 403 }
      )
    }
    console.error('from-images route:', error)
    return NextResponse.json({ error: 'Erro ao criar projeto com imagens.' }, { status: 500 })
  }
}
