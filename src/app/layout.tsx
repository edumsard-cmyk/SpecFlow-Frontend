import type { Metadata } from 'next'
import './globals.css'
import AppProviders from '@/components/providers/AppProviders'

export const metadata: Metadata = {
  title: 'SpecFlow — Da ideia ao uso, sem ruído.',
  description: 'Plataforma que transforma demandas de negócio em especificações completas de sistema.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
