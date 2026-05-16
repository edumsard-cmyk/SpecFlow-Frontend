import Groq from 'groq-sdk'
import { NextRequest } from 'next/server'
import { getBriefing } from '@/lib/data/briefings'
import { createClient } from '@/lib/supabase/server'
import { consumeAiRateLimit } from '@/lib/api/ai-rate-limit'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MAX_MESSAGES = 48
const MAX_MESSAGE_CHARS = 24_000

const SYSTEM_PROMPT = `Você é o agente de refinamento final do SpecFlow — plataforma que transforma demandas em especificação, documentação e manual.

No fluxo atual, esta etapa vem depois da especificação, documentação técnica e manual. É o “pente fino”: revisar clareza, consistência e leitura do que já foi pedido e produzido, para quem implementa ou revisa o pacote.

Trabalhe apenas sobre o produto/sistema descrito no briefing deste projeto — não substitua por outro domínio nem invente uma demanda diferente.

## O que fazer:
- Sugira melhorias de redação e estrutura quando ajudarem a leitura (sem reescrever tudo de uma vez).
- Aponte inconsistências, ambiguidades, termos vagos ou contradições entre o que o cliente pediu e o que ficou implícito.
- Se faltar algo crítico para fechar o pacote, faça UMA pergunta objetiva por vez — clara e específica.
- Adapte-se ao histórico da conversa; não repita o que já foi respondido.
- Use linguagem simples. Seja conciso.

## Quando o material estiver bem revisado:
Indique que está adequado para conclusão ou exportação — sem checklist longo.

Não explique o que vai perguntar antes de perguntar — apenas pergunte ou comente de forma direta.`

function clampMessages(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const sliced = messages.slice(-MAX_MESSAGES)
  return sliced.map(m => ({
    ...m,
    content:
      m.content.length > MAX_MESSAGE_CHARS
        ? `${m.content.slice(0, MAX_MESSAGE_CHARS)}\n…`
        : m.content,
  }))
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const rl = consumeAiRateLimit(`refinement:${user.id}`, 40, 60_000)
    if (!rl.ok) {
      return Response.json(
        { error: 'Muitas requisições. Aguarde um instante.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const body = (await req.json()) as {
      messages?: Array<{ role: 'user' | 'assistant'; content: string }>
      projectId?: string
    }

    const projectId = typeof body.projectId === 'string' ? body.projectId.trim() : ''
    if (!projectId) {
      return Response.json({ error: 'projectId é obrigatório.' }, { status: 400 })
    }

    const briefingRow = await getBriefing(projectId)
    if (!briefingRow?.content?.trim()) {
      return Response.json({ error: 'Briefing não encontrado ou sem permissão.' }, { status: 404 })
    }

    const canonicalBriefing = briefingRow.content.trim()
    const rawMessages = Array.isArray(body.messages) ? body.messages : []
    const messages = clampMessages(
      rawMessages.filter(
        m =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string'
      )
    )

    const contextualMessages =
      messages.length === 0
        ? [{ role: 'user' as const, content: `Briefing recebido:\n\n${canonicalBriefing}` }]
        : messages

    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...contextualMessages,
      ],
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) {
              const data = JSON.stringify({ text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Refinement API error:', error)
    return Response.json({ error: 'Erro ao processar mensagem.' }, { status: 500 })
  }
}
