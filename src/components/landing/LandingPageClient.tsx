'use client'

import Link from 'next/link'
import LandingLogo from '@/components/brand/LandingLogo'
import PublicLocaleSwitcher from '@/components/i18n/PublicLocaleSwitcher'
import { useI18n } from '@/components/i18n/I18nProvider'

const HOW_ICONS = [
  (
    <svg key="1" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  (
    <svg key="2" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  (
    <svg key="3" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  (
    <svg key="4" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  (
    <svg key="5" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
]

const HOW_COLORS = [
  'from-blue-500 to-blue-600',
  'from-indigo-500 to-indigo-600',
  'from-emerald-500 to-emerald-600',
  'from-violet-500 to-violet-600',
  'from-rose-500 to-rose-600',
]

const BENEFIT_COLORS = [
  'bg-blue-50 text-[#1E3A8A]',
  'bg-violet-50 text-[#7C3AED]',
  'bg-emerald-50 text-[#10B981]',
]

export default function LandingPageClient() {
  const { t } = useI18n()

  const previewTabs = [
    t('status.briefing'),
    t('status.specification'),
    t('status.refinement'),
    t('status.conclusion'),
    t('status.manual'),
  ]

  const previewStories = [1, 2, 3, 4].map(n => ({
    code: `US-0${n}`,
    title: t(`landing.preview.story${n}.title`),
    desc: t(`landing.preview.story${n}.desc`),
  }))

  const howSteps = [1, 2, 3, 4, 5].map((n, i) => ({
    step: String(n).padStart(2, '0'),
    title: t(`landing.how.${n}.title`),
    desc: t(`landing.how.${n}.desc`),
    color: HOW_COLORS[i],
    icon: HOW_ICONS[i],
  }))

  const benefits = [1, 2, 3].map((n, i) => ({
    title: t(`landing.benefits.${n}.title`),
    desc: t(`landing.benefits.${n}.desc`),
    stat: t(`landing.benefits.${n}.stat`),
    statLabel: t(`landing.benefits.${n}.statLabel`),
    color: BENEFIT_COLORS[i],
  }))

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[5.5rem] flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center min-w-0 outline-none rounded-md focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2"
          >
            <LandingLogo
              priority
              imageClassName="max-h-16 sm:max-h-[5rem] w-auto max-w-[min(100vw-11rem,380px)] sm:max-w-[440px]"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <PublicLocaleSwitcher />
            <Link href="/ajuda" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors px-2 sm:px-3 py-2">
              {t('landing.nav.help')}
            </Link>
            <Link href="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors px-2 sm:px-3 py-2">
              {t('landing.nav.login')}
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1D4ED8] rounded-lg transition-colors"
            >
              {t('landing.nav.signup')}
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-36 sm:pt-40 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-[#1E3A8A] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            {t('landing.hero.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] leading-tight mb-6">
            {t('landing.hero.titlePrefix')}{' '}
            <span className="bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] bg-clip-text text-transparent">
              {t('landing.hero.titleHighlight')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] hover:opacity-90 rounded-xl transition-opacity shadow-lg shadow-blue-200"
            >
              {t('landing.hero.ctaPrimary')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-[#374151] bg-white border border-[#E5E7EB] hover:border-[#93C5FD] hover:bg-[#F8FAFC] rounded-xl transition-all"
            >
              {t('landing.hero.ctaSecondary')}
            </Link>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-4">{t('landing.hero.footnote')}</p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#E5E7EB] shadow-2xl shadow-slate-200 overflow-hidden">
            <div className="bg-[#F1F5F9] border-b border-[#E5E7EB] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-[#9CA3AF] text-center max-w-xs mx-auto">
                  {t('landing.preview.url')}
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFC] p-6">
              <div className="flex gap-4 mb-4 overflow-x-auto pb-1">
                {previewTabs.map((tab, i) => (
                  <div
                    key={tab}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      i === 1 ? 'bg-[#1E3A8A] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {previewStories.map(story => (
                  <div key={story.code} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">{story.code}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#111827] mb-1">{story.title}</p>
                    <p className="text-xs text-[#6B7280] leading-relaxed">{story.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#111827] mb-3">{t('landing.how.title')}</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">{t('landing.how.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {howSteps.map(item => (
              <div key={item.step} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4`}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-[#9CA3AF] mb-1">
                  {t('landing.how.stepLabel')} {item.step}
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#111827] mb-3">{t('landing.benefits.title')}</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">{t('landing.benefits.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map(b => (
              <div key={b.title} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold mb-4 ${b.color}`}>
                  {b.stat}
                </div>
                <p className={`text-xs font-medium mb-4 ${b.color.split(' ')[1]}`}>{b.statLabel}</p>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{b.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{t('landing.cta.title')}</h2>
            <p className="text-blue-200 mb-8 text-lg">{t('landing.cta.subtitle')}</p>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#1E3A8A] bg-white hover:bg-blue-50 rounded-xl transition-colors shadow-lg"
            >
              {t('landing.cta.button')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <p className="text-xs text-blue-300 mt-4">{t('landing.cta.footnote')}</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E7EB] py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center outline-none rounded-md focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2">
            <LandingLogo imageClassName="max-h-14 sm:max-h-16 max-w-[300px] sm:max-w-[340px]" />
          </Link>
          <p className="text-sm text-[#9CA3AF]">
            © {new Date().getFullYear()} SpecFlow. {t('landing.footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
            <Link href="/ajuda" className="hover:text-[#111827] transition-colors">{t('landing.nav.help')}</Link>
            <Link href="/login" className="hover:text-[#111827] transition-colors">{t('landing.nav.login')}</Link>
            <Link href="/cadastro" className="hover:text-[#111827] transition-colors">{t('layout.publicSignup')}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
