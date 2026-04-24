import Groq from 'groq-sdk'
import { NextRequest } from 'next/server'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Você é o agente de refinamento do SpecFlow — uma plataforma que transforma demandas de negócio em especificações técnicas completas.

Seu papel é fazer perguntas inteligentes e objetivas para extrair as informações necessárias para gerar uma especificação de sistema de alta qualidade.

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

export async function POST(req: NextRequest) {
  try {
    const { messages, briefing } = await req.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
      briefing: string
    }

    const contextualMessages = messages.length === 0
      ? [{ role: 'user' as const, content: `Briefing recebido:\n\n${briefing}` }]
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
