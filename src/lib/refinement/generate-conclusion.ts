import Groq from 'groq-sdk'
import type { ProjectConclusion } from '@/types'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const CONCLUSION_SCHEMA = `{
  "narrative": "string — texto corrido (3 a 6 parágrafos curtos) explicando o pedido, o que foi refinado e o que precisa ser feito, para alguém que não participou do chat",
  "summary": "string — uma frase de fechamento",
  "highlights": ["string — fatos ou decisões já alinhados"],
  "actionItems": ["string — passos concretos que o time ou o cliente deve executar"],
  "readyToFinish": true ou false
}`

export async function generateProjectConclusion(input: {
  briefing: string
  refinementTranscript: string
  projectName?: string
}): Promise<ProjectConclusion> {
  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2048,
    temperature: 0.35,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Você redige a CONCLUSÃO FINAL de um projeto no SpecFlow, a partir do briefing e da conversa de REFINAMENTO.

O leitor pode ser gestor, cliente ou desenvolvedor que NÃO viu o chat. O texto deve deixar claro:
1) Qual é a demanda / problema;
2) O que foi discutido ou validado no refinamento;
3) O que precisa ser feito na prática (implementar, ajustar, validar, exportar).

Produza APENAS JSON válido:
${CONCLUSION_SCHEMA}

Regras:
- Português do Brasil, tom profissional e acessível.
- "narrative" é o corpo principal: texto explicativo contínuo (não use markdown nem listas dentro dele).
- "actionItems": 3 a 8 itens no imperativo ou infinitivo ("Alterar a cor do botão para #6c5ce7", "Validar contraste no painel", etc.).
- "highlights": 2 a 5 bullets de contexto já fechado.
- Baseie-se só no briefing e no chat; não invente escopo novo.
- "readyToFinish": true se a demanda está clara o suficiente para concluir o projeto.`,
      },
      {
        role: 'user',
        content: [
          input.projectName ? `## Projeto\n${input.projectName}` : '',
          `## Briefing\n${input.briefing}`,
          `## Conversa de refinamento\n${input.refinementTranscript}`,
        ]
          .filter(Boolean)
          .join('\n\n'),
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content?.trim() ?? ''
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Resposta da IA em formato inválido.')
  }

  const o = parsed as Record<string, unknown>
  const summary = typeof o.summary === 'string' ? o.summary.trim() : ''
  const narrative =
    typeof o.narrative === 'string' && o.narrative.trim()
      ? o.narrative.trim()
      : summary

  if (!narrative) {
    throw new Error('Conclusão vazia da IA.')
  }

  const highlights = Array.isArray(o.highlights)
    ? o.highlights.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : []

  const actionItems = Array.isArray(o.actionItems)
    ? o.actionItems.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : Array.isArray(o.recommendations)
      ? o.recommendations.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
      : []

  return {
    narrative,
    summary: summary || narrative.slice(0, 280),
    highlights,
    actionItems,
    readyToFinish: o.readyToFinish === true,
    generatedAt: new Date().toISOString(),
  }
}
