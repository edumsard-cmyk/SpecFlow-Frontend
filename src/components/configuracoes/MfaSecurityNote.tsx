'use client'

/**
 * O SDK local pode não expor `auth.mfa` em todos os ambientes.
 * Orientação para habilitar 2FA via Supabase e fluxo TOTP no painel do provedor.
 */
export default function MfaSecurityNote() {
  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-5 text-sm text-[#92400E]">
      <h2 className="font-semibold text-[#78350F] mb-2">Autenticação em duas etapas (2FA)</h2>
      <p className="mb-3 leading-relaxed">
        No painel do Supabase, em <strong>Authentication → Providers</strong>, você pode reforçar políticas
        de senha e, quando disponível para o seu plano/SDK, ativar fatores TOTP (aplicativo autenticador)
        para usuários. O fluxo completo de cadastro de TOTP no app depende da versão do{' '}
        <code className="text-xs bg-white/60 px-1 rounded">@supabase/supabase-js</code> e das configurações
        do projeto.
      </p>
      <p className="text-xs text-[#A16207]">
        Documentação:{' '}
        <a
          href="https://supabase.com/docs/guides/auth/auth-mfa"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium text-[#B45309]"
        >
          supabase.com/docs/guides/auth/auth-mfa
        </a>
      </p>
    </div>
  )
}
