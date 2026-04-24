import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import EmpresaDetalheClient from '@/components/admin/EmpresaDetalheClient'
import { getCompanyById, getCompanyUsers } from '@/lib/data/admin'
import { createClient } from '@/lib/supabase/server'

export default async function EmpresaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [company, users] = await Promise.all([getCompanyById(id), getCompanyUsers(id)])

  if (!company) notFound()

  const supabase = await createClient()
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', id)

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={company.name}
        subtitle={`/${company.slug} · Criada em ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(company.created_at))}`}
        actions={
          <Link href="/admin/empresas">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Empresas
            </Button>
          </Link>
        }
      />
      <EmpresaDetalheClient company={company} users={users} projectCount={projectCount ?? 0} />
    </div>
  )
}
