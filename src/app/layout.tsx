import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SpecFlow — Da ideia ao uso, sem ruído.',
  description: 'Plataforma que transforma demandas de negócio em especificações completas de sistema.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
