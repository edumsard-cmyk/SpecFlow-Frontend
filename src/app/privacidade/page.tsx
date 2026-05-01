import Link from 'next/link'

export default function PrivacidadePage() {
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
        <h1 className="text-2xl font-bold text-[#111827] mb-6">Política de privacidade</h1>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
          Texto modelo para transparência com usuários e clientes. Ajuste conforme LGPD, DPA com
          fornecedores (ex.: hospedagem, Supabase) e práticas reais de tratamento de dados.
        </p>
        <section className="space-y-4 text-sm text-[#374151] leading-relaxed">
          <h2 className="text-base font-semibold text-[#111827]">1. Dados que tratamos</h2>
          <p>
            Podemos tratar dados de cadastro (nome, e-mail, empresa), conteúdos que você insere na
            plataforma (briefings, histórias, documentos) e dados técnicos de acesso (logs, cookies
            necessários à sessão).
          </p>
          <h2 className="text-base font-semibold text-[#111827]">2. Finalidades</h2>
          <p>
            Prestamos o serviço, mantemos a segurança da aplicação, cumprimos obrigações legais e, quando
            aplicável, comunicamos atualizações relevantes sobre o produto.
          </p>
          <h2 className="text-base font-semibold text-[#111827]">3. Compartilhamento</h2>
          <p>
            Utilizamos provedores de infraestrutura e autenticação (por exemplo, Supabase). Não vendemos seus
            dados pessoais. Compartilhamentos ocorrem apenas para operação do serviço ou por exigência legal.
          </p>
          <h2 className="text-base font-semibold text-[#111827]">4. Seus direitos</h2>
          <p>
            Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção,
            anonimização, portabilidade e eliminação de dados desnecessários, entre outros. Use o canal de
            contato indicado pelo responsável pelo produto.
          </p>
          <h2 className="text-base font-semibold text-[#111827]">5. Retenção</h2>
          <p>
            Mantemos os dados pelo tempo necessário para a finalidade descrita ou para cumprimento legal.
            Projetos excluídos podem remover conteúdo associado conforme a política técnica do sistema.
          </p>
        </section>
        <p className="mt-10 text-xs text-[#9CA3AF]">
          Última atualização do modelo: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </main>
    </div>
  )
}
