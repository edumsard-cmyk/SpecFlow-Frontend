'use client'

import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 shadow-[0_1px_3px_-1px_rgba(15,36,96,0.06)] flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-[#111827]">{title}</h1>
        {subtitle && <p className="text-sm text-[#64748B] mt-0.5 leading-snug">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  )
}
