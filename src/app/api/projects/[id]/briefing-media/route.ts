import { NextRequest, NextResponse } from 'next/server'
import { resolveBriefingSourceMeta } from '@/lib/briefing/briefing-media'
import { downloadBriefingObject } from '@/lib/briefing/storage-access'
import { getBriefing } from '@/lib/data/briefings'
import { getProject } from '@/lib/data/projects'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function disposition(fileName: string, download: boolean): string {
  const safe = fileName.replace(/[^\w.\-()+ ]/g, '_')
  return download
    ? `attachment; filename="${safe}"`
    : `inline; filename="${safe}"`
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const project = await getProject(projectId)
  if (!project) {
    return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })
  }

  const briefing = await getBriefing(projectId)
  const download = req.nextUrl.searchParams.get('download') === '1'
  const fileParam = req.nextUrl.searchParams.get('file')

  if (fileParam) {
    if (briefing?.input_type !== 'images') {
      return NextResponse.json({ error: 'Arquivo não disponível.' }, { status: 404 })
    }
    if (!/^briefing-image-\d+\.[a-z0-9]+$/i.test(fileParam)) {
      return NextResponse.json({ error: 'Nome de arquivo inválido.' }, { status: 400 })
    }
    const objectPath = `${projectId}/${fileParam}`
    const fileRes = await downloadBriefingObject(objectPath)
    if (!fileRes.data) {
      return NextResponse.json({ error: 'Imagem não encontrada.' }, { status: 404 })
    }
    const ext = fileParam.split('.').pop()?.toLowerCase() ?? 'jpg'
    const mime =
      ext === 'png'
        ? 'image/png'
        : ext === 'webp'
          ? 'image/webp'
          : ext === 'gif'
            ? 'image/gif'
            : 'image/jpeg'
    const buf = Buffer.from(await fileRes.data.arrayBuffer())
    return new NextResponse(buf, {
      headers: {
        'Content-Type': mime,
        'Content-Disposition': disposition(fileParam, download),
        'Cache-Control': 'private, max-age=300',
      },
    })
  }

  const meta = await resolveBriefingSourceMeta(briefing, projectId)
  if (!meta) {
    return NextResponse.json(
      { error: 'Arquivo original não encontrado. Grave ou envie o vídeo/áudio novamente em um novo projeto.' },
      { status: 404 }
    )
  }

  const fileRes = await downloadBriefingObject(meta.objectPath)

  if (!fileRes.data) {
    console.error('briefing-media download:', fileRes.error)
    return NextResponse.json(
      { error: 'Não foi possível abrir o arquivo no storage.' },
      { status: 404 }
    )
  }

  const buf = Buffer.from(await fileRes.data.arrayBuffer())
  return new NextResponse(buf, {
    headers: {
      'Content-Type': meta.mimeType,
      'Content-Disposition': disposition(meta.fileName, download),
      'Cache-Control': 'private, max-age=300',
      'Accept-Ranges': 'bytes',
    },
  })
}

export async function HEAD(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse(null, { status: 401 })

  const project = await getProject(projectId)
  if (!project) return new NextResponse(null, { status: 404 })

  const briefing = await getBriefing(projectId)
  const meta = await resolveBriefingSourceMeta(briefing, projectId)
  if (!meta) return new NextResponse(null, { status: 404 })

  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Briefing-Media-Kind': meta.kind,
      'X-Briefing-Media-Name': encodeURIComponent(meta.fileName),
      'Content-Type': meta.mimeType,
    },
  })
}
