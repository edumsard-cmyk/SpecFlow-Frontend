'use client'

import Link from 'next/link'
import CreateDemoProjectForm from '@/components/help/CreateDemoProjectForm'
import PublicPageHeader from '@/components/i18n/PublicPageHeader'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function AjudaPageClient() {
  const { t } = useI18n()

  const guideSteps = [1, 2, 3, 4, 5].map(n => ({
    n,
    title: t(`helpPage.guide.${n}.title`),
    body: t(`helpPage.guide.${n}.body`),
  }))

  const faq = [1, 2, 3, 4, 5, 6].map(n => ({
    q: t(`helpPage.faq.${n}.q`),
    a: t(`helpPage.faq.${n}.a`),
  }))

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <PublicPageHeader current="help" />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">{t('helpPage.title')}</h1>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
          {t('helpPage.intro')}{' '}
          <Link href="/configuracoes" className="text-[#1E3A8A] font-medium hover:underline">
            {t('helpPage.introSettings')}
          </Link>{' '}
          {t('helpPage.introAfter')}
        </p>

        <section
          id="comecar"
          className="rounded-2xl border border-[#E0E7FF] bg-white p-6 shadow-sm mb-10 scroll-mt-6"
        >
          <h2 className="text-lg font-semibold text-[#111827] mb-1">{t('helpPage.guide.title')}</h2>
          <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">{t('helpPage.guide.intro')}</p>
          <ol className="space-y-5 mb-6">
            {guideSteps.map(step => (
              <li key={step.n} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#EEF2FF] text-[#1E3A8A] text-sm font-bold flex items-center justify-center">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#111827]">{step.title}</h3>
                  <p className="text-sm text-[#374151] mt-1 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F1F5F9]">
            <CreateDemoProjectForm />
            <Link href="/login" className="text-sm font-medium text-[#1E3A8A] hover:underline">
              {t('helpPage.loginForDemo')}
            </Link>
            <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#111827]">
              {t('helpPage.goDashboard')}
            </Link>
          </div>
        </section>

        <h2 className="text-base font-semibold text-[#111827] mb-4">{t('helpPage.faqTitle')}</h2>
        <div className="space-y-6">
          {faq.map(item => (
            <section key={item.q} className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-[#111827] mb-2">{item.q}</h3>
              <p className="text-sm text-[#374151] leading-relaxed">{item.a}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-[#6B7280]">
          <Link href="/termos" className="text-[#1E3A8A] hover:underline">
            {t('helpPage.footerTerms')}
          </Link>
          <span className="mx-2 text-[#D1D5DB]">·</span>
          <Link href="/privacidade" className="text-[#1E3A8A] hover:underline">
            {t('helpPage.footerPrivacy')}
          </Link>
        </p>
      </main>
    </div>
  )
}
