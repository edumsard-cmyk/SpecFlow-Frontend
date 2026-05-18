/**
 * URL pública da app (links de e-mail, convites, OAuth).
 * Em produção defina NEXT_PUBLIC_SITE_URL (ex.: https://app.specflow.com.br).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`

  return 'http://localhost:3000'
}

/** Redirect usado no signUp, convites e recuperação de senha. */
export function authCallbackUrl(next = '/confirmacao-email'): string {
  const base = getSiteUrl()
  const path = `/auth/callback?next=${encodeURIComponent(next)}`
  return `${base}${path}`
}
