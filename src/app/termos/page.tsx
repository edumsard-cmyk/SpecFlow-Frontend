import Link from 'next/link'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-[#1E3A8A] hover:underline">
            SpecFlow
          </Link>
          <Link href="/login" className="text-sm text-[#64748B] hover:text-[#1E3A8A]">
            Entrar
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold text-[#111827] mb-6">Termos de uso</h1>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
          Este é um texto modelo. Substitua pelo contrato ou termos revisados pelo seu jurídico antes de
          disponibilizar o serviço a clientes pagantes.
        </p>
        <section className="space-y-4 text-sm text-[#374151] leading-relaxed">
          <h2 className="text-base font-semibold text-[#111827]">1. Objeto</h2>
          <p>
            O SpecFlow oferece ferramentas para organizar demandas, briefings e especificações. O uso da
            plataforma implica aceitação destes termos.
          </p>
          <h2 className="text-base font-semibold text-[#111827]">2. Conta e responsabilidades</h2>
          <p>
            Você é responsável pela veracidade dos dados informados e pela segurança das credenciais da sua
            conta. Notifique-nos em caso de uso não autorizado.
          </p>
          <h2 className="text-base font-semibold text-[#111827]">3. Conteúdo e IA</h2>
          <p>
            Conteúdos gerados por IA são sugestões. A validação técnica e de negócio permanece com sua
            equipe. Não nos responsabilizamos por decisões tomadas com base apenas em saídas automáticas.
          </p>
          <h2 className="text-base font-semibold text-[#111827]">4. Alterações</h2>
          <p>
            Podemos atualizar estes termos. A versão vigente estará sempre publicada nesta página, com data
            de revisão quando aplicável.
          </p>
        </section>
        <p className="mt-10 text-xs text-[#9CA3AF]">
          Última atualização do modelo: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </main>
    </div>
  )
}
