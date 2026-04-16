'use client'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
        {subtitle && <p className="text-sm text-[#6B7280]">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  )
}
