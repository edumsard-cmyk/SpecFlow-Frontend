import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export default function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/85 shadow-[0_2px_8px_-2px_rgba(15,36,96,0.07),0_1px_2px_-1px_rgba(15,23,42,0.04)]',
        paddings[padding],
        hover &&
          'hover:shadow-[0_12px_32px_-12px_rgba(15,36,96,0.12)] hover:border-slate-300/90 hover:-translate-y-px transition-all duration-200 ease-out cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
