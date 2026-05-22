import AdminBackLink from '@/components/admin/AdminBackLink'
import UsuariosClient from '@/components/admin/UsuariosClient'
import LocalizedHeader from '@/components/layout/LocalizedHeader'
import { getAllUsersWithStats, getCompaniesWithStats } from '@/lib/data/admin'

export default async function UsuariosPage() {
  const [users, companies] = await Promise.all([getAllUsersWithStats(), getCompaniesWithStats()])

  return (
    <div className="flex flex-col flex-1">
      <LocalizedHeader
        titleKey="admin.users.title"
        subtitleKey={users.length === 1 ? 'admin.users.subtitleOne' : 'admin.users.subtitleMany'}
        subtitleVars={{ n: users.length }}
        actions={<AdminBackLink />}
      />
      <UsuariosClient users={users} companies={companies.map(c => ({ id: c.id, name: c.name }))} />
    </div>
  )
}
