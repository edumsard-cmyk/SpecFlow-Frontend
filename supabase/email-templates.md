# Templates de e-mail SpecFlow (Supabase)

Os ficheiros HTML em `supabase/templates/` usam as cores e o logo da app.
**Importante:** o logo no e-mail usa `{{ .SiteURL }}/brand/specflow-landing-logo.png` — o **Site URL** no Supabase tem de ser o domínio público da app (não `localhost` em produção).

## 1. Site URL e redirects (corrige link localhost)

No painel Supabase → **Authentication** → **URL Configuration**:

| Campo | Valor (exemplo produção) |
|-------|---------------------------|
| **Site URL** | `https://app.specflow.com.br` (o seu domínio real) |
| **Redirect URLs** | `https://app.specflow.com.br/**` e, em dev, `http://localhost:3000/**` |

Na **Vercel** (ou outro host), defina:

```env
NEXT_PUBLIC_SITE_URL=https://app.specflow.com.br
```

Reimplante a app após alterar a variável.

## 2. Colar templates no Supabase

**Authentication** → **Email Templates** → escolha o tipo → **Source** = Custom (HTML).

| Tipo no painel | Ficheiro | Assunto sugerido |
|----------------|----------|------------------|
| Confirm signup | `confirmation.html` | `Confirme o seu e-mail — SpecFlow` |
| Reset password | `recovery.html` | `Redefinir senha — SpecFlow` |
| Invite user | `invite.html` | `Convite para o SpecFlow` |

Copie o conteúdo HTML completo de cada ficheiro e guarde.

## 3. Fluxo na app

1. Cadastro envia `emailRedirectTo` → `/auth/callback` no domínio de `NEXT_PUBLIC_SITE_URL`.
2. O callback troca o `code` por sessão e redireciona para `/confirmacao-email` (tela com marca SpecFlow).
3. O utilizador segue para o painel ou login.
