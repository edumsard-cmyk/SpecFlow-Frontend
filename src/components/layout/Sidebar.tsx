'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition, type SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/actions/auth'
import { getProfileInitials } from '@/lib/utils'
import { type Database } from '@/lib/supabase/types'
import { useI18n } from '@/components/i18n/I18nProvider'
import BrandLogo from '@/components/brand/BrandLogo'
type Profile = Database['public']['Tables']['profiles']['Row']

interface SidebarProps {
  open?: boolean
  onClose?: () => void
  profile: Profile | null
}

const navItems = [
  {
    href: '/dashboard',
    tKey: 'nav.dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: '/projetos',
    tKey: 'nav.projects',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    href: '/projetos/novo',
    tKey: 'nav.newProject',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
]

const settingsNavItem = {
  href: '/configuracoes',
  tKey: 'nav.settings',
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

const adminItems = [
  {
    href: '/admin',
    tKey: 'nav.adminPanel',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    href: '/admin/empresas',
    tKey: 'nav.adminCompanies',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    href: '/admin/usuarios',
    tKey: 'nav.adminUsers',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/auditoria',
    tKey: 'nav.adminAudit',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75a3.375 3.375 0 00-3.375 3.375v1.5c0 .621-.504 1.125-1.125 1.125h-1.5A3.375 3.375 0 003.375 11.625v2.25m15.75 0v1.5a3.375 3.375 0 01-3.375 3.375H5.625a3.375 3.375 0 01-3.375-3.375v-1.5m19.5 0a48.11 48.11 0 01-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
]

function SvgFlagBr(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="30" height="20" rx="2" fill="#009739" />
      <path d="M15 4l9 6-9 6-9-6 9-6z" fill="#FFDF00" />
      <circle cx="15" cy="10" r="4.2" fill="#002776" />
    </svg>
  )
}

function SvgFlagUs(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="30" height="20" rx="2" fill="#B22234" />
      <path
        fill="#fff"
        d="M0 1.54h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0z"
      />
      <rect width="13" height="10.78" fill="#3C3B6E" />
    </svg>
  )
}

function SvgFlagEs(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="30" height="20" rx="2" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </svg>
  )
}

function SidebarContent({
  profile,
  onClose,
  isActive,
  handleLogout,
  isPending,
}: {
  profile: Profile | null
  onClose?: () => void
  isActive: (href: string) => boolean
  handleLogout: () => void
  isPending: boolean
}) {
  const { t, locale, setLocale } = useI18n()
  const displayName = profile?.name ?? 'Usuário'
  const initials = getProfileInitials(displayName)
  const roleKey = profile?.role ? `role.${profile.role}` : 'role.user'
  const roleLabel = t(roleKey)

  const linkClass = (href: string) =>
    cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-white/40',
      isActive(href)
        ? 'bg-[#1D4ED8] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
        : 'text-[#94A3B8] hover:bg-[#1E3A8A]/90 hover:text-white'
    )

  return (
    <aside aria-label="Navegação principal" className="h-full w-60 bg-[#0F2460] flex flex-col border-r border-white/[0.07]">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-2">
        <BrandLogo href="/dashboard" onNavigate={onClose} priority linkClassName="flex-1 min-w-0 w-full" />
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Fechar menu" className="lg:hidden text-[#94A3B8] hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-white/40">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto" aria-label="Menu principal">
        <p className="text-[#475569] text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">{t('nav.menu')}</p>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={linkClass(item.href)}
          >
            {item.icon}
            {t(item.tKey)}
            {isActive(item.href) && item.href !== '/projetos/novo' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#60A5FA]" aria-hidden="true" />
            )}
          </Link>
        ))}

        {profile?.role === 'admin' && (
          <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
            <p className="text-[#475569] text-[10px] font-semibold uppercase tracking-wider px-3">{t('nav.adminSection')}</p>
            <div className="flex flex-col gap-2">
              {adminItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={linkClass(item.href)}
                >
                  {item.icon}
                  {t(item.tKey)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-2 flex-shrink-0">
        <div className="px-3 py-2 space-y-2">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wide block">{t('i18n.language')}</span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setLocale('pt')}
              aria-label={t('i18n.pt')}
              title={t('i18n.pt')}
              className={cn(
                'rounded-md overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2460]',
                locale === 'pt'
                  ? 'border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)] scale-105'
                  : 'border-transparent opacity-75 hover:opacity-100 hover:border-white/30'
              )}
            >
              <SvgFlagBr className="w-9 h-6 block" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              aria-label={t('i18n.en')}
              title={t('i18n.en')}
              className={cn(
                'rounded-md overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2460]',
                locale === 'en'
                  ? 'border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)] scale-105'
                  : 'border-transparent opacity-75 hover:opacity-100 hover:border-white/30'
              )}
            >
              <SvgFlagUs className="w-9 h-6 block" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setLocale('es')}
              aria-label={t('i18n.es')}
              title={t('i18n.es')}
              className={cn(
                'rounded-md overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2460]',
                locale === 'es'
                  ? 'border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)] scale-105'
                  : 'border-transparent opacity-75 hover:opacity-100 hover:border-white/30'
              )}
            >
              <SvgFlagEs className="w-9 h-6 block" aria-hidden />
            </button>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-white/10">
          <p className="text-[10px] text-[#64748B] uppercase tracking-wider px-3 pt-2 pb-1.5">
            {t('nav.configSection')}
          </p>
          <Link
            href={settingsNavItem.href}
            onClick={onClose}
            aria-current={isActive(settingsNavItem.href) ? 'page' : undefined}
            className={linkClass(settingsNavItem.href)}
          >
            {settingsNavItem.icon}
            {t(settingsNavItem.tKey)}
          </Link>
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5 mt-1 border-t border-white/10">
          <div aria-hidden="true" className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{displayName}</p>
            <p className="text-[#64748B] text-[10px] truncate">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            aria-label={t('logout.aria')}
            className="text-[#475569] hover:text-white transition-colors disabled:opacity-50 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function Sidebar({ open = false, onClose, profile }: SidebarProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }
  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/projetos') {
      return pathname === '/projetos' || (pathname.startsWith('/projetos/') && !pathname.startsWith('/projetos/novo'))
    }
    return pathname.startsWith(href)
  }
  const props = { profile, onClose, isActive, handleLogout, isPending }

  return (
    <>
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-60 z-40 shadow-[4px_0_28px_-10px_rgba(15,36,96,0.35)]">
        <SidebarContent {...props} />
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} role="presentation" aria-hidden="true" />
          <div className="relative w-60 flex-shrink-0 shadow-xl">
            <SidebarContent {...props} onClose={onClose} />
          </div>
        </div>
      )}
    </>
  )
}
