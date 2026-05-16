import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getBriefing } from '@/lib/data/briefings'
import { createClient } from '@/lib/supabase/server'
import { consumeAiRateLimit } from '@/lib/api/ai-rate-limit'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const GENERATE_TYPES = ['stories', 'doc', 'manual'] as const
type GenerateType = (typeof GENERATE_TYPES)[number]

function isGenerateType(t: unknown): t is GenerateType {
  return typeof t === 'string' && (GENERATE_TYPES as readonly string[]).includes(t)
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT =
  'Você é um analista de sistemas especializado em engenharia de software. Baseie-se apenas no contexto do projeto enviado (briefing e refinamento); não invente outro sistema ou domínio. Responda SEMPRE com um JSON array válido, sem markdown, sem blocos de código, sem explicações adicionais.'

function formatRefinementBlock(
  rows: { role: string; content: string }[] | null | undefined
): string {
  if (!rows?.length) return ''
  return rows
    .map(r => {
      const label = r.role === 'user' ? 'Solicitante' : 'Assistente SpecFlow'
      return `${label}: ${r.content}`
    })
    .join('\n\n')
}

/** Junta briefing persistido + mensagens de refinamento para um único contexto fiel ao projeto. */
function bundleBriefingAndRefinement(canonicalBriefing: string, refinementBlock: string): string {
  const rb = refinementBlock.trim()
  if (!rb) return canonicalBriefing
  return `${canonicalBriefing}

---

REFINAMENTO (troca entre solicitante e IA — trate como complemento obrigatório ao briefing acima; detalhes aqui refinam ou esclarecem requisitos):
${rb}`
}

function briefingGenerationGate(rawContent: string): string | null {
  const t = rawContent.trim()
  if (t.length < 15) {
    return 'Briefing insuficiente. Complete o texto na aba Briefing (mínimo 15 caracteres) antes de gerar.'
  }
  if (/^\[(Briefing enviado por (áudio|vídeo|documento))\]/i.test(t)) {
    return 'Este projeto ainda só tem um marcador de briefing (sem texto útil). Abra a aba Briefing, descreva a demanda e guarde antes de gerar.'
  }
  return null
}

function storiesPrompt(bundle: string) {
  return `Com base exclusivamente no contexto do projeto abaixo (briefing + refinamento quando existir), gere histórias de usuário completas e detalhadas para ESTE sistema — não invente outro produto nem domínio diferente.
Retorne APENAS um JSON array com objetos no formato:
[{ "code": "US-01", "title": "Título curto", "description": "Como [ator], quero [ação] para [benefício].", "criteria": ["critério 1", "critério 2", "critério 3"] }]

Gere pelo menos 4 histórias cobrindo os principais fluxos descritos no contexto.

CONTEXTO DO PROJETO:
${bundle}`
}

function docPrompt(bundle: string, storiesText: string) {
  const storiesSection =
    storiesText.trim().length > 0
      ? storiesText.trim()
      : '(Nenhuma história de usuário guardada — baseie-se apenas no contexto do projeto acima.)'

  return `Com base exclusivamente no contexto do projeto e nas histórias indicadas abaixo, gere documentação técnica para ESTE sistema — coerente com o briefing e o refinamento.
Retorne APENAS um JSON array com exatamente 3 objetos:
1. Visão geral (type: "text", campo "content" preenchido)
2. Módulos principais (type: "grid", campo "items" com 4-6 módulos)
3. Regras de negócio (type: "list", campo "items" com 4-6 regras)

Formato:
[{ "id": "overview", "title": "Visão geral do sistema", "type": "text", "content": "..." }, { "id": "modules", "title": "Módulos principais", "type": "grid", "content": "", "items": ["Módulo 1", ...] }, { "id": "rules", "title": "Regras de negócio", "type": "list", "content": "", "items": ["Regra 1", ...] }]

CONTEXTO DO PROJETO:
${bundle}

HISTÓRIAS DE USUÁRIO:
${storiesSection}`
}

function manualPrompt(bundle: string, storiesText: string) {
  const storiesSection =
    storiesText.trim().length > 0
      ? storiesText.trim()
      : '(Nenhuma história de usuário guardada — baseie-se apenas no contexto do projeto acima.)'

  return `Com base exclusivamente no contexto do projeto e nas histórias indicadas abaixo, gere o manual do usuário para ESTE sistema — linguagem simples e passos práticos alinhados ao briefing e refinamento.
Retorne APENAS um JSON array com objetos no formato:
[{ "id": "s1", "title": "1. Como [ação principal]", "steps": ["Passo 1 detalhado", "Passo 2 detalhado", ...] }]

Gere 3-4 seções cobrindo os principais fluxos do sistema. Cada seção deve ter 4-6 passos claros e objetivos.

CONTEXTO DO PROJETO:
${bundle}

HISTÓRIAS DE USUÁRIO:
${storiesSection}`
}

export async function POST(req: NextRequest) {
  const { type, projectId } = await req.json() as { type?: unknown; projectId?: unknown }

  if (!projectId || typeof projectId !== 'string' || !projectId.trim()) {
    return NextResponse.json({ error: 'projectId é obrigatório.' }, { status: 400 })
  }

  if (!isGenerateType(type)) {
    return NextResponse.json(
      { error: 'type inválido. Use: stories, doc ou manual.' },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const rl = consumeAiRateLimit(`generate:${user.id}`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Muitas requisições. Aguarde um instante.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
      }
    )
  }

  const pid = projectId.trim()
  const briefing = await getBriefing(pid)

  if (!briefing?.content?.trim()) {
    return NextResponse.json({ error: 'Briefing não encontrado.' }, { status: 404 })
  }

  const gate = briefingGenerationGate(briefing.content)
  if (gate) {
    return NextResponse.json({ error: gate }, { status: 400 })
  }

  const { data: refinementRows } = await supabase
    .from('refinement_messages')
    .select('role, content')
    .eq('project_id', pid)
    .order('created_at', { ascending: true })

  const refinementBlock = formatRefinementBlock(refinementRows ?? [])
  const bundle = bundleBriefingAndRefinement(briefing.content.trim(), refinementBlock)

  let storiesText = ''
  if (type === 'doc' || type === 'manual') {
    const { data: stories } = await supabase
      .from('user_stories')
      .select('code, title, description')
      .eq('project_id', pid)
    if (stories && stories.length > 0) {
      storiesText = stories.map(s => `${s.code}: ${s.title} — ${s.description}`).join('\n')
    }
  }

  const userPrompt =
    type === 'stories' ? storiesPrompt(bundle) :
    type === 'doc' ? docPrompt(bundle, storiesText) :
    manualPrompt(bundle, storiesText)

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('Resposta sem JSON array')

    const data = JSON.parse(jsonMatch[0])
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao gerar conteúdo.' },
      { status: 500 }
    )
  }
}
