import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import UsuariosClient from '@/components/admin/UsuariosClient'
import { getAllUsersWithStats } from '@/lib/data/admin'

export default async function UsuariosPage() {
  const users = await getAllUsersWithStats()

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Usuários"
        subtitle={`${users.length} usuário${users.length !== 1 ? 's' : ''} na plataforma`}
        actions={
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Admin
            </Button>
          </Link>
        }
      />
      <UsuariosClient users={users} />
    </div>
  )
}
