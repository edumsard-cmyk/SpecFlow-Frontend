import Link from 'next/link'
import CreateDemoProjectForm from '@/components/help/CreateDemoProjectForm'

const GUIDE_STEPS = [
  {
    n: 1,
    title: 'Abrir o projeto de exemplo',
    body: 'No dashboard, clique em "Ver projeto de exemplo". Você verá briefing, histórias US-01/US-02, manual e uma mensagem de refinamento já salvos — sem precisar configurar IA na primeira visita.',
  },
  {
    n: 2,
    title: 'Percorrer as abas do fluxo',
    body: 'Briefing → Especificação (histórias) → Manual → Refinamento (chat com IA) → Conclusão. O stepper no topo mostra em que etapa o projeto está. Salve alterações antes de exportar.',
  },
  {
    n: 3,
    title: 'Refinar e gerar conclusão',
    body: 'Na aba Refinamento, a IA ajuda a esclarecer escopo e critérios. Depois, em Conclusão, gere o texto final do projeto (resumo e próximos passos) a partir do que já foi salvo.',
  },
  {
    n: 4,
    title: 'Exportar para Jira ou Notion',
    body: 'No cabeçalho do projeto use os botões de exportação: CSV para importar histórias no Jira, ou Markdown para colar no Notion. Também é possível baixar o pacote completo em .md ou PDF.',
  },
  {
    n: 5,
    title: 'Criar seu projeto real',
    body: 'Quando estiver confortável, use "Novo projeto" com texto, áudio ou documento. O checklist no dashboard acompanha briefing, histórias, refinamento e conclusão/exportação.',
  },
]

const FAQ = [
  {
    q: 'Por onde começo depois de criar a conta?',
    a: 'Entre no dashboard e use "Ver projeto de exemplo" para explorar o fluxo em poucos minutos. Depois crie um projeto com sua demanda real em Projetos → Novo projeto.',
  },
  {
    q: 'O que entra na exportação (.md ou PDF)?',
    a: 'Somente o que já está salvo no servidor: briefing, mensagens de refinamento persistidas, histórias de usuário e manual, conforme cada etapa estiver preenchida. Salve as alterações nas abas antes de exportar.',
  },
  {
    q: 'Por que o PDF ou Markdown parece “vazio” em alguma seção?',
    a: 'Essa etapa ainda não foi gerada ou salva. Abra a aba correspondente (especificação ou manual), gere ou edite o conteúdo e aguarde a gravação.',
  },
  {
    q: 'O refinamento com IA falhou ou travou. O que fazer?',
    a: 'Verifique sua conexão, aguarde um minuto e envie a mensagem de novo. Se o erro continuar, pode ser limite temporário do provedor de IA ou instabilidade — tente mais tarde.',
  },
  {
    q: 'Esqueci minha senha.',
    a: 'Na tela de login, use “Esqueceu a senha?” para receber o e-mail de redefinição (conforme configurado no Supabase Auth).',
  },
  {
    q: 'Quem pode convidar pessoas para a empresa?',
    a: 'Gestores da empresa podem enviar convites em Configurações. Administradores podem gerenciar usuários no painel admin.',
  },
]

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-[#1E3A8A] hover:underline">
            SpecFlow
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/ajuda" className="text-[#1E3A8A] font-medium" aria-current="page">
              Ajuda
            </Link>
            <Link href="/login" className="text-[#64748B] hover:text-[#1E3A8A]">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-[#64748B] hover:text-[#1E3A8A]"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Central de ajuda</h1>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
          Respostas rápidas para começar a usar o SpecFlow. Para suporte direto, use o e-mail indicado em{' '}
          <Link href="/configuracoes" className="text-[#1E3A8A] font-medium hover:underline">
            Configurações
          </Link>
          {' '}(após entrar na conta), se sua organização tiver configurado o contato.
        </p>

        <section
          id="comecar"
          className="rounded-2xl border border-[#E0E7FF] bg-white p-6 shadow-sm mb-10 scroll-mt-6"
        >
          <h2 className="text-lg font-semibold text-[#111827] mb-1">
            Começar em 5 minutos
          </h2>
          <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
            Roteiro recomendado para a primeira sessão. Se já tiver conta, entre e use o botão abaixo
            (requer login).
          </p>
          <ol className="space-y-5 mb-6">
            {GUIDE_STEPS.map(step => (
              <li key={step.n} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#EEF2FF] text-[#1E3A8A] text-sm font-bold flex items-center justify-center">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#111827]">{step.title}</h3>
                  <p className="text-sm text-[#374151] mt-1 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F1F5F9]">
            <CreateDemoProjectForm />
            <Link
              href="/login"
              className="text-sm font-medium text-[#1E3A8A] hover:underline"
            >
              Entrar para criar o exemplo
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-[#6B7280] hover:text-[#111827]"
            >
              Ir ao dashboard →
            </Link>
          </div>
        </section>

        <h2 className="text-base font-semibold text-[#111827] mb-4">Perguntas frequentes</h2>
        <div className="space-y-6">
          {FAQ.map((item) => (
            <section
              key={item.q}
              className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-[#111827] mb-2">{item.q}</h3>
              <p className="text-sm text-[#374151] leading-relaxed">{item.a}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-[#6B7280]">
          <Link href="/termos" className="text-[#1E3A8A] hover:underline">
            Termos de uso
          </Link>
          <span className="mx-2 text-[#D1D5DB]">·</span>
          <Link href="/privacidade" className="text-[#1E3A8A] hover:underline">
            Privacidade
          </Link>
        </p>
      </main>
    </div>
  )
}
