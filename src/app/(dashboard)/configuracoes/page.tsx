import Link from 'next/link'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import { getProfile } from '@/lib/data/profile'
import ConfiguracoesClient from './ConfiguracoesClient'

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

        <p className="text-xs text-[#9CA3AF]">
          <Link href="/dashboard" className="text-[#1E3A8A] hover:underline">
            Voltar ao dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
