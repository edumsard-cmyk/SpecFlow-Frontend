'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Arte da marca na sidebar (`public/brand`) — fundo transparente. */
export const SPEC_FLOW_LOGO_SIDEBAR_SRC = '/brand/specflow-sidebar-logo.png'

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
    <span className="inline-flex items-center justify-start bg-transparent min-w-0 w-full">
      <Image
        src={SPEC_FLOW_LOGO_SIDEBAR_SRC}
        alt="SpecFlow — Da ideia ao uso, sem ruído"
        width={695}
        height={592}
        unoptimized
        className="object-contain object-left h-auto w-auto max-h-[4.5rem] max-w-[13rem]"
        priority={priority}
        sizes="208px"
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
