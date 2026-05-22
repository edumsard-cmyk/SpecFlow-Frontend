import type { Locale } from '@/lib/i18n/dictionaries'

/** Textos da Central de Ajuda (painel lateral). */
export const helpDictionary: Record<Locale, Record<string, string>> = {
  pt: {
    'help.title': 'Central de Ajuda',
    'help.subtitle': 'Guia rápido do SpecFlow',
    'help.close': 'Fechar ajuda',
    'help.fabOpen': 'Abrir central de ajuda',
    'help.navLabel': 'Tópicos de ajuda',
    'help.footer':
      'Tem uma dúvida que não está aqui? Use a aba Refinamento no projeto para conversar com a IA sobre escopo e critérios.',
    'help.fullGuideLink': 'Guia completo e FAQ',

    'help.sections.gettingStarted.title': 'Começar em 5 minutos',
    'help.sections.gettingStarted.b1':
      'No dashboard, use "Ver projeto de exemplo" para explorar briefing, histórias, manual e refinamento já preenchidos.',
    'help.sections.gettingStarted.b2':
      'O checklist acompanha briefing, especificação, refinamento e conclusão/exportação.',
    'help.sections.gettingStarted.b3':
      'Percorra as abas na ordem: Briefing → Especificação → Refinamento → Conclusão → Manual.',
    'help.sections.gettingStarted.b4':
      'Salve alterações em cada etapa antes de exportar ou avançar de fase.',

    'help.sections.dashboard.title': 'Dashboard',
    'help.sections.dashboard.b1':
      'Visão geral dos projetos da empresa e atalhos para criar demanda ou abrir projetos recentes.',
    'help.sections.dashboard.b2':
      'Banner e checklist de primeiros passos ajudam na onboarding até o primeiro projeto real.',
    'help.sections.dashboard.b3':
      'O limite do plano gratuito (número de projetos) aparece quando estiver próximo do teto.',

    'help.sections.projects.title': 'Projetos',
    'help.sections.projects.b1':
      'Lista todos os projetos com status do fluxo (briefing, especificação, refinamento, conclusão, manual).',
    'help.sections.projects.b2':
      'Abra um projeto para continuar de onde parou; o stepper no topo indica a etapa atual.',
    'help.sections.projects.b3':
      'Use "Nova demanda" na barra lateral para iniciar outro projeto.',

    'help.sections.newProject.title': 'Nova demanda',
    'help.sections.newProject.b1':
      'Passo 1: nome e descrição. Passo 2: escolha como inserir a demanda.',
    'help.sections.newProject.b2':
      'Formatos: texto livre, áudio, vídeo, documento (PDF/Word/planilha), formulário guiado ou imagens guiadas (imagem + texto por bloco).',
    'help.sections.newProject.b3':
      'Em áudio, vídeo e documento há botão para apagar e enviar outro ficheiro se escolheu o errado.',
    'help.sections.newProject.b4':
      'Áudio, vídeo, documento e imagens são transcritos/processados pela IA ao criar o projeto.',

    'help.sections.briefing.title': 'Briefing',
    'help.sections.briefing.b1':
      'Primeira aba do projeto: texto que alimenta especificação, manual e refinamento.',
    'help.sections.briefing.b2':
      'Se criou por áudio/vídeo/documento, pode ver o ficheiro original ao lado da transcrição (quando disponível no storage).',
    'help.sections.briefing.b3':
      'Briefing por imagens guiadas mostra cada imagem com a descrição que escreveu na criação.',
    'help.sections.briefing.b4':
      'Edite o texto e clique em Salvar; use o botão no rodapé para ir à etapa seguinte quando estiver pronto.',

    'help.sections.specification.title': 'Especificação',
    'help.sections.specification.b1':
      'Histórias de usuário (US-01, US-02…) com título, descrição e critérios de aceite.',
    'help.sections.specification.b2':
      'Gere com IA a partir do briefing salvo; revise e edite antes de salvar.',
    'help.sections.specification.b3':
      'Comentários por história ajudam a registar decisões da equipa.',

    'help.sections.manual.title': 'Manual',
    'help.sections.manual.b1':
      'Documentação do produto em blocos editáveis (título, formato e conteúdo).',
    'help.sections.manual.b2':
      'Gere rascunho com IA com base no briefing e nas histórias já salvas.',
    'help.sections.manual.b3':
      'Salve o manual antes de exportar ou concluir o projeto.',

    'help.sections.refinement.title': 'Refinamento (IA)',
    'help.sections.refinement.b1':
      'Chat com IA para esclarecer escopo, regras e critérios — mensagens ficam guardadas no projeto.',
    'help.sections.refinement.b2':
      'Use perguntas objetivas; a IA não substitui validação de negócio com o cliente.',
    'help.sections.refinement.b3':
      'Conclua o refinamento antes de gerar a conclusão final na aba seguinte.',

    'help.sections.conclusion.title': 'Conclusão',
    'help.sections.conclusion.b1':
      'Resumo final e próximos passos gerados a partir do que já está salvo no projeto.',
    'help.sections.conclusion.b2':
      'O fluxo é linear: só avança para conclusão depois do refinamento.',
    'help.sections.conclusion.b3':
      'Revise o texto gerado e salve antes de avançar para o manual do usuário.',

    'help.sections.export.title': 'Exportação',
    'help.sections.export.b1':
      'No cabeçalho do projeto: CSV para Jira (histórias), Markdown para Notion.',
    'help.sections.export.b2':
      'Pacote completo em .md ou PDF inclui apenas etapas já gravadas no servidor.',
    'help.sections.export.b3':
      'Se uma secção sair vazia, abra a aba correspondente, gere/salve o conteúdo e exporte de novo.',

    'help.sections.settings.title': 'Configurações',
    'help.sections.settings.b1':
      'Dados da empresa, convites de utilizadores (gestores) e contacto de suporte, se configurado.',
    'help.sections.settings.b2':
      'Administradores gerem empresas e utilizadores no painel Admin.',
    'help.sections.settings.b3':
      'Link para a central de ajuda completa (/ajuda) com FAQ e guia de 5 minutos.',
  },

  en: {
    'help.title': 'Help Center',
    'help.subtitle': 'Quick guide to SpecFlow',
    'help.close': 'Close help',
    'help.fabOpen': 'Open help center',
    'help.navLabel': 'Help topics',
    'help.footer':
      'Question not listed here? Use the Refinement tab in a project to chat with AI about scope and criteria.',
    'help.fullGuideLink': 'Full guide and FAQ',

    'help.sections.gettingStarted.title': 'Start in 5 minutes',
    'help.sections.gettingStarted.b1':
      'On the dashboard, use "View sample project" to explore briefing, stories, manual and refinement already filled in.',
    'help.sections.gettingStarted.b2':
      'The checklist tracks briefing, specification, refinement and conclusion/export.',
    'help.sections.gettingStarted.b3':
      'Follow tabs in order: Briefing → Specification → Refinement → Conclusion → Manual.',
    'help.sections.gettingStarted.b4':
      'Save changes at each step before exporting or moving to the next phase.',

    'help.sections.dashboard.title': 'Dashboard',
    'help.sections.dashboard.b1':
      'Overview of company projects and shortcuts to create a demand or open recent projects.',
    'help.sections.dashboard.b2':
      'Banner and getting-started checklist help until your first real project.',
    'help.sections.dashboard.b3':
      'Free plan project limits appear when you are close to the cap.',

    'help.sections.projects.title': 'Projects',
    'help.sections.projects.b1':
      'Lists all projects with pipeline status (briefing, specification, refinement, conclusion, manual).',
    'help.sections.projects.b2':
      'Open a project to continue; the stepper shows the current step.',
    'help.sections.projects.b3':
      'Use "New project" in the sidebar to start another demand.',

    'help.sections.newProject.title': 'New project',
    'help.sections.newProject.b1':
      'Step 1: name and description. Step 2: choose how to capture the demand.',
    'help.sections.newProject.b2':
      'Formats: free text, audio, video, document (PDF/Word/spreadsheet), guided form or guided images (image + text per block).',
    'help.sections.newProject.b3':
      'For audio, video and document you can remove and upload again if you picked the wrong file.',
    'help.sections.newProject.b4':
      'Audio, video, document and images are processed by AI when the project is created.',

    'help.sections.briefing.title': 'Briefing',
    'help.sections.briefing.b1':
      'First project tab: text that feeds specification, manual and refinement.',
    'help.sections.briefing.b2':
      'If created from audio/video/document, you may view the original file next to the transcript when stored.',
    'help.sections.briefing.b3':
      'Guided-images briefings show each image with the description you wrote at creation.',
    'help.sections.briefing.b4':
      'Edit text and save; use the footer button to continue when ready.',

    'help.sections.specification.title': 'Specification',
    'help.sections.specification.b1':
      'User stories (US-01, US-02…) with title, description and acceptance criteria.',
    'help.sections.specification.b2':
      'Generate with AI from saved briefing; review and edit before saving.',
    'help.sections.specification.b3':
      'Per-story comments help record team decisions.',

    'help.sections.manual.title': 'Manual',
    'help.sections.manual.b1':
      'Product documentation in editable blocks (title, format and content).',
    'help.sections.manual.b2':
      'Generate a draft with AI from briefing and saved stories.',
    'help.sections.manual.b3':
      'Save the manual before exporting or marking the project as done.',

    'help.sections.refinement.title': 'Refinement (AI)',
    'help.sections.refinement.b1':
      'AI chat to clarify scope, rules and criteria — messages are stored on the project.',
    'help.sections.refinement.b2':
      'Ask focused questions; AI does not replace business validation with the client.',
    'help.sections.refinement.b3':
      'Finish refinement before generating the final conclusion.',

    'help.sections.conclusion.title': 'Conclusion',
    'help.sections.conclusion.b1':
      'Final summary and next steps generated from what is already saved.',
    'help.sections.conclusion.b2':
      'Linear flow: conclusion comes after refinement.',
    'help.sections.conclusion.b3':
      'Review generated text and save before moving on to the user manual.',

    'help.sections.export.title': 'Export',
    'help.sections.export.b1':
      'In the project header: CSV for Jira (stories), Markdown for Notion.',
    'help.sections.export.b2':
      'Full .md or PDF package includes only steps saved on the server.',
    'help.sections.export.b3':
      'If a section is empty, open the tab, generate/save content and export again.',

    'help.sections.settings.title': 'Settings',
    'help.sections.settings.b1':
      'Company data, user invites (managers) and support contact when configured.',
    'help.sections.settings.b2':
      'Admins manage companies and users in the Admin panel.',
    'help.sections.settings.b3':
      'Link to the full help page (/ajuda) with FAQ and 5-minute guide.',
  },

  es: {
    'help.title': 'Centro de Ayuda',
    'help.subtitle': 'Guía rápida de SpecFlow',
    'help.close': 'Cerrar ayuda',
    'help.fabOpen': 'Abrir centro de ayuda',
    'help.navLabel': 'Temas de ayuda',
    'help.footer':
      '¿Tiene una duda que no está aquí? Use la pestaña Refinamiento en el proyecto para hablar con la IA sobre alcance y criterios.',
    'help.fullGuideLink': 'Guía completa y FAQ',

    'help.sections.gettingStarted.title': 'Empezar en 5 minutos',
    'help.sections.gettingStarted.b1':
      'En el panel, use "Ver proyecto de ejemplo" para explorar briefing, historias, manual y refinamiento ya rellenados.',
    'help.sections.gettingStarted.b2':
      'La lista de inicio sigue briefing, especificación, refinamiento y conclusión/exportación.',
    'help.sections.gettingStarted.b3':
      'Recorra las pestañas en orden: Briefing → Especificación → Refinamiento → Conclusión → Manual.',
    'help.sections.gettingStarted.b4':
      'Guarde cambios en cada etapa antes de exportar o avanzar de fase.',

    'help.sections.dashboard.title': 'Panel',
    'help.sections.dashboard.b1':
      'Vista general de proyectos de la empresa y accesos para crear demanda o abrir proyectos recientes.',
    'help.sections.dashboard.b2':
      'Banner y checklist de primeros pasos hasta el primer proyecto real.',
    'help.sections.dashboard.b3':
      'El límite del plan gratuito aparece cuando esté cerca del tope.',

    'help.sections.projects.title': 'Proyectos',
    'help.sections.projects.b1':
      'Lista todos los proyectos con estado del flujo (briefing, especificación, manual, refinamiento, conclusión).',
    'help.sections.projects.b2':
      'Abra un proyecto para continuar; el stepper indica la etapa actual.',
    'help.sections.projects.b3':
      'Use "Nueva demanda" en la barra lateral para otro proyecto.',

    'help.sections.newProject.title': 'Nueva demanda',
    'help.sections.newProject.b1':
      'Paso 1: nombre y descripción. Paso 2: elija cómo introducir la demanda.',
    'help.sections.newProject.b2':
      'Formatos: texto libre, audio, vídeo, documento (PDF/Word/hoja), formulario guiado o imágenes guiadas (imagen + texto por bloque).',
    'help.sections.newProject.b3':
      'En audio, vídeo y documento puede borrar y subir otro archivo si se equivocó.',
    'help.sections.newProject.b4':
      'Audio, vídeo, documento e imágenes se procesan con IA al crear el proyecto.',

    'help.sections.briefing.title': 'Briefing',
    'help.sections.briefing.b1':
      'Primera pestaña: texto que alimenta especificación, manual y refinamiento.',
    'help.sections.briefing.b2':
      'Si creó por audio/vídeo/documento, puede ver el archivo original junto a la transcripción (si está en storage).',
    'help.sections.briefing.b3':
      'Briefing por imágenes guiadas muestra cada imagen con la descripción escrita al crear.',
    'help.sections.briefing.b4':
      'Edite el texto y guarde; use el botón del pie para la siguiente etapa cuando esté listo.',

    'help.sections.specification.title': 'Especificación',
    'help.sections.specification.b1':
      'Historias de usuario (US-01, US-02…) con título, descripción y criterios de aceptación.',
    'help.sections.specification.b2':
      'Genere con IA desde el briefing guardado; revise y edite antes de guardar.',
    'help.sections.specification.b3':
      'Comentarios por historia registran decisiones del equipo.',

    'help.sections.manual.title': 'Manual',
    'help.sections.manual.b1':
      'Documentación del producto en bloques editables (título, formato y contenido).',
    'help.sections.manual.b2':
      'Genere borrador con IA según briefing e historias guardadas.',
    'help.sections.manual.b3':
      'Guarde el manual antes de exportar o marcar el proyecto como terminado.',

    'help.sections.refinement.title': 'Refinamiento (IA)',
    'help.sections.refinement.b1':
      'Chat con IA para aclarar alcance, reglas y criterios — los mensajes quedan en el proyecto.',
    'help.sections.refinement.b2':
      'Haga preguntas concretas; la IA no sustituye la validación de negocio con el cliente.',
    'help.sections.refinement.b3':
      'Termine el refinamiento antes de generar la conclusión final.',

    'help.sections.conclusion.title': 'Conclusión',
    'help.sections.conclusion.b1':
      'Resumen final y próximos pasos generados desde lo ya guardado.',
    'help.sections.conclusion.b2':
      'Flujo lineal: la conclusión viene después del refinamiento.',
    'help.sections.conclusion.b3':
      'Revise el texto generado y guarde antes de pasar al manual del usuario.',

    'help.sections.export.title': 'Exportación',
    'help.sections.export.b1':
      'En el encabezado del proyecto: CSV para Jira (historias), Markdown para Notion.',
    'help.sections.export.b2':
      'El paquete .md o PDF incluye solo etapas guardadas en el servidor.',
    'help.sections.export.b3':
      'Si una sección sale vacía, abra la pestaña, genere/guarde y exporte de nuevo.',

    'help.sections.settings.title': 'Configuración',
    'help.sections.settings.b1':
      'Datos de la empresa, invitaciones (gestores) y contacto de soporte si está configurado.',
    'help.sections.settings.b2':
      'Los administradores gestionan empresas y usuarios en el panel Admin.',
    'help.sections.settings.b3':
      'Enlace a la ayuda completa (/ajuda) con FAQ y guía de 5 minutos.',
  },
}
