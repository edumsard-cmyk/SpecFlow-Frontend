import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import EmpresasClient from '@/components/admin/EmpresasClient'
import { getCompaniesWithStats } from '@/lib/data/admin'

export default async function EmpresasPage() {
  const companies = await getCompaniesWithStats()

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Empresas"
        subtitle={`${companies.length} empresa${companies.length !== 1 ? 's' : ''} cadastrada${companies.length !== 1 ? 's' : ''}`}
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
      <EmpresasClient companies={companies} />
    </div>
  )
}
