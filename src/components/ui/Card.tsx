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
        'bg-white rounded-xl border border-[#E5E7EB] shadow-sm',
        paddings[padding],
        hover && 'hover:shadow-md hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
