import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <span className="font-bold text-[#111827] text-lg">SpecFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors px-3 py-2"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1D4ED8] rounded-lg transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-[#1E3A8A] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            IA que transforma demandas em especificações
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] leading-tight mb-6">
            Da ideia ao uso,{' '}
            <span className="bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] bg-clip-text text-transparent">
              sem ruído.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            Transforme demandas caóticas em especificações técnicas completas — histórias de usuário, documentação e manual — em minutos, não semanas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] hover:opacity-90 rounded-xl transition-opacity shadow-lg shadow-blue-200"
            >
              Criar conta grátis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-[#374151] bg-white border border-[#E5E7EB] hover:border-[#93C5FD] hover:bg-[#F8FAFC] rounded-xl transition-all"
            >
              Já tenho conta
            </Link>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-4">Sem cartão de crédito • Primeiros 3 projetos grátis</p>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#E5E7EB] shadow-2xl shadow-slate-200 overflow-hidden">
            {/* Fake browser chrome */}
            <div className="bg-[#F1F5F9] border-b border-[#E5E7EB] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-[#9CA3AF] text-center max-w-xs mx-auto">
                  app.specflow.com.br/projetos/...
                </div>
              </div>
            </div>
            {/* Content preview */}
            <div className="bg-[#F8FAFC] p-6">
              <div className="flex gap-4 mb-4">
                {['Briefing', 'Refinamento', 'Especificação', 'Documentação', 'Manual'].map((tab, i) => (
                  <div
                    key={tab}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      i === 2
                        ? 'bg-[#1E3A8A] text-white shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111827]'
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { code: 'US-01', title: 'Agendamento online pelo paciente', desc: 'Como paciente, quero agendar consultas online para evitar ligações.' },
                  { code: 'US-02', title: 'Painel de agenda do médico', desc: 'Como médico, quero visualizar minha agenda diária para organizar atendimentos.' },
                  { code: 'US-03', title: 'Confirmação e lembrete por e-mail', desc: 'Como paciente, quero receber confirmação para não esquecer da consulta.' },
                  { code: 'US-04', title: 'Bloqueio de horários indisponíveis', desc: 'Como médico, quero bloquear horários para evitar conflitos de agenda.' },
                ].map(story => (
                  <div key={story.code} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">{story.code}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#111827] mb-1">{story.title}</p>
                    <p className="text-xs text-[#6B7280] leading-relaxed">{story.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#111827] mb-3">Como funciona</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">Seis etapas que transformam uma ideia bruta em documentação pronta para o time de desenvolvimento.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Entrada da demanda',
                desc: 'Texto, áudio, vídeo, documento ou formulário guiado. Fale como quiser.',
                color: 'from-blue-500 to-blue-600',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Refinamento via IA',
                desc: 'A IA faz perguntas inteligentes para preencher lacunas críticas do briefing.',
                color: 'from-violet-500 to-violet-600',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Especificação',
                desc: 'Histórias de usuário com critérios de aceite detalhados e editáveis.',
                color: 'from-indigo-500 to-indigo-600',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                ),
              },
              {
                step: '04',
                title: 'Documentação técnica',
                desc: 'Visão geral do sistema, módulos principais e regras de negócio geradas automaticamente.',
                color: 'from-cyan-500 to-cyan-600',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
              },
              {
                step: '05',
                title: 'Manual do usuário',
                desc: 'Passo a passo em linguagem simples para o usuário final, exportável em PDF.',
                color: 'from-emerald-500 to-emerald-600',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
              },
              {
                step: '06',
                title: 'Exportação',
                desc: 'PDF pronto para entregar ao cliente ou ao time. Jira e Notion em breve.',
                color: 'from-rose-500 to-rose-600',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
              },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4`}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-[#9CA3AF] mb-1">ETAPA {item.step}</div>
                <h3 className="text-base font-semibold text-[#111827] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#111827] mb-3">Por que o SpecFlow?</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">Especificação mal feita custa caro. O SpecFlow fecha o ciclo entre quem pediu e quem vai construir.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Menos retrabalho',
                desc: 'IA identifica lacunas críticas antes do desenvolvimento começar. Regras de negócio ambíguas viram critérios de aceite claros.',
                stat: '70%',
                statLabel: 'menos revisões tardias',
                color: 'bg-blue-50 text-[#1E3A8A]',
              },
              {
                title: 'Mais velocidade',
                desc: 'O que levaria dias de reuniões e iterações fica pronto em minutos. Analista, dev e cliente falam a mesma língua desde o início.',
                stat: '10x',
                statLabel: 'mais rápido que o processo manual',
                color: 'bg-violet-50 text-[#7C3AED]',
              },
              {
                title: 'Documentação real',
                desc: 'Não é só um texto gerado — é especificação técnica, documentação do sistema e manual do usuário, todos coerentes entre si.',
                stat: '3 em 1',
                statLabel: 'entregas por projeto',
                color: 'bg-emerald-50 text-[#10B981]',
              },
            ].map(b => (
              <div key={b.title} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold mb-4 ${b.color}`}>
                  {b.stat}
                </div>
                <p className={`text-xs font-medium mb-4 ${b.color.split(' ')[1]}`}>{b.statLabel}</p>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{b.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Pronto para especificar sem ruído?</h2>
            <p className="text-blue-200 mb-8 text-lg">Crie sua conta grátis e transforme sua primeira demanda em especificação agora mesmo.</p>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#1E3A8A] bg-white hover:bg-blue-50 rounded-xl transition-colors shadow-lg"
            >
              Começar grátis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <p className="text-xs text-blue-300 mt-4">Sem cartão de crédito • Cancele quando quiser</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <span className="font-bold text-[#111827]">SpecFlow</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">© {new Date().getFullYear()} SpecFlow. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
            <Link href="/login" className="hover:text-[#111827] transition-colors">Entrar</Link>
            <Link href="/cadastro" className="hover:text-[#111827] transition-colors">Cadastrar</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
