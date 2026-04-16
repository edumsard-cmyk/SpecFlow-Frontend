import Link from 'next/link'
import { type Project, STATUS_LABELS, STATUS_STEPS } from '@/types'
import { getStatusColor, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface ProjectCardProps {
  project: Project
  view?: 'grid' | 'list'
}

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

function StepDots({ status }: { status: Project['status'] }) {
  const currentIndex = STATUS_STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.filter(s => s !== 'done').map((step, i) => (
        <div
          key={step}
          title={STATUS_LABELS[step]}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < currentIndex
              ? 'bg-[#1E3A8A] w-4'
              : i === currentIndex
              ? 'bg-[#7C3AED] w-4'
              : 'bg-[#E5E7EB] w-2'
          }`}
        />
      ))}
    </div>
  )
}

export default function ProjectCard({ project, view = 'grid' }: ProjectCardProps) {
  if (view === 'list') {
    return (
      <Link href={`/projetos/${project.id}`}>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-medium text-[#111827] truncate group-hover:text-[#1D4ED8] transition-colors">{project.name}</p>
              <Badge className={getStatusColor(project.status)}>{STATUS_LABELS[project.status]}</Badge>
            </div>
            <p className="text-sm text-[#6B7280] truncate">{project.description}</p>
          </div>

          <div className="w-40 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <StepDots status={project.status} />
              <span className="text-xs font-medium text-[#111827] ml-2">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} />
          </div>

          <div className="flex-shrink-0 text-right w-24">
            <p className="text-xs text-[#9CA3AF]">{formatDate(project.created_at)}</p>
          </div>

          <svg className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#1D4ED8] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/projetos/${project.id}`}>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer group h-full">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <Badge className={getStatusColor(project.status)}>{STATUS_LABELS[project.status]}</Badge>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-[#111827] mb-1 group-hover:text-[#1D4ED8] transition-colors line-clamp-1">
            {project.name}
          </h3>
          <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed">{project.description}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <StepDots status={project.status} />
            <span className="text-xs font-medium text-[#111827]">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
          <p className="text-xs text-[#9CA3AF]">{formatDate(project.created_at)}</p>
          <span className="text-xs text-[#1D4ED8] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Abrir →
          </span>
        </div>
      </div>
    </Link>
  )
}
