'use client'

import { useI18n } from '@/components/i18n/I18nProvider'
import { useHelpCenter } from '@/components/help/HelpCenterContext'
import { cn } from '@/lib/utils'

export default function HelpFab() {
  const { t } = useI18n()
  const { open, toggleHelp } = useHelpCenter()

  return (
    <div
      className={cn(
        'group fixed z-[55] flex flex-col items-end gap-2 pointer-events-none',
        'bottom-5 right-5 sm:bottom-7 sm:right-7',
        'max-lg:bottom-[4.5rem] max-lg:right-5'
      )}
    >
      {!open && (
        <span
          className={cn(
            'pointer-events-none mr-1 px-2.5 py-1 rounded-md text-xs font-semibold',
            'bg-white text-[#1E3A8A] border border-[#E0E7FF] shadow-md',
            'opacity-0 translate-y-1 transition-all duration-200',
            'group-hover:opacity-100 group-hover:translate-y-0'
          )}
        >
          {t('nav.help')}
        </span>
      )}
      <button
        type="button"
        onClick={toggleHelp}
        aria-label={open ? t('help.close') : t('help.fabOpen')}
        aria-expanded={open}
        className={cn(
          'pointer-events-auto flex items-center justify-center rounded-full',
          'w-14 h-14 sm:w-[3.75rem] sm:h-[3.75rem]',
          'text-white font-bold text-2xl leading-none',
          'border-2 border-white/30',
          'shadow-[0_6px_24px_-4px_rgba(15,36,96,0.45)]',
          'transition-all duration-200 ease-out',
          'hover:scale-105 hover:shadow-[0_10px_32px_-4px_rgba(30,58,138,0.55)]',
          'hover:border-white/50',
          'active:scale-95',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          open
            ? 'bg-[#0F2460] shadow-[0_4px_16px_rgba(15,36,96,0.5)]'
            : 'bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1E3A8A]'
        )}
      >
        {open ? (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span aria-hidden className="select-none drop-shadow-sm">
            ?
          </span>
        )}
      </button>
    </div>
  )
}
