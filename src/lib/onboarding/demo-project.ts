import type { StoryPayload } from '@/app/actions/projects'

/** Marcador interno em `projects.description` para evitar duplicar demo. */
export const DEMO_PROJECT_MARKER = '[specflow-demo]'

export const DEMO_PROJECT_NAME = 'Exemplo — alterar cor do botão'

export const DEMO_PROJECT_DESCRIPTION =
  'Projeto de demonstração do SpecFlow. Pode editar, apagar ou usar como referência.'

export const DEMO_BRIEFING = `Quero alterar a cor do botão principal do painel para o tom #6c5ce7 (roxo), mantendo bom contraste com o texto branco e o fundo escuro da sidebar.

O objetivo é alinhar a interface à identidade visual da marca sem prejudicar a leitura dos ícones e labels. A mudança deve valer para o estado normal e hover do botão de ação principal.`

export const DEMO_STORIES: StoryPayload[] = [
  {
    code: 'US-01',
    title: 'Alterar cor do botão principal',
    description:
      'Como utilizador autenticado no painel, quero que o botão de ação principal use a cor #6c5ce7, para reforçar a identidade visual da marca.',
    criteria: [
      'Cor de fundo #6c5ce7 no estado padrão',
      'Texto e ícones com contraste mínimo WCAG AA',
      'Estado hover visivelmente diferente do padrão',
    ],
  },
  {
    code: 'US-02',
    title: 'Validar contraste na sidebar',
    description:
      'Como gestor do produto, quero validar o contraste do botão na sidebar escura, para garantir legibilidade em monitores variados.',
    criteria: [
      'Preview em tema claro e escuro documentado',
      'Sem regressão nos botões secundários',
    ],
  },
]

export const DEMO_MANUAL = [
  {
    id: 'm1',
    title: '1. Onde alterar a cor',
    steps: [
      'Abra o painel administrativo e vá em Configurações → Aparência',
      'Localize o campo "Cor do botão principal"',
      'Informe o código hexadecimal #6c5ce7',
      'Clique em Salvar e recarregue a página para ver o resultado',
    ],
  },
]

export const DEMO_REFINEMENT_AI = `Revisei o pedido: a alteração para #6c5ce7 no botão principal é clara e alinhada ao briefing.

Sugiro confirmar se o hover deve ser um tom mais claro (#7d6df0) ou mais escuro (#5b4bd6) e se a mudança vale só no desktop ou também no mobile.

Quando estiver de acordo, avance para a conclusão e exportação do pacote.`
