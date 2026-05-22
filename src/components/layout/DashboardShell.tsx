'use client'

import { useState } from 'react'
import { useI18n } from '@/components/i18n/I18nProvider'
import HelpCenterDrawer from '@/components/help/HelpCenterDrawer'
import HelpFab from '@/components/help/HelpFab'
import { HelpCenterProvider } from '@/components/help/HelpCenterContext'
import Sidebar from './Sidebar'
import { type Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardShellProps {
  children: React.ReactNode
  profile: Profile | null
}

function MobileTopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { t } = useI18n()

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0F2460] flex items-center px-4 z-30 shadow-md shadow-[#0F2460]/25 border-b border-white/10">
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label={t('layout.openMenu')}
        className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <span className="text-white font-bold text-base ml-3 truncate">SpecFlow</span>
    </div>
  )
}

function DashboardShellInner({ children, profile }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#EEF2FF] flex">
      <MobileTopBar onMenuOpen={() => setSidebarOpen(true)} />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} profile={profile} />

      <main
        className="flex-1 lg:ml-60 flex flex-col min-h-screen overflow-x-hidden pt-14 lg:pt-0 pb-20 lg:pb-6"
        id="main-content"
      >
        {children}
      </main>
      <HelpFab />
      <HelpCenterDrawer />
    </div>
  )
}

export default function DashboardShell(props: DashboardShellProps) {
  return (
    <HelpCenterProvider>
      <DashboardShellInner {...props} />
    </HelpCenterProvider>
  )
}
