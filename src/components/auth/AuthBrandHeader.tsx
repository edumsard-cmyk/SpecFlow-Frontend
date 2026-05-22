'use client'

import LandingLogo from '@/components/brand/LandingLogo'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function AuthBrandHeader() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center mb-8">
      <LandingLogo
        className="mb-4 shadow-lg"
        imageClassName="max-h-14 w-auto"
        priority
      />
      <p className="text-[#94A3B8] text-sm mt-1 text-center">{t('auth.login.tagline')}</p>
    </div>
  )
}
