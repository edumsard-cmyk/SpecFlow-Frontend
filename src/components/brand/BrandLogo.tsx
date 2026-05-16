'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Arte da marca na sidebar (`public/brand`). */
export const SPEC_FLOW_LOGO_SIDEBAR_SRC = '/brand/specflow-sidebar-logo.png'

/** Fundo da arte na PNG (amostrado nas bordas do ficheiro). */
export const SPEC_FLOW_BRAND_SURFACE_HEX = '#09194a'

type BrandLogoProps = {
  href?: string | null
  onNavigate?: () => void
  linkClassName?: string
  priority?: boolean
}

export default function BrandLogo({
  href = '/dashboard',
  onNavigate,
  linkClassName,
  priority,
}: BrandLogoProps) {
  const resolvedHref = href === null ? null : href

  const inner = (
    <span className="inline-flex items-center justify-start bg-transparent min-w-0 w-full px-0 py-0.5">
      <Image
        src={SPEC_FLOW_LOGO_SIDEBAR_SRC}
        alt="SpecFlow"
        width={1024}
        height={1024}
        unoptimized
        className="object-contain object-left h-auto max-h-[100px] w-auto max-w-[210px]"
        priority={priority}
        sizes="(max-width: 1024px) 210px, 210px"
      />
    </span>
  )

  if (!resolvedHref) {
    return inner
  }

  return (
    <Link
      href={resolvedHref}
      onClick={onNavigate}
      className={cn(
        'outline-none shrink min-w-0 rounded-lg transition-opacity duration-150 hover:opacity-[0.92]',
        'focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-white/70',
        linkClassName
      )}
    >
      {inner}
    </Link>
  )
}
