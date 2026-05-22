'use client'

import Link from 'next/link'
import { useState, useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useI18n } from '@/components/i18n/I18nProvider'
import { useHelpCenter } from '@/components/help/HelpCenterContext'
import { requestPasswordResetForCurrentUser, logout } from '@/app/actions/auth'
import { updateProfileNameAction } from '@/app/actions/settings'
import { inviteTeamMemberAction } from '@/app/actions/team'
import type { SettingsPageData } from '@/lib/data/settings-page'
import { cn } from '@/lib/utils'

function fill(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
    template
  )
}

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(
      locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR',
      { dateStyle: 'medium' }
    )
  } catch {
    return iso
  }
}

function SettingsSection({
  id,
  title,
  icon,
  children,
}: {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24">
    <Card padding="lg">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F1F5F9]">
        <span className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#1E3A8A] flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
      </div>
      {children}
    </Card>
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{label}</p>
      <p className="text-lg font-semibold text-[#111827] mt-0.5 tabular-nums">{value}</p>
    </div>
  )
}

export default function SettingsPageClient({ data }: { data: SettingsPageData }) {
  const { t, locale, setLocale } = useI18n()
  const { openHelp } = useHelpCenter()
  const router = useRouter()
  const { profile, company, quota, teamMembers, projectCount, supportEmail } = data

  const [name, setName] = useState(profile.name)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [profileErr, setProfileErr] = useState<string | null>(null)
  const [profilePending, startProfile] = useTransition()

  const [resetMsg, setResetMsg] = useState<string | null>(null)
  const [resetErr, setResetErr] = useState<string | null>(null)
  const [resetPending, startReset] = useTransition()

  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)
  const [inviteErr, setInviteErr] = useState<string | null>(null)
  const [invitePending, startInvite] = useTransition()

  const [logoutPending, startLogout] = useTransition()

  const roleKey = `role.${profile.role}`
  const canInvite = profile.role === 'company' && !!profile.company_id
  const dateLocale = locale === 'en' ? 'en' : locale === 'es' ? 'es' : 'pt'

  const saveName = () => {
    setProfileMsg(null)
    setProfileErr(null)
    startProfile(async () => {
      const res = await updateProfileNameAction(name)
      if (res.error) setProfileErr(res.error)
      else {
        setProfileMsg(t('settings.profile.saved'))
        router.refresh()
      }
    })
  }

  const sendReset = () => {
    setResetMsg(null)
    setResetErr(null)
    startReset(async () => {
      const res = await requestPasswordResetForCurrentUser()
      if (res.error) setResetErr(res.error)
      else setResetMsg(t('settings.security.resetSent'))
    })
  }

  const submitInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setInviteMsg(null)
    setInviteErr(null)
    startInvite(async () => {
      const res = await inviteTeamMemberAction(inviteName, inviteEmail)
      if (res.error) setInviteErr(res.error)
      else {
        setInviteMsg(t('settings.team.inviteSent'))
        setInviteName('')
        setInviteEmail('')
        router.refresh()
      }
    })
  }

  const quotaPct =
    quota && !quota.isUnlimited && quota.limit > 0
      ? Math.min(100, Math.round((quota.used / quota.limit) * 100))
      : 0

  const navSections = [
    { id: 'perfil', label: t('settings.section.profile') },
    ...(company ? [{ id: 'empresa', label: t('settings.section.company') }] : []),
    { id: 'plano', label: t('settings.section.plan') },
    { id: 'preferencias', label: t('settings.section.preferences') },
    { id: 'seguranca', label: t('settings.section.security') },
    ...(company ? [{ id: 'equipe', label: t('settings.section.team') }] : []),
    { id: 'ajuda', label: t('settings.section.help') },
    ...(profile.role === 'admin' ? [{ id: 'admin', label: t('settings.section.admin') }] : []),
    { id: 'conta', label: t('settings.section.account') },
  ]

  return (
    <div className="flex-1 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <nav
          aria-label={t('settings.quickLinks')}
          className="flex flex-wrap gap-2 p-3 rounded-xl border border-[#E5E7EB] bg-white"
        >
          {navSections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[#475569] hover:bg-[#EEF2FF] hover:text-[#1E3A8A] transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
          <Link
            href="/dashboard"
            className="text-center text-xs font-medium py-2.5 px-2 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#93C5FD] hover:text-[#1E3A8A] transition-colors"
          >
            {t('settings.link.dashboard')}
          </Link>
          <Link
            href="/projetos"
            className="text-center text-xs font-medium py-2.5 px-2 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#93C5FD] hover:text-[#1E3A8A] transition-colors"
          >
            {t('settings.link.projects')}
          </Link>
          <Link
            href="/projetos/novo"
            className="text-center text-xs font-medium py-2.5 px-2 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#93C5FD] hover:text-[#1E3A8A] transition-colors"
          >
            {t('settings.link.newProject')}
          </Link>
        </div>

        <SettingsSection
          id="perfil"
          title={t('settings.section.profile')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        >
          <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">{t('settings.profile.intro')}</p>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center text-white text-lg font-bold">
              {profile.name
                .split(/\s+/)
                .map(w => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="text-sm text-[#6B7280]">
              <p className="font-medium text-[#111827]">{profile.email}</p>
              <p className="mt-0.5">
                {t('settings.profile.memberSince')}: {formatDate(profile.created_at, dateLocale)}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
            <Input
              id="profile-name"
              label={t('settings.profile.name')}
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
            <div>
              <p className="text-sm font-medium text-[#374151] mb-1.5">{t('settings.profile.role')}</p>
              <p className="text-sm text-[#111827] px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]">
                {t(roleKey)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Button
              type="button"
              size="sm"
              disabled={profilePending || name.trim() === profile.name}
              onClick={saveName}
            >
              {t('settings.profile.save')}
            </Button>
            {profileMsg && <p className="text-sm text-[#059669]">{profileMsg}</p>}
            {profileErr && <p className="text-sm text-[#DC2626]">{profileErr}</p>}
          </div>
        </SettingsSection>

        {company ? (
          <SettingsSection
            id="empresa"
            title={t('settings.section.company')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            }
          >
            <p className="text-sm text-[#6B7280] mb-4">{t('settings.company.intro')}</p>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm mb-4">
              <div>
                <dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">{t('settings.company.name')}</dt>
                <dd className="text-[#111827] font-medium mt-0.5">{company.name}</dd>
              </div>
              <div>
                <dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">{t('settings.company.created')}</dt>
                <dd className="text-[#111827] mt-0.5">{formatDate(company.created_at, dateLocale)}</dd>
              </div>
            </dl>
            <div className="grid grid-cols-2 gap-3">
              <StatPill label={t('settings.company.projects')} value={projectCount} />
              <StatPill label={t('settings.company.members')} value={teamMembers.length} />
            </div>
          </SettingsSection>
        ) : (
          <div id="empresa" className="scroll-mt-24">
          <Card padding="lg" className="border-amber-100 bg-amber-50/50">
            <p className="text-sm text-amber-900">{t('settings.company.noCompany')}</p>
          </Card>
          </div>
        )}

        <SettingsSection
          id="plano"
          title={t('settings.section.plan')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-19.5 5.25h19.5m-19.5 5.25h19.5M3.75 6.75h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5z" />
            </svg>
          }
        >
          <p className="text-sm text-[#6B7280] mb-4">{t('settings.plan.intro')}</p>
          <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#1E3A8A] mb-4">
            {t('settings.plan.free')}
          </span>
          {quota?.isUnlimited ? (
            <p className="text-sm text-[#374151]">{t('settings.plan.unlimited')}</p>
          ) : quota ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#374151] font-medium">
                  {fill(t('settings.plan.used'), { used: quota.used, limit: quota.limit })}
                </span>
                <span className="text-[#6B7280] tabular-nums">{quotaPct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    quotaPct >= 100 ? 'bg-amber-500' : 'bg-[#1E3A8A]'
                  )}
                  style={{ width: `${quotaPct}%` }}
                />
              </div>
              <p className="text-sm text-[#6B7280]">
                {quota.remaining > 0
                  ? fill(t('settings.plan.remaining'), { n: quota.remaining })
                  : t('settings.plan.full')}
              </p>
              {quota.remaining === 0 && (
                <Link href="/projetos" className="text-sm font-medium text-[#1E3A8A] hover:underline">
                  {t('settings.link.projects')} →
                </Link>
              )}
            </div>
          ) : null}
        </SettingsSection>

        <SettingsSection
          id="preferencias"
          title={t('settings.section.preferences')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 3.75 3.75 9.75 9 15l-3.75 6.75z" />
            </svg>
          }
        >
          <p className="text-sm text-[#6B7280] mb-3">{t('settings.prefs.intro')}</p>
          <p className="text-sm font-medium text-[#374151] mb-2">{t('settings.prefs.language')}</p>
          <p className="text-xs text-[#9CA3AF] mb-3">{t('settings.prefs.languageHint')}</p>
          <div className="flex gap-2">
            {(['pt', 'en', 'es'] as const).map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                  locale === l
                    ? 'border-[#1E3A8A] bg-[#EEF2FF] text-[#1E3A8A]'
                    : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#93C5FD]'
                )}
              >
                {l === 'pt' ? t('i18n.pt') : l === 'en' ? t('i18n.en') : t('i18n.es')}
              </button>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          id="seguranca"
          title={t('settings.section.security')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          }
        >
          <p className="text-sm text-[#6B7280] mb-4">{t('settings.security.intro')}</p>
          <div className="rounded-lg border border-[#E5E7EB] p-4 mb-4">
            <h3 className="text-sm font-semibold text-[#374151] mb-1">{t('settings.security.password')}</h3>
            <p className="text-sm text-[#6B7280] mb-3">{t('settings.security.passwordHint')}</p>
            <Button type="button" variant="outline" size="sm" disabled={resetPending} onClick={sendReset}>
              {resetPending ? t('settings.security.sending') : t('settings.security.sendReset')}
            </Button>
            {resetMsg && <p className="mt-3 text-sm text-[#059669]">{resetMsg}</p>}
            {resetErr && <p className="mt-3 text-sm text-[#DC2626]">{resetErr}</p>}
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50/80 p-4 text-sm text-[#92400E]">
            <h3 className="font-semibold text-[#78350F] mb-2">{t('settings.security.mfaTitle')}</h3>
            <p className="leading-relaxed mb-2">{t('settings.security.mfaBody')}</p>
            <a
              href="https://supabase.com/docs/guides/auth/auth-mfa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[#B45309] underline"
            >
              {t('settings.security.mfaLink')}
            </a>
          </div>
        </SettingsSection>

        {company && (
          <SettingsSection
            id="equipe"
            title={t('settings.section.team')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 2.198a5.5 5.5 0 00-5.5-5.5H6.75a5.5 5.5 0 00-5.5 5.5v.75m12-6.75a3 3 0 11-6 0 3 3 0 016 0zM6.75 7.5a3 3 0 116 0 3 3 0 01-6 0z" />
              </svg>
            }
          >
            <p className="text-sm text-[#6B7280] mb-4">{t('settings.team.intro')}</p>
            <p className="text-sm font-semibold text-[#374151] mb-3">
              {fill(t('settings.team.listTitle'), { n: teamMembers.length })}
            </p>
            <ul className="divide-y divide-[#F1F5F9] border border-[#E5E7EB] rounded-lg mb-6 overflow-hidden">
              {teamMembers.map(m => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-white text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-[#111827] truncate">
                      {m.name}
                      {m.isYou && (
                        <span className="ml-2 text-[10px] font-semibold uppercase text-[#1E3A8A] bg-[#EEF2FF] px-1.5 py-0.5 rounded">
                          {t('settings.profile.you')}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate">{m.email}</p>
                  </div>
                  <span className="text-xs text-[#6B7280] flex-shrink-0">{t(`role.${m.role}`)}</span>
                </li>
              ))}
            </ul>

            {canInvite ? (
              <div className="rounded-lg border border-[#E0E7FF] bg-[#F8FAFF] p-4">
                <h3 className="text-sm font-semibold text-[#1E3A8A] mb-1">{t('settings.team.inviteTitle')}</h3>
                <p className="text-sm text-[#6B7280] mb-4">{t('settings.team.inviteHint')}</p>
                <form onSubmit={submitInvite} className="space-y-3 max-w-md">
                  <Input
                    id="invite-name"
                    label={t('settings.profile.name')}
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                    required
                  />
                  <Input
                    id="invite-email"
                    type="email"
                    label={t('settings.profile.email')}
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" size="sm" disabled={invitePending}>
                    {invitePending ? t('settings.security.sending') : t('settings.team.inviteSend')}
                  </Button>
                  {inviteMsg && <p className="text-sm text-[#059669]">{inviteMsg}</p>}
                  {inviteErr && <p className="text-sm text-[#DC2626]">{inviteErr}</p>}
                </form>
              </div>
            ) : (
              <p className="text-xs text-[#9CA3AF]">{t('settings.team.onlyManager')}</p>
            )}
          </SettingsSection>
        )}

        <SettingsSection
          id="ajuda"
          title={t('settings.section.help')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          }
        >
          <p className="text-sm text-[#6B7280] mb-4">{t('settings.help.intro')}</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" size="sm" onClick={openHelp}>
              {t('settings.help.center')}
            </Button>
            <Link href="/ajuda#comecar">
              <Button type="button" variant="ghost" size="sm">
                {t('settings.help.guide')}
              </Button>
            </Link>
          </div>
          {supportEmail ? (
            <p className="mt-4 text-sm text-[#374151]">
              {t('settings.help.support')}:{' '}
              <a href={`mailto:${supportEmail}`} className="text-[#1E3A8A] font-medium hover:underline break-all">
                {supportEmail}
              </a>
            </p>
          ) : (
            <p className="mt-4 text-xs text-[#9CA3AF]">{t('settings.help.supportMissing')}</p>
          )}
        </SettingsSection>

        {profile.role === 'admin' && (
          <SettingsSection
            id="admin"
            title={t('settings.section.admin')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            }
          >
            <p className="text-sm text-[#6B7280] mb-4">{t('settings.admin.intro')}</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/usuarios">
                <Button variant="outline" size="sm">
                  {t('settings.admin.users')}
                </Button>
              </Link>
              <Link href="/admin/empresas">
                <Button variant="outline" size="sm">
                  {t('settings.admin.companies')}
                </Button>
              </Link>
              <Link href="/admin/auditoria">
                <Button variant="outline" size="sm">
                  {t('settings.admin.audit')}
                </Button>
              </Link>
            </div>
          </SettingsSection>
        )}

        <SettingsSection
          id="conta"
          title={t('settings.section.account')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          }
        >
          <p className="text-sm text-[#6B7280] mb-4">{t('settings.account.logoutHint')}</p>
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={logoutPending}
            onClick={() => startLogout(() => logout())}
          >
            {t('settings.account.logout')}
          </Button>
          <p className="mt-6 text-xs text-[#9CA3AF] flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/termos" className="text-[#1E3A8A] hover:underline">
              {t('settings.footer.terms')}
            </Link>
            <span aria-hidden>·</span>
            <Link href="/privacidade" className="text-[#1E3A8A] hover:underline">
              {t('settings.footer.privacy')}
            </Link>
          </p>
        </SettingsSection>
      </div>
    </div>
  )
}
