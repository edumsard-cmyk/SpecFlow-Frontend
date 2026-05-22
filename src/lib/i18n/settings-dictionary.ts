import type { Locale } from '@/lib/i18n/dictionaries'

export const settingsDictionary: Record<Locale, Record<string, string>> = {
  pt: {
    'settings.title': 'Configurações',
    'settings.subtitle': 'Conta, empresa, preferências e segurança',
    'settings.section.profile': 'Perfil',
    'settings.section.company': 'Empresa',
    'settings.section.plan': 'Plano e uso',
    'settings.section.preferences': 'Preferências',
    'settings.section.security': 'Segurança',
    'settings.section.team': 'Equipe',
    'settings.section.help': 'Ajuda e suporte',
    'settings.section.account': 'Conta',
    'settings.section.admin': 'Administração',

    'settings.profile.intro': 'Dados da sua conta no SpecFlow. O e-mail é o usado no login.',
    'settings.profile.name': 'Nome',
    'settings.profile.email': 'E-mail',
    'settings.profile.role': 'Função',
    'settings.profile.memberSince': 'Membro desde',
    'settings.profile.save': 'Salvar nome',
    'settings.profile.saved': 'Nome atualizado.',
    'settings.profile.you': 'Você',

    'settings.company.intro': 'Organização à qual seus projetos estão vinculados.',
    'settings.company.name': 'Nome da empresa',
    'settings.company.slug': 'Identificador',
    'settings.company.created': 'Criada em',
    'settings.company.projects': 'Projetos',
    'settings.company.members': 'Membros',
    'settings.company.noCompany': 'Sua conta ainda não está vinculada a uma empresa. Contacte o administrador.',

    'settings.plan.intro': 'Uso do plano gratuito da sua organização.',
    'settings.plan.unlimited': 'Conta de administrador da plataforma — sem limite por empresa.',
    'settings.plan.used': '{{used}} de {{limit}} projetos',
    'settings.plan.remaining': '{{n}} vaga(s) disponível(is)',
    'settings.plan.full': 'Limite atingido — apague um projeto ou fale connosco para ampliar.',
    'settings.plan.free': 'Plano gratuito',

    'settings.prefs.intro': 'Ajustes da interface no seu navegador.',
    'settings.prefs.language': 'Idioma da interface',
    'settings.prefs.languageHint': 'Afeta menus, botões e textos do painel.',

    'settings.security.intro': 'Proteja o acesso à sua conta.',
    'settings.security.password': 'Senha',
    'settings.security.passwordHint':
      'Receba um link por e-mail para definir uma nova senha (página segura).',
    'settings.security.sendReset': 'Enviar link para redefinir senha',
    'settings.security.sending': 'Enviando…',
    'settings.security.resetSent':
      'Enviamos um link para o seu e-mail. Verifique a caixa de entrada e o spam.',
    'settings.security.mfaTitle': 'Autenticação em duas etapas (2FA)',
    'settings.security.mfaBody':
      'No painel do Supabase (Authentication → Providers) é possível reforçar políticas de senha e, conforme o plano, ativar TOTP com aplicativo autenticador.',
    'settings.security.mfaLink': 'Documentação Supabase MFA',

    'settings.team.intro': 'Pessoas com acesso aos projetos da mesma empresa.',
    'settings.team.inviteTitle': 'Convidar colaborador',
    'settings.team.inviteHint':
      'A pessoa recebe um e-mail para aceitar o convite e definir a senha.',
    'settings.team.inviteSend': 'Enviar convite',
    'settings.team.inviteSent': 'Convite enviado com sucesso.',
    'settings.team.listTitle': 'Membros ({{n}})',
    'settings.team.onlyManager': 'Apenas gestores da empresa podem enviar convites.',

    'settings.help.intro': 'Guias e contacto para dúvidas sobre o fluxo SpecFlow.',
    'settings.help.center': 'Abrir central de ajuda',
    'settings.help.guide': 'Guia completo (5 min + FAQ)',
    'settings.help.support': 'E-mail de suporte',
    'settings.help.supportMissing':
      'Defina NEXT_PUBLIC_SUPPORT_EMAIL no deploy para exibir o contacto aqui.',

    'settings.admin.intro': 'Ferramentas globais da plataforma SpecFlow.',
    'settings.admin.users': 'Gerir usuários',
    'settings.admin.companies': 'Empresas',
    'settings.admin.audit': 'Auditoria',

    'settings.account.logout': 'Sair da conta',
    'settings.account.logoutHint': 'Encerra a sessão neste dispositivo.',
    'settings.quickLinks': 'Atalhos',

    'settings.link.dashboard': 'Dashboard',
    'settings.link.projects': 'Projetos',
    'settings.link.newProject': 'Nova demanda',
    'settings.footer.terms': 'Termos de uso',
    'settings.footer.privacy': 'Privacidade',
  },

  en: {
    'settings.title': 'Settings',
    'settings.subtitle': 'Account, company, preferences and security',
    'settings.section.profile': 'Profile',
    'settings.section.company': 'Company',
    'settings.section.plan': 'Plan and usage',
    'settings.section.preferences': 'Preferences',
    'settings.section.security': 'Security',
    'settings.section.team': 'Team',
    'settings.section.help': 'Help and support',
    'settings.section.account': 'Account',
    'settings.section.admin': 'Administration',

    'settings.profile.intro': 'Your SpecFlow account details. Email is used to sign in.',
    'settings.profile.name': 'Name',
    'settings.profile.email': 'Email',
    'settings.profile.role': 'Role',
    'settings.profile.memberSince': 'Member since',
    'settings.profile.save': 'Save name',
    'settings.profile.saved': 'Name updated.',
    'settings.profile.you': 'You',

    'settings.company.intro': 'Organization your projects belong to.',
    'settings.company.name': 'Company name',
    'settings.company.slug': 'Identifier',
    'settings.company.created': 'Created on',
    'settings.company.projects': 'Projects',
    'settings.company.members': 'Members',
    'settings.company.noCompany': 'Your account is not linked to a company yet. Contact an administrator.',

    'settings.plan.intro': 'Free plan usage for your organization.',
    'settings.plan.unlimited': 'Platform admin account — no per-company limit.',
    'settings.plan.used': '{{used}} of {{limit}} projects',
    'settings.plan.remaining': '{{n}} slot(s) available',
    'settings.plan.full': 'Limit reached — delete a project or contact us to upgrade.',
    'settings.plan.free': 'Free plan',

    'settings.prefs.intro': 'Interface settings in your browser.',
    'settings.prefs.language': 'Interface language',
    'settings.prefs.languageHint': 'Affects menus, buttons and panel copy.',

    'settings.security.intro': 'Protect access to your account.',
    'settings.security.password': 'Password',
    'settings.security.passwordHint':
      'Receive an email link to set a new password (secure page).',
    'settings.security.sendReset': 'Send password reset link',
    'settings.security.sending': 'Sending…',
    'settings.security.resetSent':
      'We sent a link to your email. Check inbox and spam.',
    'settings.security.mfaTitle': 'Two-factor authentication (2FA)',
    'settings.security.mfaBody':
      'In the Supabase dashboard (Authentication → Providers) you can tighten password policies and enable TOTP with an authenticator app when available on your plan.',
    'settings.security.mfaLink': 'Supabase MFA documentation',

    'settings.team.intro': 'People with access to the same company projects.',
    'settings.team.inviteTitle': 'Invite teammate',
    'settings.team.inviteHint': 'They receive an email to accept and set a password.',
    'settings.team.inviteSend': 'Send invite',
    'settings.team.inviteSent': 'Invite sent successfully.',
    'settings.team.listTitle': 'Members ({{n}})',
    'settings.team.onlyManager': 'Only company managers can send invites.',

    'settings.help.intro': 'Guides and contact for SpecFlow workflow questions.',
    'settings.help.center': 'Open help center',
    'settings.help.guide': 'Full guide (5 min + FAQ)',
    'settings.help.support': 'Support email',
    'settings.help.supportMissing':
      'Set NEXT_PUBLIC_SUPPORT_EMAIL in deploy to show contact here.',

    'settings.admin.intro': 'Global SpecFlow platform tools.',
    'settings.admin.users': 'Manage users',
    'settings.admin.companies': 'Companies',
    'settings.admin.audit': 'Audit log',

    'settings.account.logout': 'Sign out',
    'settings.account.logoutHint': 'Ends the session on this device.',
    'settings.quickLinks': 'Shortcuts',

    'settings.link.dashboard': 'Dashboard',
    'settings.link.projects': 'Projects',
    'settings.link.newProject': 'New project',
    'settings.footer.terms': 'Terms of use',
    'settings.footer.privacy': 'Privacy',
  },

  es: {
    'settings.title': 'Configuración',
    'settings.subtitle': 'Cuenta, empresa, preferencias y seguridad',
    'settings.section.profile': 'Perfil',
    'settings.section.company': 'Empresa',
    'settings.section.plan': 'Plan y uso',
    'settings.section.preferences': 'Preferencias',
    'settings.section.security': 'Seguridad',
    'settings.section.team': 'Equipo',
    'settings.section.help': 'Ayuda y soporte',
    'settings.section.account': 'Cuenta',
    'settings.section.admin': 'Administración',

    'settings.profile.intro': 'Datos de su cuenta en SpecFlow. El correo se usa para iniciar sesión.',
    'settings.profile.name': 'Nombre',
    'settings.profile.email': 'Correo',
    'settings.profile.role': 'Función',
    'settings.profile.memberSince': 'Miembro desde',
    'settings.profile.save': 'Guardar nombre',
    'settings.profile.saved': 'Nombre actualizado.',
    'settings.profile.you': 'Usted',

    'settings.company.intro': 'Organización a la que pertenecen sus proyectos.',
    'settings.company.name': 'Nombre de la empresa',
    'settings.company.slug': 'Identificador',
    'settings.company.created': 'Creada el',
    'settings.company.projects': 'Proyectos',
    'settings.company.members': 'Miembros',
    'settings.company.noCompany':
      'Su cuenta aún no está vinculada a una empresa. Contacte al administrador.',

    'settings.plan.intro': 'Uso del plan gratuito de su organización.',
    'settings.plan.unlimited': 'Cuenta de administrador de la plataforma — sin límite por empresa.',
    'settings.plan.used': '{{used}} de {{limit}} proyectos',
    'settings.plan.remaining': '{{n}} plaza(s) disponible(s)',
    'settings.plan.full': 'Límite alcanzado — elimine un proyecto o contáctenos para ampliar.',
    'settings.plan.free': 'Plan gratuito',

    'settings.prefs.intro': 'Ajustes de la interfaz en su navegador.',
    'settings.prefs.language': 'Idioma de la interfaz',
    'settings.prefs.languageHint': 'Afecta menús, botones y textos del panel.',

    'settings.security.intro': 'Proteja el acceso a su cuenta.',
    'settings.security.password': 'Contraseña',
    'settings.security.passwordHint':
      'Reciba un enlace por correo para definir una nueva contraseña (página segura).',
    'settings.security.sendReset': 'Enviar enlace para restablecer contraseña',
    'settings.security.sending': 'Enviando…',
    'settings.security.resetSent':
      'Enviamos un enlace a su correo. Revise la bandeja de entrada y spam.',
    'settings.security.mfaTitle': 'Autenticación en dos pasos (2FA)',
    'settings.security.mfaBody':
      'En el panel de Supabase (Authentication → Providers) puede reforzar políticas de contraseña y activar TOTP con app autenticadora según su plan.',
    'settings.security.mfaLink': 'Documentación Supabase MFA',

    'settings.team.intro': 'Personas con acceso a los proyectos de la misma empresa.',
    'settings.team.inviteTitle': 'Invitar colaborador',
    'settings.team.inviteHint': 'Recibirá un correo para aceptar y definir la contraseña.',
    'settings.team.inviteSend': 'Enviar invitación',
    'settings.team.inviteSent': 'Invitación enviada con éxito.',
    'settings.team.listTitle': 'Miembros ({{n}})',
    'settings.team.onlyManager': 'Solo los gestores de la empresa pueden enviar invitaciones.',

    'settings.help.intro': 'Guías y contacto para dudas sobre el flujo SpecFlow.',
    'settings.help.center': 'Abrir centro de ayuda',
    'settings.help.guide': 'Guía completa (5 min + FAQ)',
    'settings.help.support': 'Correo de soporte',
    'settings.help.supportMissing':
      'Defina NEXT_PUBLIC_SUPPORT_EMAIL en el deploy para mostrar el contacto aquí.',

    'settings.admin.intro': 'Herramientas globales de la plataforma SpecFlow.',
    'settings.admin.users': 'Gestionar usuarios',
    'settings.admin.companies': 'Empresas',
    'settings.admin.audit': 'Auditoría',

    'settings.account.logout': 'Cerrar sesión',
    'settings.account.logoutHint': 'Cierra la sesión en este dispositivo.',
    'settings.quickLinks': 'Accesos directos',

    'settings.link.dashboard': 'Panel',
    'settings.link.projects': 'Proyectos',
    'settings.link.newProject': 'Nueva demanda',
    'settings.footer.terms': 'Términos de uso',
    'settings.footer.privacy': 'Privacidad',
  },
}
