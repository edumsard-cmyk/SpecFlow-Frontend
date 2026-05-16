import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-[#1E3A8A] text-white shadow-[0_1px_2px_rgba(15,36,96,0.2)] hover:bg-[#1D4ED8] hover:shadow-[0_4px_14px_-4px_rgba(29,78,216,0.45)] focus:ring-[#3B82F6]',
      secondary:
        'bg-[#7C3AED] text-white shadow-[0_1px_2px_rgba(76,29,149,0.25)] hover:bg-[#6D28D9] hover:shadow-[0_4px_14px_-4px_rgba(124,58,237,0.4)] focus:ring-[#A78BFA]',
      outline:
        'border border-slate-200/95 bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-[#F8FAFC] hover:border-slate-300 focus:ring-[#3B82F6]',
      ghost: 'text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827] focus:ring-[#E5E7EB]',
      danger: 'bg-[#EF4444] text-white hover:bg-red-600 focus:ring-red-400',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
