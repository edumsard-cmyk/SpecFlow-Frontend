-- ============================================================
-- SpecFlow — Row Level Security Policies
-- ============================================================

-- ── Habilitar RLS ────────────────────────────────────────────
alter table companies           enable row level security;
alter table profiles            enable row level security;
alter table projects            enable row level security;
alter table briefings           enable row level security;
alter table refinement_messages enable row level security;
alter table user_stories        enable row level security;
alter table documents           enable row level security;

-- ── Helper: papel do usuário atual ──────────────────────────
create or replace function auth_role()
returns user_role language sql security definer stable as $$
  select role from profiles where id = auth.uid()
$$;

-- ── Helper: company_id do usuário atual ─────────────────────
create or replace function auth_company_id()
returns uuid language sql security definer stable as $$
  select company_id from profiles where id = auth.uid()
$$;

-- ============================================================
-- companies
-- ============================================================
-- Admin vê tudo; usuário vê apenas sua empresa
create policy "companies: admin select all"
  on companies for select
  using (auth_role() = 'admin');

create policy "companies: member select own"
  on companies for select
  using (id = auth_company_id());

create policy "companies: admin insert"
  on companies for insert
  with check (auth_role() = 'admin');

create policy "companies: admin update"
  on companies for update
  using (auth_role() = 'admin');

create policy "companies: admin delete"
  on companies for delete
  using (auth_role() = 'admin');

-- ============================================================
-- profiles
-- ============================================================
-- Usuário vê o próprio perfil e demais da mesma empresa
create policy "profiles: select own"
  on profiles for select
  using (id = auth.uid());

create policy "profiles: select same company"
  on profiles for select
  using (company_id = auth_company_id());

create policy "profiles: admin select all"
  on profiles for select
  using (auth_role() = 'admin');

create policy "profiles: update own"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: admin manage"
  on profiles for all
  using (auth_role() = 'admin');

-- ============================================================
-- projects
-- ============================================================
-- Membros da empresa veem e editam projetos da empresa
create policy "projects: company member select"
  on projects for select
  using (company_id = auth_company_id());

create policy "projects: company member insert"
  on projects for insert
  with check (
    company_id = auth_company_id()
    and created_by = auth.uid()
  );

create policy "projects: company member update"
  on projects for update
  using (company_id = auth_company_id());

create policy "projects: company member delete"
  on projects for delete
  using (
    company_id = auth_company_id()
    and (created_by = auth.uid() or auth_role() = 'company')
  );

create policy "projects: admin all"
  on projects for all
  using (auth_role() = 'admin');

-- ============================================================
-- briefings
-- ============================================================
create policy "briefings: via project"
  on briefings for all
  using (
    project_id in (
      select id from projects where company_id = auth_company_id()
    )
  );

create policy "briefings: admin all"
  on briefings for all
  using (auth_role() = 'admin');

-- ============================================================
-- refinement_messages
-- ============================================================
create policy "refinement_messages: via project"
  on refinement_messages for all
  using (
    project_id in (
      select id from projects where company_id = auth_company_id()
    )
  );

create policy "refinement_messages: admin all"
  on refinement_messages for all
  using (auth_role() = 'admin');

-- ============================================================
-- user_stories
-- ============================================================
create policy "user_stories: via project"
  on user_stories for all
  using (
    project_id in (
      select id from projects where company_id = auth_company_id()
    )
  );

create policy "user_stories: admin all"
  on user_stories for all
  using (auth_role() = 'admin');

-- ============================================================
-- documents
-- ============================================================
create policy "documents: via project"
  on documents for all
  using (
    project_id in (
      select id from projects where company_id = auth_company_id()
    )
  );

create policy "documents: admin all"
  on documents for all
  using (auth_role() = 'admin');
