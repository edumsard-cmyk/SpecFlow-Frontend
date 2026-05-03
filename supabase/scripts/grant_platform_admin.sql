-- =============================================================================
-- Etapa manual: tornar um utilizador administrador da PLATAFORMA (SpecFlow)
-- =============================================================================
-- Pré-requisitos:
--   1) O utilizador já se cadastrou (existe em auth.users e em public.profiles).
--   2) Execute no Supabase: SQL Editor → New query → cole este ficheiro ajustado → Run.
--
-- NÃO inclua este ficheiro como migration automática (cada ambiente tem admins diferentes).

-- Substitua pelo e-mail exato da conta (o mesmo do login).
update public.profiles
set role = 'admin'::user_role
where lower(trim(email)) = lower(trim('seu-email@exemplo.com'));

-- Confirme (opcional):
-- select id, email, role, company_id from public.profiles where role = 'admin';
