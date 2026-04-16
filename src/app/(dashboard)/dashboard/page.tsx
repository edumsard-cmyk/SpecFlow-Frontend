import Link from 'next/link'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { STATUS_LABELS } from '@/types'
import { getStatusColor, formatDate } from '@/lib/utils'
import { MOCK_PROJECTS } from '@/lib/mock-data'

const STATS = [
  {
    label: 'Total de Projetos',
    value: '12',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    color: 'bg-blue-50 text-[#1E3A8A]',
    change: '+3 este mês',
  },
  {
    label: 'Em Andamento',
    value: '7',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    color: 'bg-purple-50 text-[#7C3AED]',
    change: '2 perto do prazo',
  },
  {
    label: 'Concluídos',
    value: '5',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-emerald-50 text-[#10B981]',
    change: '+1 essa semana',
  },
  {
    label: 'Histórias Geradas',
    value: '84',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
      </svg>
    ),
    color: 'bg-amber-50 text-[#F59E0B]',
    change: '+12 essa semana',
  },
]

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Dashboard"
        subtitle="Visão geral dos seus projetos"
        actions={
          <Link href="/projetos/novo">
            <Button>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Novo Projeto
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <Card key={stat.label} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#111827] mt-1">{stat.value}</p>
                  <p className="text-xs text-[#10B981] mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#111827]">Projetos Recentes</h2>
            <Link href="/projetos" className="text-sm text-[#1D4ED8] hover:underline font-medium">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {MOCK_PROJECTS.map((project) => (
              <Link key={project.id} href={`/projetos/${project.id}`}>
                <Card hover padding="md" className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-[#111827] truncate">{project.name}</p>
                      <Badge className={getStatusColor(project.status)}>
                        {STATUS_LABELS[project.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6B7280] truncate">{project.description}</p>
                  </div>

                  {/* Progress */}
                  <div className="w-36 flex-shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280]">Progresso</span>
                      <span className="text-xs font-medium text-[#111827]">{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} />
                  </div>

                  {/* Date */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-[#9CA3AF]">{formatDate(project.created_at)}</p>
                    <svg className="w-4 h-4 text-[#D1D5DB] mt-1 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
