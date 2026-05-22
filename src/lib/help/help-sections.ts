export const HELP_SECTION_IDS = [
  'gettingStarted',
  'dashboard',
  'projects',
  'newProject',
  'briefing',
  'specification',
  'refinement',
  'conclusion',
  'manual',
  'export',
  'settings',
] as const

export type HelpSectionId = (typeof HELP_SECTION_IDS)[number]

export function defaultHelpSection(pathname: string): HelpSectionId {
  if (pathname.startsWith('/projetos/novo')) return 'newProject'
  if (pathname.startsWith('/configuracoes')) return 'settings'
  if (pathname === '/projetos' || pathname.startsWith('/projetos/')) return 'briefing'
  if (pathname === '/dashboard') return 'dashboard'
  return 'gettingStarted'
}
