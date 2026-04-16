export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2460] via-[#1E3A8A] to-[#4C1D95] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#3B82F6]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
