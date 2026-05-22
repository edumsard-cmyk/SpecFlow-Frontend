import { readFileSync } from 'fs'
import { join } from 'path'
import { createAdminClient } from '@/lib/supabase/server'
import { authCallbackUrl, getSiteUrl } from '@/lib/site-url'

type SendResult =
  | { ok: true; channel: 'resend' | 'supabase' }
  | { ok: false; error: string }

function buildConfirmationHtml(confirmationUrl: string, email: string): string {
  const siteUrl = getSiteUrl()
  try {
    const templatePath = join(process.cwd(), 'supabase', 'templates', 'confirmation.html')
    let html = readFileSync(templatePath, 'utf8')
    html = html
      .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, confirmationUrl)
      .replace(/\{\{\s*\.Email\s*\}\}/g, email)
      .replace(/\{\{\s*\.SiteURL\s*\}\}/g, siteUrl)
    return html
  } catch {
    return `<p>Confirme o seu e-mail SpecFlow: <a href="${confirmationUrl}">${confirmationUrl}</a></p>`
  }
}

async function sendViaResend(to: string, html: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  if (!apiKey || !from) {
    return { ok: false, error: 'RESEND não configurado' }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Confirme o seu e-mail — SpecFlow',
      html,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { ok: false, error: body || `Resend HTTP ${res.status}` }
  }
  return { ok: true, channel: 'resend' }
}

async function generateConfirmationLink(
  email: string,
  password?: string
): Promise<{ link?: string; error?: string }> {
  const admin = createAdminClient()
  const redirectTo = authCallbackUrl('/confirmacao-email')

  if (password) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { redirectTo },
    })
    if (error) return { error: error.message }
    const link = data?.properties?.action_link
    if (link) return { link }
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  })
  if (error) return { error: error.message }
  const link = data?.properties?.action_link
  if (!link) return { error: 'Não foi possível gerar o link de confirmação.' }
  return { link }
}

async function sendViaSupabaseAuth(email: string): Promise<SendResult> {
  const admin = createAdminClient()
  const { error } = await admin.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: authCallbackUrl('/confirmacao-email') },
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true, channel: 'supabase' }
}

/**
 * Garante envio do e-mail de confirmação: Resend (se configurado) + fallback Supabase Auth.
 */
export async function sendSignupConfirmationEmail(
  email: string,
  password?: string
): Promise<SendResult> {
  const trimmed = email.trim().toLowerCase()
  if (!trimmed) return { ok: false, error: 'E-mail inválido.' }

  const { link, error: linkError } = await generateConfirmationLink(trimmed, password)
  if (link) {
    const resendResult = await sendViaResend(trimmed, buildConfirmationHtml(link, trimmed))
    if (resendResult.ok) return resendResult
  }

  const supabaseResult = await sendViaSupabaseAuth(trimmed)
  if (supabaseResult.ok) return supabaseResult

  return {
    ok: false,
    error:
      linkError ||
      (supabaseResult.ok ? undefined : supabaseResult.error) ||
      'Não foi possível enviar o e-mail. Configure SMTP no Supabase ou RESEND_API_KEY no servidor.',
  }
}
