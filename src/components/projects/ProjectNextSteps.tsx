'use client'

import { STATUS_LABELS, STATUS_STEPS, type ProjectStatus } from '@/types'

interface ProjectNextStepsProps {
  status: ProjectStatus
}

/** Checklist compacto do fluxo — ajuda clientes a saber o que falta. */
export default function ProjectNextSteps({ status }: ProjectNextStepsProps) {
  if (status === 'done') return null

  const idx = STATUS_STEPS.indexOf(status)
  const pending = STATUS_STEPS.filter(s => s !== 'done').filter((_, i) => i > idx)

  if (pending.length === 0) return null

  return (
    <div className="rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/60 px-4 py-3">
      <p className="text-xs font-semibold text-[#3730A3] uppercase tracking-wide mb-2">
        Sugestão de próximos passos
      </p>
      <ul className="space-y-1.5">
        {pending.slice(0, 3).map(s => (
          <li key={s} className="flex items-start gap-2 text-sm text-[#4338CA]">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6366F1] flex-shrink-0" />
            <span>
              Avance para <strong>{STATUS_LABELS[s]}</strong> quando a etapa atual estiver satisfatória.
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
