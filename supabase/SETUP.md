# SpecFlow — como configurar o Supabase (passo a passo)

Use este guia na ordem. Os menus do painel [supabase.com/dashboard](https://supabase.com/dashboard) podem mudar ligeiramente de nome; procure os termos em inglês indicados.

---

## 1. Chaves da API (para o `.env.local` do Next.js)

1. Abra o seu projeto no Supabase.
2. Menu lateral: **Project Settings** (ícone de engrenagem) → **API**.
3. Copie e cole no ficheiro `.env.local` (na raiz do repositório; copie a partir de `.env.example`):

| Variável no `.env.local` | Onde copiar no Supabase |
|--------------------------|-------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (ex.: `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon public** — chave `eyJ...` curta |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** — chave longa **secreta** (nunca no frontend nem no Git) |

Exemplo de formato (substitua pelos valores **reais** do seu projeto):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GROQ_API_KEY=sua_chave_groq
```

- **Local:** `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- **Produção:** `NEXT_PUBLIC_SITE_URL=https://o-dominio-onde-a-app-corre.com` (sem barra no fim)

Guarde o ficheiro, reinicie `npm run dev`.

---

## 2. Migrações (tabelas e RLS)

1. No Supabase: **SQL Editor** → **New query**.
2. Abra cada ficheiro do repositório, **por ordem**, copie **todo** o conteúdo e execute (**Run**):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_audit_and_story_comments.sql`

Se já usar o CLI: `supabase db push` (com projeto ligado).

---

## 3. URLs de autenticação (obrigatório para login, reset e convites)

Sem isto, links de e-mail e redirects podem falhar.

1. Menu lateral: **Authentication**.
2. Abra **URL Configuration** (ou **Redirect URLs** / definições de URL, conforme a versão do painel).

### Site URL

- **Desenvolvimento:** `http://localhost:3000`
- **Produção:** `https://seu-dominio.com` (URL exata do site)

### Redirect URLs (lista de URLs permitidas)

Adicione **uma linha por padrão** que a sua app use. Exemplos para colar (ajuste o domínio de produção):

```
http://localhost:3000/**
http://localhost:3000/*
https://SEU-DOMINIO.com/**
https://SEU-DOMINIO.com/*
```

Se estiver na **Vercel**, inclua também (troque pelo nome do projeto):

```
https://nome-do-projeto.vercel.app/**
```

**Regra:** o valor de `NEXT_PUBLIC_SITE_URL` no `.env.local` deve ser **a mesma origem** (mesmo protocolo + domínio + porta) que o utilizador usa no browser, salvo uso explícito de outro domínio nos links.

---

## 4. Confirmação de e-mail (obrigatório para o fluxo de cadastro)

Sem isto, o Supabase **não envia** o e-mail e o utilizador **entra logo** após o cadastro.

1. **Authentication** → **Providers** → **Email**.
2. Ative o provedor **Email** se estiver desligado.
3. Ligue **“Confirm email”** (Confirmar e-mail). Tem de estar **ON**.
4. **Authentication** → **URL Configuration**:
   - **Site URL** = domínio público da app (ex. `https://app.specflow.com.br`)
   - **Redirect URLs** inclui `https://seu-dominio/auth/callback**` e `http://localhost:3000/auth/callback**`
5. Na Vercel: `NEXT_PUBLIC_SITE_URL` = mesmo domínio do Site URL → redeploy.
6. **Templates:** em **Email Templates** → **Confirm signup**, cole `supabase/templates/confirmation.html` e assunto `Confirme o seu e-mail — SpecFlow` (ver `supabase/email-templates.md`).
7. Para o e-mail **chegar de facto** (não só na UI), escolha **uma** opção:
   - **SMTP no Supabase** (secção 5 abaixo), ou
   - **Resend na app:** `RESEND_API_KEY` + `RESEND_FROM_EMAIL` no `.env.local` / Vercel (a app envia o HTML SpecFlow com o link de confirmação).
8. O envio gratuito do Supabase (sem SMTP/Resend) é limitado (~4 e-mails/hora) e muitas vezes **não chega** ou vai para spam.

A app SpecFlow já:
- mostra mensagem de confirmação no `/cadastro`;
- bloqueia login sem e-mail confirmado;
- redireciona contas pendentes para `/aguardando-confirmacao` (com reenvio de e-mail).

**Templates HTML (reset, etc.):** siga `supabase/email-templates.md` (**Sender name = SpecFlow** no SMTP).

---

## 5. SMTP (e-mails a sério: confirmação, reset, convites)

O Supabase envia e-mails por um serviço predefinido (limitado). Para produção, use **SMTP próprio**.

1. **Project Settings** → **Authentication** (às vezes em **Authentication** → **SMTP Settings**).
2. Ative **Custom SMTP** / **Enable custom SMTP**.
3. Preencha os campos (exemplo genérico — use os dados do **seu** fornecedor: Resend, SendGrid, Amazon SES, Mailgun, etc.):

| Campo típico no Supabase | Exemplo (placeholders) |
|---------------------------|-------------------------|
| Host | `smtp.resend.com` ou `smtp.sendgrid.net` |
| Port | `465` (SSL) ou `587` (STARTTLS) — conforme o provedor |
| Username | utilizador ou `apikey` indicado pelo provedor |
| Password | API key ou password de SMTP |
| Sender email | `onboarding@seudominio.com` (domínio verificado no provedor) |
| Sender name | `SpecFlow` |

**Gmail** costuma exigir [palavra-passe de aplicação](https://support.google.com/accounts/answer/185833); não use a palavra-passe normal da conta.

Depois de guardar, faça um teste: **recuperar palavra-passe** ou **novo cadastro** e veja se o e-mail chega (e pasta de spam).

---

## 6. Tornar alguém administrador da plataforma (`/admin`)

1. Crie uma conta em `/cadastro` no site (com a app já a falar com este projeto Supabase).
2. No Supabase: **SQL Editor** → **New query**.
3. Cole o SQL abaixo, **substitua só o e-mail**, e execute (**Run**):

```sql
update public.profiles
set role = 'admin'::user_role
where lower(trim(email)) = lower(trim('COLOQUE_AQUI_O_EMAIL_DO_LOGIN'));
```

4. (Opcional) Verificar:

```sql
select id, email, role, company_id
from public.profiles
where role = 'admin';
```

O mesmo script está em `supabase/scripts/grant_platform_admin.sql` para editar no editor e copiar.

---

## 7. Checklist rápido

- [ ] `.env.local` com URL, anon, service_role, `NEXT_PUBLIC_SITE_URL`, `GROQ_API_KEY`
- [ ] Migrações `001`, `002`, `003` executadas
- [ ] **Site URL** e **Redirect URLs** coerentes com onde a app corre
- [ ] SMTP configurado se precisar de e-mails fiáveis em produção
- [ ] SQL de `admin` executado para quem deve aceder a `/admin`

---

## Problemas frequentes

| Sintoma | O que verificar |
|---------|------------------|
| Link do e-mail abre erro ou não entra | Redirect URLs e Site URL no Supabase; `NEXT_PUBLIC_SITE_URL` |
| E-mail nunca chega | SMTP; spam; domínio/remetente verificado no provedor |
| `/admin` redireciona para o dashboard | `role` na tabela `profiles` não é `admin` |
| Convite falha | `SUPABASE_SERVICE_ROLE_KEY` no servidor; SMTP; Redirect URLs |
