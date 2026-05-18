'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Button from '@/components/ui/Button'
import AuthBrandHeader from '@/components/auth/AuthBrandHeader'

function ConfirmacaoEmailContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (error) {
    return (
      <>
        <AuthBrandHeader />
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#111827] mb-2">Não foi possível confirmar</h1>
          <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
            O link pode ter expirado ou já foi usado. Tente criar a conta novamente ou entre em contacto com o suporte.
          </p>
          <Link href="/login">
            <Button className="w-full" size="lg">
              Ir para o login
            </Button>
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <AuthBrandHeader />
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#111827] mb-2">E-mail confirmado</h1>
        <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
          A sua conta SpecFlow está ativa. Pode entrar e começar a transformar demandas em especificações.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full" size="lg">
              Ir para o painel
            </Button>
          </Link>
          <Link href="/login" className="text-sm text-[#1D4ED8] font-medium hover:underline">
            Ou entrar com e-mail e senha
          </Link>
        </div>
      </div>
    </>
  )
}

export default function ConfirmacaoEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center text-sm text-[#6B7280]">
          A confirmar…
        </div>
      }
    >
      <ConfirmacaoEmailContent />
    </Suspense>
  )
}
