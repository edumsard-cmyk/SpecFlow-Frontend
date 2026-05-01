import Link from 'next/link'

const FAQ = [
  {
    q: 'Por onde começo depois de criar a conta?',
    a: 'Acesse o dashboard, crie um projeto e preencha o briefing. Em seguida use o refinamento com IA para esclarecer dúvidas antes de gerar a especificação.',
  },
  {
    q: 'O que entra na exportação (.md ou PDF)?',
    a: 'Somente o que já está salvo no servidor: briefing, mensagens de refinamento persistidas, histórias de usuário, documentação técnica e manual, conforme cada etapa estiver preenchida. Salve as alterações nas abas antes de exportar.',
  },
  {
    q: 'Por que o PDF ou Markdown parece “vazio” em alguma seção?',
    a: 'Essa etapa ainda não foi gerada ou salva. Abra a aba correspondente (especificação, documentação ou manual), gere ou edite o conteúdo e aguarde a gravação.',
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

        <div className="space-y-6">
          {FAQ.map((item) => (
            <section
              key={item.q}
              className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-[#111827] mb-2">{item.q}</h2>
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
