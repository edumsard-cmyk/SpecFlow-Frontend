import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { consumeAiRateLimit } from '@/lib/api/ai-rate-limit'
import { documentExtFromName, extractTextFromDocument } from '@/lib/briefing/extract-document'
import { isUploadFailure, uploadBriefingMedia } from '@/lib/briefing/upload-briefing-media'
import { logAudit } from '@/lib/data/audit'
import { saveBriefing } from '@/lib/data/briefings'
import { createProject } from '@/lib/data/projects'
import { ProjectLimitError, PROJECT_LIMIT_REACHED_CODE } from '@/lib/projects/quota'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 120

const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  txt: 'text/plain',
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

    const rl = consumeAiRateLimit(`document:${user.id}`, 15, 60_000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Muitos uploads. Aguarde um instante.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const form = await req.formData()
    const nameRaw = form.get('name')
    const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
    const descriptionRaw = form.get('description')
    const document = form.get('document')

    if (!name) {
      return NextResponse.json({ error: 'Nome do projeto é obrigatório.' }, { status: 400 })
    }

    if (!document || !(document instanceof File) || document.size === 0) {
      return NextResponse.json({ error: 'Documento é obrigatório.' }, { status: 400 })
    }

    if (document.size > MAX_DOCUMENT_BYTES) {
      return NextResponse.json({ error: 'Documento muito grande. Use até 20 MB.' }, { status: 400 })
    }

    const description =
      typeof descriptionRaw === 'string' && descriptionRaw.trim() ? descriptionRaw.trim() : ''

    const buf = Buffer.from(await document.arrayBuffer())
    let briefingContent: string
    try {
      briefingContent = await extractTextFromDocument(buf, document.name, document.type)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Não foi possível ler o documento.' },
        { status: 422 }
      )
    }

    const project = await createProject({
      name,
      description: description || null,
      status: 'briefing',
      progress: 0,
    })

    const ext = documentExtFromName(document.name) || 'bin'
    const objectName = `briefing-document.${ext}`
    const uploadResult = await uploadBriefingMedia(
      project.id,
      buf,
      objectName,
      document.type || MIME_BY_EXT[ext] || 'application/octet-stream'
    )
    const docStored = !isUploadFailure(uploadResult)
    let contentToSave = briefingContent
    if (!docStored && isUploadFailure(uploadResult)) {
      contentToSave += `\n\n[O documento original não foi guardado no servidor: ${uploadResult.message}]`
    }

    try {
      await saveBriefing({
        project_id: project.id,
        input_type: 'document',
        content: contentToSave,
        document_url: docStored ? uploadResult.storageRef : null,
      })
    } catch (saveErr) {
      console.error('saveBriefing document:', saveErr)
      await supabase.from('projects').delete().eq('id', project.id)
      return NextResponse.json({ error: 'Erro ao gravar o briefing no banco.' }, { status: 500 })
    }

    await logAudit({
      action: 'project.create',
      entityType: 'project',
      entityId: project.id,
      companyId: project.company_id,
      metadata: { name: project.name, inputType: 'document' },
    })

    revalidatePath('/projetos')
    revalidatePath(`/projetos/${project.id}`)

    return NextResponse.json({ projectId: project.id })
  } catch (error) {
    if (error instanceof ProjectLimitError) {
      return NextResponse.json(
        { error: error.message, code: PROJECT_LIMIT_REACHED_CODE },
        { status: 403 }
      )
    }
    console.error('from-document route:', error)
    return NextResponse.json({ error: 'Erro ao criar projeto com documento.' }, { status: 500 })
  }
}
