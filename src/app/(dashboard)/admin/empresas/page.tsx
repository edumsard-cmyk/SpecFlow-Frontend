import AdminBackLink from '@/components/admin/AdminBackLink'
import EmpresasClient from '@/components/admin/EmpresasClient'
import LocalizedHeader from '@/components/layout/LocalizedHeader'
import { getCompaniesWithStats } from '@/lib/data/admin'

export default async function EmpresasPage() {
  const companies = await getCompaniesWithStats()

  return (
    <div className="flex flex-col flex-1">
      <LocalizedHeader
        titleKey="admin.companies.title"
        subtitleKey={companies.length === 1 ? 'admin.companies.subtitleOne' : 'admin.companies.subtitleMany'}
        subtitleVars={{ n: companies.length }}
        actions={<AdminBackLink />}
      />
      <EmpresasClient companies={companies} />
    </div>
  )
}
