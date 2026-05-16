# SpecFlow — Gestão de especificações

Aplicação **Next.js** com **Supabase** (auth, Postgres, storage) e **Groq** para geração/refinamento com IA.

Este README foca em **colocar o sistema utilizável em produção**. O template genérico do `create-next-app` foi substituído por este guia.

---

## Pré-requisitos

- Node.js 20+ (recomendado)
- Conta [Supabase](https://supabase.com)
- Conta [Groq](https://console.groq.com) (API key para IA)
- (Opcional) Conta [Vercel](https://vercel.com) ou outro host para Next.js

---

## 1. Clonar e instalar

```bash
git clone <seu-repositorio> specflow
cd specflow
npm install
```

Copie variáveis de ambiente:

```bash
cp .env.example .env.local
```

Preencha `.env.local` (ver secção **Variáveis de ambiente**).

---

## 2. Supabase — projeto e migrações

1. Crie um projeto no Supabase.
2. Em **SQL Editor**, execute **por ordem** os ficheiros em `supabase/migrations/`:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_audit_and_story_comments.sql`
   - `004_briefing_audio_storage.sql`
   - `005_input_type_video.sql`

   Ou use a CLI Supabase (`supabase db push`) se o projeto estiver ligado ao mesmo repositório de migrações.

3. Confirme que extensões/tabelas/policies foram criadas sem erro.

---

## 3. Variáveis de ambiente

| Variável | Onde obter | Notas |
|----------|------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Idem | Chave **anon**, segura no cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | Idem | **Só servidor**. Nunca expor no browser ou commits |
| `NEXT_PUBLIC_SITE_URL` | O teu domínio | Ex.: `https://app.teudominio.com`. Em dev: `http://localhost:3000` |
| `GROQ_API_KEY` | Groq Console | Obrigatória para gerar/refinar com IA |

Na **Vercel**, define as mesmas variáveis em **Settings → Environment Variables**. Define `NEXT_PUBLIC_SITE_URL` para o URL público definitivo (a `VERCEL_URL` pode servir de fallback em alguns fluxos, mas o domínio customizado deve estar correto para emails de auth).

---

## 4. Auth Supabase — redirects e email

1. **Authentication → URL configuration**
   - **Site URL**: o mesmo valor que `NEXT_PUBLIC_SITE_URL` em produção.
   - **Redirect URLs**: inclui pelo menos:
     - `http://localhost:3000/**` (desenvolvimento)
     - `https://teu-dominio.com/**` (produção)
     - `https://teu-projeto.vercel.app/**` (preview Vercel, se aplicável)

2. **Confirmação de email / reset de senha**  
   Se “Confirm email” estiver ativo, os utilizadores precisam de caixa de correio funcional. Configure **SMTP custom** ou use o provedor do Supabase conforme o teu plano.

3. Templates de email (opcional): alinhar links com `NEXT_PUBLIC_SITE_URL`.

---

## 5. Primeiro utilizador administrador

O registo em `/cadastro` cria utilizador com role **company** e empresa associada.

Para ter um **admin** global (painel admin, empresas, etc.):

1. Regista-te normalmente ou cria utilizador em **Authentication** no Supabase.
2. No **SQL Editor**:

```sql
update public.profiles
set role = 'admin'
where email = 'teu-email@dominio.com';
```

3. Volta a iniciar sessão se necessário.

---

## 6. Desenvolvimento local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Rotas protegidas redirecionam para `/login` sem sessão.

```bash
npm run build
```

Garante que o build passa antes de deploy.

---

## 7. Deploy (ex.: Vercel)

1. Liga o repositório à Vercel.
2. Framework: **Next.js**.
3. Variáveis de ambiente: iguais a `.env.local` (incluindo `SUPABASE_SERVICE_ROLE_KEY` apenas em ambiente servidor).
4. `NEXT_PUBLIC_SITE_URL` = URL produção final.
5. Após deploy, atualiza **Redirect URLs** no Supabase com o domínio Vercel/produção.

---

## 8. Funcionalidades e limitações atuais

- **Fluxo principal**: projetos, briefing, especificação, documentação, manual, refinamento, exportação — com IA via Groq.
- **Plano gratuito**: até **3 projetos por empresa** (admin da plataforma isento); contagem na criação e na API de áudio.
- **Briefing em áudio**: requer migração `004` aplicada e bucket `briefing-media` com as policies da migração.
- **Briefing em documento**: PDF, DOCX, XLS/XLSX e TXT — extração de texto na criação do projeto (`/api/projects/from-document`).
- **Briefing em vídeo**: upload ou gravação — extração de áudio (ffmpeg) + transcrição Groq (`/api/projects/from-video`). Em ambientes sem ffmpeg, tenta transcrição direta do ficheiro.
- **Exportação Jira / Notion**: CSV para importação no Jira e Markdown estruturado para o Notion (botões no projeto).

---

## 9. Checklist rápido antes de abrir a equipa

- [ ] Migrações `001`–`005` aplicadas
- [ ] `.env.local` / Vercel com todas as chaves
- [ ] `NEXT_PUBLIC_SITE_URL` correto
- [ ] Redirect URLs no Supabase Auth
- [ ] Email (confirmação / reset) testado
- [ ] Pelo menos um perfil `admin` definido
- [ ] `npm run build` sem erros
- [ ] Teste: cadastro → confirmação email → login → criar projeto → guardar → exportar

---

## 10. Suporte no código

- Exemplo de envs: `.env.example`
- Regras do agente / Next.js: `AGENTS.md`, `CLAUDE.md`

---

## Licença

Conforme definido pelo repositório do projeto.
