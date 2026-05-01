import Link from 'next/link'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import { getProfile } from '@/lib/data/profile'
import ConfiguracoesClient from './ConfiguracoesClient'
import InviteTeamClient from './InviteTeamClient'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  company: 'Gestor da empresa',
  user: 'Usuário',
}

export default async function ConfiguracoesPage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role

  return (
    <div className="flex flex-col flex-1">
      <Header title="Configurações" subtitle="Conta e segurança" />

      <div className="flex-1 p-6 space-y-6 max-w-2xl">
        <Card padding="lg" className="space-y-4">
          <h2 className="text-sm font-semibold text-[#374151]">Perfil</h2>
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Nome</dt>
              <dd className="text-[#111827] mt-0.5">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">E-mail</dt>
              <dd className="text-[#111827] mt-0.5">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Função</dt>
              <dd className="text-[#111827] mt-0.5">{roleLabel}</dd>
            </div>
          </dl>
        </Card>

        <ConfiguracoesClient />

        {profile.role === 'company' && <InviteTeamClient />}

        {profile.role === 'admin' && (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 text-sm text-[#64748B]">
            Como administrador, crie ou vincule usuários no{' '}
            <Link href="/admin/usuarios" className="text-[#1E3A8A] font-medium hover:underline">
              Painel Admin · Usuários
            </Link>
            .
          </div>
        )}

        <p className="text-xs text-[#9CA3AF] flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/dashboard" className="text-[#1E3A8A] hover:underline">
            Voltar ao dashboard
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/termos" className="text-[#1E3A8A] hover:underline">
            Termos
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacidade" className="text-[#1E3A8A] hover:underline">
            Privacidade
          </Link>
        </p>
      </div>
    </div>
  )
}
