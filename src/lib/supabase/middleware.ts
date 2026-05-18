import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { type Database } from './types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — IMPORTANTE: não remover este await
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/cadastro')
  const isAuthCallbackRoute = pathname.startsWith('/auth/')
  const isConfirmacaoEmailRoute = pathname.startsWith('/confirmacao-email')
  const isResetPasswordRoute = pathname.startsWith('/reset-password')
  const isLegalRoute = pathname.startsWith('/termos') || pathname.startsWith('/privacidade')
  const isForgotPasswordRoute = pathname.startsWith('/esqueci-senha')
  const isHelpRoute = pathname.startsWith('/ajuda')
  const isPublicRoute =
    pathname === '/' ||
    isAuthRoute ||
    isAuthCallbackRoute ||
    isConfirmacaoEmailRoute ||
    isResetPasswordRoute ||
    isLegalRoute ||
    isForgotPasswordRoute ||
    isHelpRoute

  // Redireciona para login se não autenticado em rota protegida
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redireciona para dashboard se já autenticado tentando acessar auth (exceto recuperação de senha)
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Apenas administradores acessam /admin
  const isAdminRoute = pathname.startsWith('/admin')
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
