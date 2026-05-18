import LandingLogo from '@/components/brand/LandingLogo'

export default function AuthBrandHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <LandingLogo
        className="mb-4 shadow-lg"
        imageClassName="max-h-14 w-auto"
        priority
      />
      <p className="text-[#94A3B8] text-sm mt-1 text-center">Da ideia ao uso, sem ruído.</p>
    </div>
  )
}
