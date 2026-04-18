'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import { type Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardShellProps {
  children: React.ReactNode
  profile: Profile | null
}

export default function DashboardShell({ children, profile }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0F2460] flex items-center px-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu de navegação"
          className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span className="text-white font-bold text-base ml-3">SpecFlow</span>
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} profile={profile} />

      <main
        className="flex-1 lg:ml-60 flex flex-col min-h-screen overflow-x-hidden pt-14 lg:pt-0"
        id="main-content"
      >
        {children}
      </main>
    </div>
  )
}
