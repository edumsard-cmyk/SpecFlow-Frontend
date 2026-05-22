# E-mails de autenticação SpecFlow (Supabase)

O e-mail padrão do Supabase mostra **"Supabase Auth"** e layout genérico até você colar os templates deste repositório e configurar o **nome do remetente**.

Ficheiros HTML: `supabase/templates/` (cores `#0F2460`, `#1E3A8A`, gradiente roxo/azul, logo em `{{ .SiteURL }}/brand/specflow-landing-logo.png`).

---

## Passo a passo — redefinição de senha (o que você vê hoje)

### 1. Template HTML no painel

1. Abra o [painel Supabase](https://supabase.com/dashboard) do projeto SpecFlow.
2. **Authentication** → **Email Templates**.
3. Tipo **Reset password** (Recovery).
4. **Source** = **Custom** (HTML).
5. **Subject / Assunto:** `Redefinir senha — SpecFlow`
6. Copie **todo** o conteúdo de `supabase/templates/recovery.html` e cole no editor.
7. **Save**.

Repita para **Confirm signup** → `confirmation.html` e assunto `Confirme o seu e-mail — SpecFlow`.

### 2. Remetente "SpecFlow" (não "Supabase Auth")

O nome **Supabase Auth** vem do envio padrão do Supabase. Para aparecer **SpecFlow**:

1. **Project Settings** → **Authentication** → **SMTP Settings** (ou **Authentication** → **SMTP**).
2. Ative **Enable custom SMTP** (Resend, SendGrid, Amazon SES, etc.).
3. Preencha o SMTP do seu domínio verificado.
4. **Sender name** = `SpecFlow`
5. **Sender email** = algo como `noreply@seudominio.com` (domínio verificado no provedor).

Sem SMTP custom, o HTML personalizado pode funcionar, mas o remetente pode continuar como `Supabase Auth <noreply@mail.app.supabase.io>`.

### 3. Site URL (logo e links corretos)

**Authentication** → **URL Configuration**:

| Campo | Valor |
|-------|--------|
| **Site URL** | Domínio público da app (ex. `https://app.specflow.com.br`) |
| **Redirect URLs** | `https://seu-dominio/**` e `http://localhost:3000/**` (dev) |

Na Vercel/host:

```env
NEXT_PUBLIC_SITE_URL=https://app.specflow.com.br
```

O logo no e-mail usa `{{ .SiteURL }}/brand/specflow-landing-logo.png` — o ficheiro já está em `public/brand/`.

### 4. Testar

1. Na app: **Esqueci a senha** ou painel admin **Redefinir senha**.
2. Abra o e-mail — deve mostrar cabeçalho SpecFlow, botão azul e rodapé "Enviado por SpecFlow".
3. Se ainda vier o template antigo, confirme que guardou o template **Reset password** e aguarde 1–2 minutos.

---

## Tabela de templates

| Tipo no painel | Ficheiro | Assunto |
|----------------|----------|---------|
| Confirm signup | `confirmation.html` | `Confirme o seu e-mail — SpecFlow` |
| Reset password | `recovery.html` | `Redefinir senha — SpecFlow` |
| Invite user | `invite.html` | `Convite para o SpecFlow` |

---

## Desenvolvimento local (`supabase start`)

O ficheiro `supabase/config.toml` já aponta para `./templates/*.html` e `sender_name = "SpecFlow"` no Inbucket. E-mails locais aparecem em http://localhost:54324 (Mailpit).

---

## Fluxo na app

- `requestPasswordResetForEmail` → redirect para `/reset-password` após o callback.
- Ver também `supabase/SETUP.md` (secções 4 e 5).
