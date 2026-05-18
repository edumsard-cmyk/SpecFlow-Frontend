import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

/**
 * Troca o `code` do e-mail de confirmação (e outros fluxos) por sessão
 * e redireciona para a app no domínio correto (NEXT_PUBLIC_SITE_URL).
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/confirmacao-email'
  const siteUrl = getSiteUrl()

  if (!code) {
    return NextResponse.redirect(
      `${siteUrl}/confirmacao-email?error=${encodeURIComponent('missing_code')}`
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      `${siteUrl}/confirmacao-email?error=${encodeURIComponent(error.message)}`
    )
  }

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/confirmacao-email'
  return NextResponse.redirect(`${siteUrl}${safeNext}`)
}
