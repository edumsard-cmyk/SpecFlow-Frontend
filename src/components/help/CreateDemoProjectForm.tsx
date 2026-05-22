'use client'

import { createDemoProjectAndRedirectAction } from '@/app/actions/demo-project'

export default function CreateDemoProjectForm() {
  return (
    <form action={createDemoProjectAndRedirectAction}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] hover:opacity-90 rounded-lg transition-opacity shadow-sm"
      >
        Ver projeto de exemplo
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </form>
  )
}
