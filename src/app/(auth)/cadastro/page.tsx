'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { signup } from '@/app/actions/auth'

export default function CadastroPage() {
  const [error, setError] = useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setNeedsEmailConfirmation(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signup(formData)
      if (result && 'error' in result) {
        setError(result.error)
        return
      }
      if (result && 'needsEmailConfirmation' in result) {
        setNeedsEmailConfirmation(true)
      }
    })
  }

  return (
    <div>
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center mb-4 shadow-lg">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">SpecFlow</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Da ideia ao uso, sem ruído.</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-xl font-semibold text-[#111827] mb-1">Criar conta</h2>
        <p className="text-sm text-[#6B7280] mb-6">Comece a transformar suas demandas em especificações</p>

        {error && (
          <div role="alert" aria-live="polite" className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <svg className="w-4 h-4 text-[#EF4444] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-[#EF4444]">{error}</p>
          </div>
        )}

        {needsEmailConfirmation && (
          <div role="status" aria-live="polite" className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
            <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-emerald-900">
              <p className="font-medium">Conta e empresa criadas.</p>
              <p className="mt-1 text-emerald-800">
                O próximo passo é confirmar o e-mail (caixa de entrada e spam). Depois de confirmar, aceda a{' '}
                <Link href="/login" className="font-medium text-emerald-900 underline underline-offset-2">
                  Entrar
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 ${needsEmailConfirmation ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input id="name" name="name" label="Nome" placeholder="Seu nome" required autoComplete="given-name" />
            <Input id="company" name="company" label="Empresa" placeholder="Nome da empresa" required />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail corporativo"
            placeholder="voce@empresa.com"
            required
            autoComplete="email"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
            autoComplete="new-password"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-[#9CA3AF] hover:text-[#374151] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            }
          />

          <p className="text-xs text-[#9CA3AF]">
            Ao se cadastrar, você concorda com os{' '}
            <Link href="/termos" className="text-[#1D4ED8] hover:underline">
              Termos de Uso
            </Link>
            {' '}e{' '}
            <Link href="/privacidade" className="text-[#1D4ED8] hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>

          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            {!isPending && 'Criar conta gratuita'}
          </Button>
        </form>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-[#1D4ED8] font-medium hover:underline">
            Entrar
          </Link>
        </p>

        <p className="text-center text-xs text-[#94A3B8] mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link href="/ajuda" className="hover:text-[#64748B] transition-colors">
            Ajuda
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/termos" className="hover:text-[#64748B] transition-colors">
            Termos
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacidade" className="hover:text-[#64748B] transition-colors">
            Privacidade
          </Link>
        </p>
      </div>
    </div>
  )
}
