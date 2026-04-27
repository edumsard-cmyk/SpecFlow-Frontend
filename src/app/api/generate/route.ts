import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getBriefing } from '@/lib/data/briefings'
import { createClient } from '@/lib/supabase/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = 'Você é um analista de sistemas especializado em engenharia de software. Responda SEMPRE com um JSON array válido, sem markdown, sem blocos de código, sem explicações adicionais.'

function storiesPrompt(briefing: string) {
  return `Com base no briefing abaixo, gere histórias de usuário completas e detalhadas.
Retorne APENAS um JSON array com objetos no formato:
[{ "code": "US-01", "title": "Título curto", "description": "Como [ator], quero [ação] para [benefício].", "criteria": ["critério 1", "critério 2", "critério 3"] }]

Gere pelo menos 4 histórias cobrindo os principais fluxos descritos.

BRIEFING:
${briefing}`
}

function docPrompt(briefing: string, storiesText: string) {
  return `Com base no briefing e nas histórias de usuário abaixo, gere seções de documentação técnica do sistema.
Retorne APENAS um JSON array com exatamente 3 objetos:
1. Visão geral (type: "text", campo "content" preenchido)
2. Módulos principais (type: "grid", campo "items" com 4-6 módulos)
3. Regras de negócio (type: "list", campo "items" com 4-6 regras)

Formato:
[{ "id": "overview", "title": "Visão geral do sistema", "type": "text", "content": "..." }, { "id": "modules", "title": "Módulos principais", "type": "grid", "content": "", "items": ["Módulo 1", ...] }, { "id": "rules", "title": "Regras de negócio", "type": "list", "content": "", "items": ["Regra 1", ...] }]

BRIEFING:
${briefing}

HISTÓRIAS DE USUÁRIO:
${storiesText}`
}

function manualPrompt(briefing: string, storiesText: string) {
  return `Com base no briefing e nas histórias de usuário abaixo, gere seções do manual do usuário com passo a passo.
Retorne APENAS um JSON array com objetos no formato:
[{ "id": "s1", "title": "1. Como [ação principal]", "steps": ["Passo 1 detalhado", "Passo 2 detalhado", ...] }]

Gere 3-4 seções cobrindo os principais fluxos do sistema. Cada seção deve ter 4-6 passos claros e objetivos.

BRIEFING:
${briefing}

HISTÓRIAS DE USUÁRIO:
${storiesText}`
}

export async function POST(req: NextRequest) {
  const { type, projectId } = await req.json()

  if (!type || !projectId) {
    return NextResponse.json({ error: 'type e projectId são obrigatórios.' }, { status: 400 })
  }

  const supabase = await createClient()
  const briefing = await getBriefing(projectId)

  if (!briefing?.content) {
    return NextResponse.json({ error: 'Briefing não encontrado.' }, { status: 404 })
  }

  let storiesText = ''
  if (type === 'doc' || type === 'manual') {
    const { data: stories } = await supabase
      .from('user_stories')
      .select('code, title, description')
      .eq('project_id', projectId)
    if (stories && stories.length > 0) {
      storiesText = stories.map(s => `${s.code}: ${s.title} — ${s.description}`).join('\n')
    }
  }

  const userPrompt =
    type === 'stories' ? storiesPrompt(briefing.content) :
    type === 'doc' ? docPrompt(briefing.content, storiesText) :
    manualPrompt(briefing.content, storiesText)

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
