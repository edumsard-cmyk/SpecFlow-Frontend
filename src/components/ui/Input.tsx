import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, suffix, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[#374151]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-describedby={error && id ? `${id}-error` : undefined}
            aria-invalid={!!error}
            className={cn(
              'w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF]',
              'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]',
              'disabled:bg-[#F9FAFB] disabled:cursor-not-allowed',
              error && 'border-[#EF4444] focus:ring-[#EF4444]',
              !!icon && 'pl-10',
              !!suffix && 'pr-10',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </span>
          )}
        </div>
        {error && <p id={id ? `${id}-error` : undefined} role="alert" className="text-xs text-[#EF4444]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
