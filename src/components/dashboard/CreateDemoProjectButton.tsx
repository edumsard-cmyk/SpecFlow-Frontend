'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { createDemoProjectAction } from '@/app/actions/demo-project'
import { useI18n } from '@/components/i18n/I18nProvider'

type Variant = 'primary' | 'outline'

export default function CreateDemoProjectButton({
  variant = 'outline',
  size = 'sm',
  className,
  existingDemoProjectId,
}: {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  className?: string
  existingDemoProjectId?: string | null
}) {
  const { t } = useI18n()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleClick = () => {
    if (existingDemoProjectId) {
      router.push(`/projetos/${existingDemoProjectId}`)
      return
    }
    setError(null)
    startTransition(async () => {
      const res = await createDemoProjectAction()
      if (res.error) {
        setError(res.error)
        return
      }
      if (res.projectId) {
        router.push(`/projetos/${res.projectId}`)
      }
    })
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        size={size}
        loading={pending}
        onClick={handleClick}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        {existingDemoProjectId ? t('demo.openExisting') : t('demo.create')}
      </Button>
      {error && (
        <p className="text-xs text-[#DC2626] mt-2 max-w-xs">{error}</p>
      )}
    </div>
  )
}
