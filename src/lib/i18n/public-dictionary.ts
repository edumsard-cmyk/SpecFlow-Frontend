import type { Locale } from '@/lib/i18n/dictionaries'

const pt = {
  'layout.openMenu': 'Abrir menu de navegação',
  'layout.publicLogin': 'Entrar',
  'layout.publicSignup': 'Cadastrar',
  'layout.publicHelp': 'Ajuda',
  'layout.publicBrand': 'SpecFlow',

  'landing.nav.help': 'Ajuda',
  'landing.nav.login': 'Entrar',
  'landing.nav.signup': 'Começar grátis',
  'landing.hero.badge': 'IA que transforma demandas em especificações',
  'landing.hero.titlePrefix': 'Da ideia ao uso,',
  'landing.hero.titleHighlight': 'sem ruído.',
  'landing.hero.subtitle':
    'Transforme demandas caóticas em especificações técnicas completas — histórias de usuário, documentação e manual — em minutos, não semanas.',
  'landing.hero.ctaPrimary': 'Criar conta grátis',
  'landing.hero.ctaSecondary': 'Já tenho conta',
  'landing.hero.footnote': 'Sem cartão de crédito • Primeiros 3 projetos grátis',
  'landing.preview.url': 'app.specflow.com.br/projetos/...',
  'landing.preview.story1.title': 'Agendamento online pelo paciente',
  'landing.preview.story1.desc':
    'Como paciente, quero agendar consultas online para evitar ligações.',
  'landing.preview.story2.title': 'Painel de agenda do médico',
  'landing.preview.story2.desc':
    'Como médico, quero visualizar minha agenda diária para organizar atendimentos.',
  'landing.preview.story3.title': 'Confirmação e lembrete por e-mail',
  'landing.preview.story3.desc':
    'Como paciente, quero receber confirmação para não esquecer da consulta.',
  'landing.preview.story4.title': 'Bloqueio de horários indisponíveis',
  'landing.preview.story4.desc':
    'Como médico, quero bloquear horários para evitar conflitos de agenda.',
  'landing.how.title': 'Como funciona',
  'landing.how.subtitle':
    'Cinco etapas que transformam uma ideia bruta em entregáveis prontos para o time de desenvolvimento.',
  'landing.how.stepLabel': 'ETAPA',
  'landing.how.1.title': 'Entrada da demanda',
  'landing.how.1.desc':
    'Texto, áudio, vídeo, documento ou formulário guiado. Fale como quiser.',
  'landing.how.2.title': 'Especificação',
  'landing.how.2.desc':
    'Histórias de usuário com critérios de aceite detalhados e editáveis.',
  'landing.how.3.title': 'Manual do usuário',
  'landing.how.3.desc':
    'Passo a passo em linguagem simples para o usuário final, exportável em PDF.',
  'landing.how.4.title': 'Refinamento final com IA',
  'landing.how.4.desc':
    'Última revisão: clareza e consistência do que já foi produzido — um “pente fino” antes da entrega.',
  'landing.how.5.title': 'Exportação',
  'landing.how.5.desc':
    'PDF, Markdown, CSV para Jira e pacote estruturado para o Notion — prontos para entregar.',
  'landing.benefits.title': 'Por que o SpecFlow?',
  'landing.benefits.subtitle':
    'Especificação mal feita custa caro. O SpecFlow fecha o ciclo entre quem pediu e quem vai construir.',
  'landing.benefits.1.stat': '70%',
  'landing.benefits.1.statLabel': 'menos revisões tardias',
  'landing.benefits.1.title': 'Menos retrabalho',
  'landing.benefits.1.desc':
    'IA identifica lacunas críticas antes do desenvolvimento começar. Regras de negócio ambíguas viram critérios de aceite claros.',
  'landing.benefits.2.stat': '10x',
  'landing.benefits.2.statLabel': 'mais rápido que o processo manual',
  'landing.benefits.2.title': 'Mais velocidade',
  'landing.benefits.2.desc':
    'O que levaria dias de reuniões e iterações fica pronto em minutos. Analista, dev e cliente falam a mesma língua desde o início.',
  'landing.benefits.3.stat': '3 em 1',
  'landing.benefits.3.statLabel': 'entregas por projeto',
  'landing.benefits.3.title': 'Documentação real',
  'landing.benefits.3.desc':
    'Não é só um texto gerado — é especificação técnica, documentação do sistema e manual do usuário, todos coerentes entre si.',
  'landing.cta.title': 'Pronto para especificar sem ruído?',
  'landing.cta.subtitle':
    'Crie sua conta grátis e transforme sua primeira demanda em especificação agora mesmo.',
  'landing.cta.button': 'Começar grátis',
  'landing.cta.footnote': 'Sem cartão de crédito • Cancele quando quiser',
  'landing.footer.rights': 'Todos os direitos reservados.',

  'helpPage.title': 'Central de ajuda',
  'helpPage.intro':
    'Respostas rápidas para começar a usar o SpecFlow. Para suporte direto, use o e-mail indicado em',
  'helpPage.introSettings': 'Configurações',
  'helpPage.introAfter':
    '(após entrar na conta), se sua organização tiver configurado o contato.',
  'helpPage.guide.title': 'Começar em 5 minutos',
  'helpPage.guide.intro':
    'Roteiro recomendado para a primeira sessão. Se já tiver conta, entre e use o botão abaixo (requer login).',
  'helpPage.guide.1.title': 'Abrir o projeto de exemplo',
  'helpPage.guide.1.body':
    'No dashboard, clique em "Ver projeto de exemplo". Você verá briefing, histórias US-01/US-02, manual e uma mensagem de refinamento já salvos — sem precisar configurar IA na primeira visita.',
  'helpPage.guide.2.title': 'Percorrer as abas do fluxo',
  'helpPage.guide.2.body':
    'Briefing → Especificação (histórias) → Refinamento (chat com IA) → Conclusão → Manual. O stepper no topo mostra em que etapa o projeto está. Salve alterações antes de exportar.',
  'helpPage.guide.3.title': 'Refinar e gerar conclusão',
  'helpPage.guide.3.body':
    'Na aba Refinamento, a IA ajuda a esclarecer escopo e critérios. Depois, em Conclusão, gere o texto final do projeto (resumo e próximos passos) a partir do que já foi salvo.',
  'helpPage.guide.4.title': 'Exportar para Jira ou Notion',
  'helpPage.guide.4.body':
    'No cabeçalho do projeto use os botões de exportação: CSV para importar histórias no Jira, ou Markdown para colar no Notion. Também é possível baixar o pacote completo em .md ou PDF.',
  'helpPage.guide.5.title': 'Criar seu projeto real',
  'helpPage.guide.5.body':
    'Quando estiver confortável, use "Novo projeto" com texto, áudio ou documento. O checklist no dashboard acompanha briefing, histórias, refinamento e conclusão/exportação.',
  'helpPage.demoButton': 'Ver projeto de exemplo',
  'helpPage.loginForDemo': 'Entrar para criar o exemplo',
  'helpPage.goDashboard': 'Ir ao dashboard →',
  'helpPage.faqTitle': 'Perguntas frequentes',
  'helpPage.faq.1.q': 'Por onde começo depois de criar a conta?',
  'helpPage.faq.1.a':
    'Entre no dashboard e use "Ver projeto de exemplo" para explorar o fluxo em poucos minutos. Depois crie um projeto com sua demanda real em Projetos → Novo projeto.',
  'helpPage.faq.2.q': 'O que entra na exportação (.md ou PDF)?',
  'helpPage.faq.2.a':
    'Somente o que já está salvo no servidor: briefing, mensagens de refinamento persistidas, histórias de usuário e manual, conforme cada etapa estiver preenchida. Salve as alterações nas abas antes de exportar.',
  'helpPage.faq.3.q': 'Por que o PDF ou Markdown parece “vazio” em alguma seção?',
  'helpPage.faq.3.a':
    'Essa etapa ainda não foi gerada ou salva. Abra a aba correspondente (especificação ou manual), gere ou edite o conteúdo e aguarde a gravação.',
  'helpPage.faq.4.q': 'O refinamento com IA falhou ou travou. O que fazer?',
  'helpPage.faq.4.a':
    'Verifique sua conexão, aguarde um minuto e envie a mensagem de novo. Se o erro continuar, pode ser limite temporário do provedor de IA ou instabilidade — tente mais tarde.',
  'helpPage.faq.5.q': 'Esqueci minha senha.',
  'helpPage.faq.5.a':
    'Na tela de login, use “Esqueceu a senha?” para receber o e-mail de redefinição (conforme configurado no Supabase Auth).',
  'helpPage.faq.6.q': 'Quem pode convidar pessoas para a empresa?',
  'helpPage.faq.6.a':
    'Gestores da empresa podem enviar convites em Configurações. Administradores podem gerenciar usuários no painel admin.',
  'helpPage.footerTerms': 'Termos de uso',
  'helpPage.footerPrivacy': 'Privacidade',

  'auth.signup.title': 'Criar conta',
  'auth.signup.subtitle': 'Comece a transformar suas demandas em especificações',
  'auth.signup.name': 'Nome',
  'auth.signup.namePh': 'Seu nome',
  'auth.signup.company': 'Empresa',
  'auth.signup.companyPh': 'Nome da empresa',
  'auth.signup.email': 'E-mail corporativo',
  'auth.signup.emailPh': 'voce@empresa.com',
  'auth.signup.password': 'Senha',
  'auth.signup.passwordPh': 'Mínimo 8 caracteres',
  'auth.signup.termsPrefix': 'Ao se cadastrar, você concorda com os',
  'auth.signup.terms': 'Termos de Uso',
  'auth.signup.and': 'e',
  'auth.signup.privacy': 'Política de Privacidade',
  'auth.signup.submit': 'Criar conta gratuita',
  'auth.signup.hasAccount': 'Já tem uma conta?',
  'auth.signup.login': 'Entrar',
  'auth.signup.confirmTitle': 'Conta e empresa criadas.',
  'auth.signup.confirmBody':
    'O próximo passo é confirmar o e-mail (caixa de entrada e spam). Depois de confirmar, aceda a',
  'auth.signup.confirmLogin': 'Entrar',
  'auth.signup.footerHelp': 'Ajuda',
  'auth.signup.footerTerms': 'Termos',
  'auth.signup.footerPrivacy': 'Privacidade',

  'auth.forgot.title': 'Esqueceu a senha?',
  'auth.forgot.subtitle':
    'Informe seu e-mail e enviaremos um link para criar uma nova senha.',
  'auth.forgot.email': 'E-mail',
  'auth.forgot.submit': 'Enviar link',
  'auth.forgot.pending': 'Enviando…',
  'auth.forgot.sent':
    'Se existir uma conta com este e-mail, enviamos um link para redefinir a senha.',
  'auth.forgot.back': 'Voltar ao login',

  'auth.reset.title': 'Nova senha',
  'auth.reset.subtitle':
    'Defina uma nova senha. Use o link enviado por e-mail para abrir esta página.',
  'auth.reset.password': 'Nova senha',
  'auth.reset.confirm': 'Confirmar senha',
  'auth.reset.submit': 'Salvar nova senha',
  'auth.reset.pending': 'Salvando…',
  'auth.reset.success': 'Senha atualizada com sucesso.',
  'auth.reset.toLogin': 'Ir para o login',
  'auth.reset.errMin': 'A senha deve ter pelo menos 8 caracteres.',
  'auth.reset.errMatch': 'As senhas não coincidem.',

  'auth.confirm.errorTitle': 'Não foi possível confirmar',
  'auth.confirm.errorBody':
    'O link pode ter expirado ou já foi usado. Tente criar a conta novamente ou entre em contacto com o suporte.',
  'auth.confirm.errorBtn': 'Ir para o login',
  'auth.confirm.okTitle': 'E-mail confirmado',
  'auth.confirm.okBody':
    'A sua conta SpecFlow está ativa. Pode entrar e começar a transformar demandas em especificações.',
  'auth.confirm.dashboard': 'Ir para o painel',
  'auth.confirm.orLogin': 'Ou entrar com e-mail e senha',
  'auth.confirm.loading': 'A confirmar…',

  'legal.terms.title': 'Termos de uso',
  'legal.terms.intro':
    'Este é um texto modelo. Substitua pelo contrato ou termos revisados pelo seu jurídico antes de disponibilizar o serviço a clientes pagantes.',
  'legal.terms.s1.title': '1. Objeto',
  'legal.terms.s1.body':
    'O SpecFlow oferece ferramentas para organizar demandas, briefings e especificações. O uso da plataforma implica aceitação destes termos.',
  'legal.terms.s2.title': '2. Conta e responsabilidades',
  'legal.terms.s2.body':
    'Você é responsável pela veracidade dos dados informados e pela segurança das credenciais da sua conta. Notifique-nos em caso de uso não autorizado.',
  'legal.terms.s3.title': '3. Conteúdo e IA',
  'legal.terms.s3.body':
    'Conteúdos gerados por IA são sugestões. A validação técnica e de negócio permanece com sua equipe. Não nos responsabilizamos por decisões tomadas com base apenas em saídas automáticas.',
  'legal.terms.s4.title': '4. Alterações',
  'legal.terms.s4.body':
    'Podemos atualizar estes termos. A versão vigente estará sempre publicada nesta página, com data de revisão quando aplicável.',
  'legal.privacy.title': 'Política de privacidade',
  'legal.privacy.intro':
    'Texto modelo para transparência com usuários e clientes. Ajuste conforme LGPD, DPA com fornecedores (ex.: hospedagem, Supabase) e práticas reais de tratamento de dados.',
  'legal.privacy.s1.title': '1. Dados que tratamos',
  'legal.privacy.s1.body':
    'Podemos tratar dados de cadastro (nome, e-mail, empresa), conteúdos que você insere na plataforma (briefings, histórias, documentos) e dados técnicos de acesso (logs, cookies necessários à sessão).',
  'legal.privacy.s2.title': '2. Finalidades',
  'legal.privacy.s2.body':
    'Prestamos o serviço, mantemos a segurança da aplicação, cumprimos obrigações legais e, quando aplicável, comunicamos atualizações relevantes sobre o produto.',
  'legal.privacy.s3.title': '3. Compartilhamento',
  'legal.privacy.s3.body':
    'Utilizamos provedores de infraestrutura e autenticação (por exemplo, Supabase). Não vendemos seus dados pessoais. Compartilhamentos ocorrem apenas para operação do serviço ou por exigência legal.',
  'legal.privacy.s4.title': '4. Seus direitos',
  'legal.privacy.s4.body':
    'Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade e eliminação de dados desnecessários, entre outros. Use o canal de contato indicado pelo responsável pelo produto.',
  'legal.privacy.s5.title': '5. Retenção',
  'legal.privacy.s5.body':
    'Mantemos os dados pelo tempo necessário para a finalidade descrita ou para cumprimento legal. Projetos excluídos podem remover conteúdo associado conforme a política técnica do sistema.',
  'legal.updated': 'Última atualização do modelo:',
}

const en: typeof pt = {
  'layout.openMenu': 'Open navigation menu',
  'layout.publicLogin': 'Sign in',
  'layout.publicSignup': 'Sign up',
  'layout.publicHelp': 'Help',
  'layout.publicBrand': 'SpecFlow',

  'landing.nav.help': 'Help',
  'landing.nav.login': 'Sign in',
  'landing.nav.signup': 'Start free',
  'landing.hero.badge': 'AI that turns demands into specifications',
  'landing.hero.titlePrefix': 'From idea to usage,',
  'landing.hero.titleHighlight': 'without noise.',
  'landing.hero.subtitle':
    'Turn chaotic demands into complete technical specs — user stories, documentation, and manuals — in minutes, not weeks.',
  'landing.hero.ctaPrimary': 'Create free account',
  'landing.hero.ctaSecondary': 'I already have an account',
  'landing.hero.footnote': 'No credit card • First 3 projects free',
  'landing.preview.url': 'app.specflow.com.br/projects/...',
  'landing.preview.story1.title': 'Online scheduling by the patient',
  'landing.preview.story1.desc':
    'As a patient, I want to book appointments online to avoid phone calls.',
  'landing.preview.story2.title': 'Doctor schedule dashboard',
  'landing.preview.story2.desc':
    'As a doctor, I want to view my daily schedule to organize appointments.',
  'landing.preview.story3.title': 'Email confirmation and reminder',
  'landing.preview.story3.desc':
    'As a patient, I want confirmation so I do not forget the appointment.',
  'landing.preview.story4.title': 'Block unavailable time slots',
  'landing.preview.story4.desc':
    'As a doctor, I want to block slots to avoid scheduling conflicts.',
  'landing.how.title': 'How it works',
  'landing.how.subtitle':
    'Five steps that turn a raw idea into deliverables ready for the development team.',
  'landing.how.stepLabel': 'STEP',
  'landing.how.1.title': 'Demand intake',
  'landing.how.1.desc':
    'Text, audio, video, document, or guided form. Say it your way.',
  'landing.how.2.title': 'Specification',
  'landing.how.2.desc':
    'User stories with detailed, editable acceptance criteria.',
  'landing.how.3.title': 'User manual',
  'landing.how.3.desc':
    'Step-by-step in plain language for end users, exportable as PDF.',
  'landing.how.4.title': 'Final AI refinement',
  'landing.how.4.desc':
    'Last review: clarity and consistency of what was produced — a fine-tooth comb before delivery.',
  'landing.how.5.title': 'Export',
  'landing.how.5.desc':
    'PDF, Markdown, CSV for Jira, and a structured Notion package — ready to ship.',
  'landing.benefits.title': 'Why SpecFlow?',
  'landing.benefits.subtitle':
    'Poor specs are expensive. SpecFlow closes the loop between requesters and builders.',
  'landing.benefits.1.stat': '70%',
  'landing.benefits.1.statLabel': 'fewer late revisions',
  'landing.benefits.1.title': 'Less rework',
  'landing.benefits.1.desc':
    'AI spots critical gaps before development starts. Ambiguous business rules become clear acceptance criteria.',
  'landing.benefits.2.stat': '10x',
  'landing.benefits.2.statLabel': 'faster than a manual process',
  'landing.benefits.2.title': 'More speed',
  'landing.benefits.2.desc':
    'What took days of meetings is ready in minutes. Analyst, dev, and client speak the same language from day one.',
  'landing.benefits.3.stat': '3 in 1',
  'landing.benefits.3.statLabel': 'deliverables per project',
  'landing.benefits.3.title': 'Real documentation',
  'landing.benefits.3.desc':
    'Not just generated text — technical spec, system docs, and user manual, all aligned.',
  'landing.cta.title': 'Ready to specify without noise?',
  'landing.cta.subtitle':
    'Create your free account and turn your first demand into a specification today.',
  'landing.cta.button': 'Start free',
  'landing.cta.footnote': 'No credit card • Cancel anytime',
  'landing.footer.rights': 'All rights reserved.',

  'helpPage.title': 'Help center',
  'helpPage.intro':
    'Quick answers to get started with SpecFlow. For direct support, use the email listed in',
  'helpPage.introSettings': 'Settings',
  'helpPage.introAfter':
    '(after signing in), if your organization has configured contact details.',
  'helpPage.guide.title': 'Get started in 5 minutes',
  'helpPage.guide.intro':
    'Recommended path for your first session. If you already have an account, sign in and use the button below (login required).',
  'helpPage.guide.1.title': 'Open the sample project',
  'helpPage.guide.1.body':
    'On the dashboard, click "View sample project". You will see briefing, US-01/US-02 stories, manual, and a saved refinement message — no AI setup needed on first visit.',
  'helpPage.guide.2.title': 'Walk through the flow tabs',
  'helpPage.guide.2.body':
    'Briefing → Specification (stories) → Refinement (AI chat) → Conclusion → Manual. The stepper shows the current stage. Save changes before exporting.',
  'helpPage.guide.3.title': 'Refine and generate conclusion',
  'helpPage.guide.3.body':
    'On Refinement, AI helps clarify scope and criteria. Then on Conclusion, generate the final project text (summary and next steps) from what is already saved.',
  'helpPage.guide.4.title': 'Export to Jira or Notion',
  'helpPage.guide.4.body':
    'In the project header use export: CSV for Jira stories, or Markdown for Notion. You can also download the full package as .md or PDF.',
  'helpPage.guide.5.title': 'Create your real project',
  'helpPage.guide.5.body':
    'When ready, use "New project" with text, audio, or document. The dashboard checklist tracks briefing, stories, refinement, and conclusion/export.',
  'helpPage.demoButton': 'View sample project',
  'helpPage.loginForDemo': 'Sign in to create the sample',
  'helpPage.goDashboard': 'Go to dashboard →',
  'helpPage.faqTitle': 'Frequently asked questions',
  'helpPage.faq.1.q': 'Where do I start after creating an account?',
  'helpPage.faq.1.a':
    'Go to the dashboard and use "View sample project" to explore the flow in minutes. Then create a real project under Projects → New project.',
  'helpPage.faq.2.q': 'What is included in export (.md or PDF)?',
  'helpPage.faq.2.a':
    'Only what is saved on the server: briefing, persisted refinement messages, user stories, and manual, per completed stage. Save tab changes before exporting.',
  'helpPage.faq.3.q': 'Why does PDF or Markdown look empty in a section?',
  'helpPage.faq.3.a':
    'That stage was not generated or saved yet. Open the tab (specification or manual), generate or edit content, and wait for it to persist.',
  'helpPage.faq.4.q': 'AI refinement failed or froze. What should I do?',
  'helpPage.faq.4.a':
    'Check your connection, wait a minute, and send again. If it persists, it may be a temporary AI provider limit — try later.',
  'helpPage.faq.5.q': 'I forgot my password.',
  'helpPage.faq.5.a':
    'On the login screen, use "Forgot password?" to receive a reset email (per your Supabase Auth setup).',
  'helpPage.faq.6.q': 'Who can invite people to the company?',
  'helpPage.faq.6.a':
    'Company managers can send invites in Settings. Administrators manage users in the admin panel.',
  'helpPage.footerTerms': 'Terms of use',
  'helpPage.footerPrivacy': 'Privacy',

  'auth.signup.title': 'Create account',
  'auth.signup.subtitle': 'Start turning your demands into specifications',
  'auth.signup.name': 'Name',
  'auth.signup.namePh': 'Your name',
  'auth.signup.company': 'Company',
  'auth.signup.companyPh': 'Company name',
  'auth.signup.email': 'Work email',
  'auth.signup.emailPh': 'you@company.com',
  'auth.signup.password': 'Password',
  'auth.signup.passwordPh': 'At least 8 characters',
  'auth.signup.termsPrefix': 'By signing up, you agree to the',
  'auth.signup.terms': 'Terms of Use',
  'auth.signup.and': 'and',
  'auth.signup.privacy': 'Privacy Policy',
  'auth.signup.submit': 'Create free account',
  'auth.signup.hasAccount': 'Already have an account?',
  'auth.signup.login': 'Sign in',
  'auth.signup.confirmTitle': 'Account and company created.',
  'auth.signup.confirmBody':
    'Next, confirm your email (inbox and spam). After confirming, go to',
  'auth.signup.confirmLogin': 'Sign in',
  'auth.signup.footerHelp': 'Help',
  'auth.signup.footerTerms': 'Terms',
  'auth.signup.footerPrivacy': 'Privacy',

  'auth.forgot.title': 'Forgot password?',
  'auth.forgot.subtitle':
    'Enter your email and we will send a link to create a new password.',
  'auth.forgot.email': 'Email',
  'auth.forgot.submit': 'Send link',
  'auth.forgot.pending': 'Sending…',
  'auth.forgot.sent':
    'If an account exists for this email, we sent a link to reset your password.',
  'auth.forgot.back': 'Back to sign in',

  'auth.reset.title': 'New password',
  'auth.reset.subtitle':
    'Set a new password. Use the link from your email to open this page.',
  'auth.reset.password': 'New password',
  'auth.reset.confirm': 'Confirm password',
  'auth.reset.submit': 'Save new password',
  'auth.reset.pending': 'Saving…',
  'auth.reset.success': 'Password updated successfully.',
  'auth.reset.toLogin': 'Go to sign in',
  'auth.reset.errMin': 'Password must be at least 8 characters.',
  'auth.reset.errMatch': 'Passwords do not match.',

  'auth.confirm.errorTitle': 'Could not confirm',
  'auth.confirm.errorBody':
    'The link may have expired or already been used. Try signing up again or contact support.',
  'auth.confirm.errorBtn': 'Go to sign in',
  'auth.confirm.okTitle': 'Email confirmed',
  'auth.confirm.okBody':
    'Your SpecFlow account is active. Sign in and start turning demands into specifications.',
  'auth.confirm.dashboard': 'Go to dashboard',
  'auth.confirm.orLogin': 'Or sign in with email and password',
  'auth.confirm.loading': 'Confirming…',

  'legal.terms.title': 'Terms of use',
  'legal.terms.intro':
    'This is a template. Replace with counsel-reviewed terms before offering the service to paying customers.',
  'legal.terms.s1.title': '1. Purpose',
  'legal.terms.s1.body':
    'SpecFlow provides tools to organize demands, briefings, and specifications. Using the platform means you accept these terms.',
  'legal.terms.s2.title': '2. Account and responsibilities',
  'legal.terms.s2.body':
    'You are responsible for accurate data and credential security. Notify us of unauthorized use.',
  'legal.terms.s3.title': '3. Content and AI',
  'legal.terms.s3.body':
    'AI-generated content is a suggestion. Technical and business validation stays with your team. We are not liable for decisions based solely on automated output.',
  'legal.terms.s4.title': '4. Changes',
  'legal.terms.s4.body':
    'We may update these terms. The current version will always be published on this page, with a revision date when applicable.',
  'legal.privacy.title': 'Privacy policy',
  'legal.privacy.intro':
    'Template for transparency. Adjust per GDPR/LGPD, DPAs with providers (e.g. hosting, Supabase), and your actual data practices.',
  'legal.privacy.s1.title': '1. Data we process',
  'legal.privacy.s1.body':
    'We may process signup data (name, email, company), content you enter (briefings, stories, documents), and technical access data (logs, session cookies).',
  'legal.privacy.s2.title': '2. Purposes',
  'legal.privacy.s2.body':
    'We provide the service, maintain security, meet legal obligations, and when applicable communicate relevant product updates.',
  'legal.privacy.s3.title': '3. Sharing',
  'legal.privacy.s3.body':
    'We use infrastructure and auth providers (e.g. Supabase). We do not sell personal data. Sharing occurs only to operate the service or when legally required.',
  'legal.privacy.s4.title': '4. Your rights',
  'legal.privacy.s4.body':
    'Under applicable law you may request confirmation, access, correction, anonymization, portability, and deletion of unnecessary data, among others. Use the contact channel defined by the product owner.',
  'legal.privacy.s5.title': '5. Retention',
  'legal.privacy.s5.body':
    'We keep data as long as needed for the stated purpose or legal compliance. Deleted projects may remove associated content per system policy.',
  'legal.updated': 'Template last updated:',
}

const es: typeof pt = {
  'layout.openMenu': 'Abrir menú de navegación',
  'layout.publicLogin': 'Entrar',
  'layout.publicSignup': 'Registrarse',
  'layout.publicHelp': 'Ayuda',
  'layout.publicBrand': 'SpecFlow',

  'landing.nav.help': 'Ayuda',
  'landing.nav.login': 'Entrar',
  'landing.nav.signup': 'Empezar gratis',
  'landing.hero.badge': 'IA que transforma demandas en especificaciones',
  'landing.hero.titlePrefix': 'De la idea al uso,',
  'landing.hero.titleHighlight': 'sin ruido.',
  'landing.hero.subtitle':
    'Convierta demandas caóticas en especificaciones técnicas completas — historias de usuario, documentación y manual — en minutos, no semanas.',
  'landing.hero.ctaPrimary': 'Crear cuenta gratis',
  'landing.hero.ctaSecondary': 'Ya tengo cuenta',
  'landing.hero.footnote': 'Sin tarjeta • Primeros 3 proyectos gratis',
  'landing.preview.url': 'app.specflow.com.br/proyectos/...',
  'landing.preview.story1.title': 'Agenda online del paciente',
  'landing.preview.story1.desc':
    'Como paciente, quiero agendar consultas online para evitar llamadas.',
  'landing.preview.story2.title': 'Panel de agenda del médico',
  'landing.preview.story2.desc':
    'Como médico, quiero ver mi agenda diaria para organizar atenciones.',
  'landing.preview.story3.title': 'Confirmación y recordatorio por correo',
  'landing.preview.story3.desc':
    'Como paciente, quiero confirmación para no olvidar la consulta.',
  'landing.preview.story4.title': 'Bloqueo de horarios no disponibles',
  'landing.preview.story4.desc':
    'Como médico, quiero bloquear horarios para evitar conflictos.',
  'landing.how.title': 'Cómo funciona',
  'landing.how.subtitle':
    'Cinco etapas que transforman una idea en entregables listos para el equipo de desarrollo.',
  'landing.how.stepLabel': 'ETAPA',
  'landing.how.1.title': 'Entrada de la demanda',
  'landing.how.1.desc':
    'Texto, audio, vídeo, documento o formulario guiado. Dígalo como quiera.',
  'landing.how.2.title': 'Especificación',
  'landing.how.2.desc':
    'Historias de usuario con criterios de aceptación detallados y editables.',
  'landing.how.3.title': 'Manual del usuario',
  'landing.how.3.desc':
    'Paso a paso en lenguaje simple para el usuario final, exportable en PDF.',
  'landing.how.4.title': 'Refinamiento final con IA',
  'landing.how.4.desc':
    'Última revisión: claridad y coherencia de lo producido — un repaso fino antes de entregar.',
  'landing.how.5.title': 'Exportación',
  'landing.how.5.desc':
    'PDF, Markdown, CSV para Jira y paquete para Notion — listos para entregar.',
  'landing.benefits.title': '¿Por qué SpecFlow?',
  'landing.benefits.subtitle':
    'Una mala especificación cuesta caro. SpecFlow cierra el ciclo entre quien pide y quien construye.',
  'landing.benefits.1.stat': '70%',
  'landing.benefits.1.statLabel': 'menos revisiones tardías',
  'landing.benefits.1.title': 'Menos retrabajo',
  'landing.benefits.1.desc':
    'La IA detecta vacíos críticos antes del desarrollo. Reglas ambiguas se vuelven criterios claros.',
  'landing.benefits.2.stat': '10x',
  'landing.benefits.2.statLabel': 'más rápido que el proceso manual',
  'landing.benefits.2.title': 'Más velocidad',
  'landing.benefits.2.desc':
    'Lo que tomaba días de reuniones queda listo en minutos. Analista, dev y cliente hablan el mismo idioma.',
  'landing.benefits.3.stat': '3 en 1',
  'landing.benefits.3.statLabel': 'entregables por proyecto',
  'landing.benefits.3.title': 'Documentación real',
  'landing.benefits.3.desc':
    'No es solo texto generado — especificación técnica, documentación del sistema y manual, coherentes entre sí.',
  'landing.cta.title': '¿Listo para especificar sin ruido?',
  'landing.cta.subtitle':
    'Cree su cuenta gratis y convierta su primera demanda en especificación hoy.',
  'landing.cta.button': 'Empezar gratis',
  'landing.cta.footnote': 'Sin tarjeta • Cancele cuando quiera',
  'landing.footer.rights': 'Todos los derechos reservados.',

  'helpPage.title': 'Centro de ayuda',
  'helpPage.intro':
    'Respuestas rápidas para empezar con SpecFlow. Para soporte directo, use el correo indicado en',
  'helpPage.introSettings': 'Configuración',
  'helpPage.introAfter':
    '(tras iniciar sesión), si su organización configuró el contacto.',
  'helpPage.guide.title': 'Empezar en 5 minutos',
  'helpPage.guide.intro':
    'Ruta recomendada para la primera sesión. Si ya tiene cuenta, entre y use el botón (requiere login).',
  'helpPage.guide.1.title': 'Abrir el proyecto de ejemplo',
  'helpPage.guide.1.body':
    'En el panel, pulse "Ver proyecto de ejemplo". Verá briefing, historias US-01/US-02, manual y refinamiento guardados — sin configurar IA en la primera visita.',
  'helpPage.guide.2.title': 'Recorrer las pestañas del flujo',
  'helpPage.guide.2.body':
    'Briefing → Especificación → Refinamiento (chat IA) → Conclusión → Manual. El stepper muestra la etapa. Guarde antes de exportar.',
  'helpPage.guide.3.title': 'Refinar y generar conclusión',
  'helpPage.guide.3.body':
    'En Refinamiento, la IA aclara alcance y criterios. Luego en Conclusión, genere el texto final desde lo guardado.',
  'helpPage.guide.4.title': 'Exportar a Jira o Notion',
  'helpPage.guide.4.body':
    'En el encabezado del proyecto: CSV para Jira o Markdown para Notion. También puede descargar .md o PDF completo.',
  'helpPage.guide.5.title': 'Crear su proyecto real',
  'helpPage.guide.5.body':
    'Cuando esté listo, use "Nuevo proyecto" con texto, audio o documento. El checklist del panel sigue briefing, historias, refinamiento y exportación.',
  'helpPage.demoButton': 'Ver proyecto de ejemplo',
  'helpPage.loginForDemo': 'Entrar para crear el ejemplo',
  'helpPage.goDashboard': 'Ir al panel →',
  'helpPage.faqTitle': 'Preguntas frecuentes',
  'helpPage.faq.1.q': '¿Por dónde empiezo tras crear la cuenta?',
  'helpPage.faq.1.a':
    'Entre al panel y use "Ver proyecto de ejemplo". Luego cree un proyecto real en Proyectos → Nuevo proyecto.',
  'helpPage.faq.2.q': '¿Qué incluye la exportación (.md o PDF)?',
  'helpPage.faq.2.a':
    'Solo lo guardado en el servidor: briefing, refinamiento persistido, historias y manual, según cada etapa. Guarde en las pestañas antes de exportar.',
  'helpPage.faq.3.q': '¿Por qué PDF o Markdown parece vacío en una sección?',
  'helpPage.faq.3.a':
    'Esa etapa aún no se generó o guardó. Abra la pestaña, genere o edite y espere la persistencia.',
  'helpPage.faq.4.q': 'El refinamiento con IA falló o se colgó. ¿Qué hago?',
  'helpPage.faq.4.a':
    'Revise la conexión, espere un minuto y reenvíe. Si persiste, puede ser límite temporal del proveedor — intente más tarde.',
  'helpPage.faq.5.q': 'Olvidé mi contraseña.',
  'helpPage.faq.5.a':
    'En login, use "¿Olvidó la contraseña?" para recibir el correo de restablecimiento (según Supabase Auth).',
  'helpPage.faq.6.q': '¿Quién puede invitar a la empresa?',
  'helpPage.faq.6.a':
    'Los gestores envían invitaciones en Configuración. Los administradores gestionan usuarios en el panel admin.',
  'helpPage.footerTerms': 'Términos de uso',
  'helpPage.footerPrivacy': 'Privacidad',

  'auth.signup.title': 'Crear cuenta',
  'auth.signup.subtitle': 'Empiece a convertir demandas en especificaciones',
  'auth.signup.name': 'Nombre',
  'auth.signup.namePh': 'Su nombre',
  'auth.signup.company': 'Empresa',
  'auth.signup.companyPh': 'Nombre de la empresa',
  'auth.signup.email': 'Correo corporativo',
  'auth.signup.emailPh': 'usted@empresa.com',
  'auth.signup.password': 'Contraseña',
  'auth.signup.passwordPh': 'Mínimo 8 caracteres',
  'auth.signup.termsPrefix': 'Al registrarse, acepta los',
  'auth.signup.terms': 'Términos de uso',
  'auth.signup.and': 'y la',
  'auth.signup.privacy': 'Política de privacidad',
  'auth.signup.submit': 'Crear cuenta gratis',
  'auth.signup.hasAccount': '¿Ya tiene cuenta?',
  'auth.signup.login': 'Entrar',
  'auth.signup.confirmTitle': 'Cuenta y empresa creadas.',
  'auth.signup.confirmBody':
    'Confirme el correo (bandeja y spam). Después vaya a',
  'auth.signup.confirmLogin': 'Entrar',
  'auth.signup.footerHelp': 'Ayuda',
  'auth.signup.footerTerms': 'Términos',
  'auth.signup.footerPrivacy': 'Privacidad',

  'auth.forgot.title': '¿Olvidó la contraseña?',
  'auth.forgot.subtitle':
    'Indique su correo y enviaremos un enlace para crear una nueva contraseña.',
  'auth.forgot.email': 'Correo',
  'auth.forgot.submit': 'Enviar enlace',
  'auth.forgot.pending': 'Enviando…',
  'auth.forgot.sent':
    'Si existe una cuenta con este correo, enviamos un enlace para restablecer la contraseña.',
  'auth.forgot.back': 'Volver al inicio de sesión',

  'auth.reset.title': 'Nueva contraseña',
  'auth.reset.subtitle':
    'Defina una nueva contraseña. Use el enlace del correo para abrir esta página.',
  'auth.reset.password': 'Nueva contraseña',
  'auth.reset.confirm': 'Confirmar contraseña',
  'auth.reset.submit': 'Guardar nueva contraseña',
  'auth.reset.pending': 'Guardando…',
  'auth.reset.success': 'Contraseña actualizada correctamente.',
  'auth.reset.toLogin': 'Ir al inicio de sesión',
  'auth.reset.errMin': 'La contraseña debe tener al menos 8 caracteres.',
  'auth.reset.errMatch': 'Las contraseñas no coinciden.',

  'auth.confirm.errorTitle': 'No se pudo confirmar',
  'auth.confirm.errorBody':
    'El enlace puede haber expirado o ya usarse. Intente registrarse de nuevo o contacte soporte.',
  'auth.confirm.errorBtn': 'Ir al inicio de sesión',
  'auth.confirm.okTitle': 'Correo confirmado',
  'auth.confirm.okBody':
    'Su cuenta SpecFlow está activa. Entre y empiece a convertir demandas en especificaciones.',
  'auth.confirm.dashboard': 'Ir al panel',
  'auth.confirm.orLogin': 'O entrar con correo y contraseña',
  'auth.confirm.loading': 'Confirmando…',

  'legal.terms.title': 'Términos de uso',
  'legal.terms.intro':
    'Texto modelo. Sustitúyalo por términos revisados por su equipo legal antes de ofrecer el servicio a clientes de pago.',
  'legal.terms.s1.title': '1. Objeto',
  'legal.terms.s1.body':
    'SpecFlow ofrece herramientas para organizar demandas, briefings y especificaciones. El uso implica aceptar estos términos.',
  'legal.terms.s2.title': '2. Cuenta y responsabilidades',
  'legal.terms.s2.body':
    'Usted es responsable de la veracidad de los datos y de la seguridad de sus credenciales. Notifíquenos uso no autorizado.',
  'legal.terms.s3.title': '3. Contenido e IA',
  'legal.terms.s3.body':
    'El contenido generado por IA es una sugerencia. La validación técnica y de negocio queda en su equipo. No respondemos por decisiones basadas solo en salidas automáticas.',
  'legal.terms.s4.title': '4. Cambios',
  'legal.terms.s4.body':
    'Podemos actualizar estos términos. La versión vigente estará siempre en esta página, con fecha de revisión cuando aplique.',
  'legal.privacy.title': 'Política de privacidad',
  'legal.privacy.intro':
    'Texto modelo. Ajuste según RGPD/LGPD, DPA con proveedores (p. ej. Supabase) y sus prácticas reales.',
  'legal.privacy.s1.title': '1. Datos que tratamos',
  'legal.privacy.s1.body':
    'Podemos tratar datos de registro (nombre, correo, empresa), contenidos que ingresa (briefings, historias, documentos) y datos técnicos de acceso (logs, cookies de sesión).',
  'legal.privacy.s2.title': '2. Finalidades',
  'legal.privacy.s2.body':
    'Prestamos el servicio, mantenemos la seguridad, cumplimos obligaciones legales y, cuando aplique, comunicamos actualizaciones del producto.',
  'legal.privacy.s3.title': '3. Compartición',
  'legal.privacy.s3.body':
    'Usamos proveedores de infraestructura y autenticación (p. ej. Supabase). No vendemos datos personales. Compartimos solo para operar el servicio o por exigencia legal.',
  'legal.privacy.s4.title': '4. Sus derechos',
  'legal.privacy.s4.body':
    'Según la ley aplicable puede solicitar confirmación, acceso, corrección, anonimización, portabilidad y eliminación de datos innecesarios, entre otros. Use el canal de contacto del responsable del producto.',
  'legal.privacy.s5.title': '5. Retención',
  'legal.privacy.s5.body':
    'Conservamos los datos el tiempo necesario para la finalidad o cumplimiento legal. Proyectos eliminados pueden quitar contenido asociado según la política del sistema.',
  'legal.updated': 'Última actualización del modelo:',
}

export const publicDictionary: Record<Locale, Record<string, string>> = {
  pt,
  en,
  es,
}
