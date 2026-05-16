import Image from 'next/image'
import { cn } from '@/lib/utils'

export const SPEC_FLOW_LANDING_LOGO_SRC = '/brand/specflow-landing-logo.png'

type LandingLogoProps = {
  /** Classes no wrapper da imagem */
  className?: string
  /** Classes na própria imagem (altura, etc.) */
  imageClassName?: string
  priority?: boolean
}

/** Marca na landing (`public/brand`). */
export default function LandingLogo({ className, imageClassName, priority }: LandingLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 rounded-md bg-white overflow-hidden',
        className
      )}
    >
      <Image
        src={SPEC_FLOW_LANDING_LOGO_SRC}
        alt="SpecFlow"
        width={1024}
        height={1024}
        unoptimized
        priority={priority}
        className={cn('object-contain object-left h-auto w-auto', imageClassName)}
      />
    </span>
  )
}
