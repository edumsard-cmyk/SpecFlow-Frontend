export type Locale = 'pt' | 'en'

export const defaultLocale: Locale = 'pt'

export const dictionaries: Record<Locale, Record<string, string>> = {
  pt: {
    'nav.menu': 'Menu',
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projetos',
    'nav.settings': 'Configurações',
    'nav.help': 'Ajuda',
    'nav.adminSection': 'Admin',
    'nav.adminPanel': 'Painel Admin',
    'nav.adminCompanies': 'Empresas',
    'nav.adminUsers': 'Usuários',
    'nav.adminAudit': 'Auditoria',
    'role.admin': 'Admin',
    'role.company': 'Gestor',
    'role.user': 'Usuário',
    'i18n.language': 'Idioma',
    'i18n.pt': 'Português',
    'i18n.en': 'English',
    'logout.aria': 'Sair da conta',
  },
  en: {
    'nav.menu': 'Menu',
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.settings': 'Settings',
    'nav.help': 'Help',
    'nav.adminSection': 'Admin',
    'nav.adminPanel': 'Admin panel',
    'nav.adminCompanies': 'Companies',
    'nav.adminUsers': 'Users',
    'nav.adminAudit': 'Audit log',
    'role.admin': 'Admin',
    'role.company': 'Manager',
    'role.user': 'User',
    'i18n.language': 'Language',
    'i18n.pt': 'Portuguese',
    'i18n.en': 'English',
    'logout.aria': 'Sign out',
  },
}
