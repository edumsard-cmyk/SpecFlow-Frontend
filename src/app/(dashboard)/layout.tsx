import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <main className="flex-1 ml-60 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
