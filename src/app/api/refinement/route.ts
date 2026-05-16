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

const SYSTEM_PROMPT = `Você é o agente de refinamento do SpecFlow — uma plataforma que transforma demandas de negócio em especificações técnicas completas.

Seu papel é fazer perguntas inteligentes e objetivas para extrair as informações necessárias para gerar uma especificação de sistema de alta qualidade.

Trabalhe apenas sobre o produto/sistema descrito no briefing inicial deste projeto — não substitua por outro domínio nem invente uma demanda diferente.

## Regras:
- Faça UMA pergunta por vez — clara, direta e específica
- Identifique lacunas críticas: perfis de usuário, regras de negócio, integrações, restrições técnicas, casos de borda
- Adapte as perguntas conforme as respostas anteriores — não repita o que já foi respondido
- Use linguagem simples, sem jargão técnico desnecessário
- Após 6-8 trocas de mensagens, indique que o briefing está suficientemente refinado para gerar a especificação

## Sequência sugerida de exploração:
1. Perfis/atores do sistema (quem usa o quê)
2. Fluxos principais (o que cada ator faz)
3. Regras de negócio críticas
4. Integrações com outros sistemas
5. Restrições técnicas ou de negócio
6. Casos de erro e exceções importantes

Seja conciso. Não explique o que vai perguntar — apenas pergunte.`

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
