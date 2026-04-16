import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
}

export default function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[#F1F5F9] text-[#475569]',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-sky-100 text-sky-700',
    purple: 'bg-purple-100 text-purple-700',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
