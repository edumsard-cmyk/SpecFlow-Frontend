-- ============================================================
-- SpecFlow — Schema inicial
-- ============================================================

-- Extensões
create extension if not exists "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────
create type user_role as enum ('admin', 'company', 'user');
create type project_status as enum (
  'briefing', 'refinement', 'specification',
  'documentation', 'manual', 'done'
);
create type document_type as enum ('spec', 'manual', 'doc');
create type input_type as enum ('text', 'audio', 'document', 'form');
create type message_role as enum ('ai', 'user');

-- ── companies ────────────────────────────────────────────────
create table companies (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ── profiles (espelho de auth.users) ────────────────────────
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text not null,
  email       text not null,
  role        user_role not null default 'user',
  company_id  uuid references companies(id) on delete set null,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ── projects ─────────────────────────────────────────────────
create table projects (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  company_id  uuid not null references companies(id) on delete cascade,
  created_by  uuid not null references profiles(id),
  status      project_status not null default 'briefing',
  progress    smallint not null default 0 check (progress between 0 and 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── briefings ────────────────────────────────────────────────
create table briefings (
  id            uuid primary key default uuid_generate_v4(),
  project_id    uuid not null references projects(id) on delete cascade,
  input_type    input_type not null default 'text',
  content       text not null,
  audio_url     text,
  document_url  text,
  created_at    timestamptz not null default now()
);

-- ── refinement_messages ──────────────────────────────────────
create table refinement_messages (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references projects(id) on delete cascade,
  role        message_role not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- ── user_stories ─────────────────────────────────────────────
create table user_stories (
  id                   uuid primary key default uuid_generate_v4(),
  project_id           uuid not null references projects(id) on delete cascade,
  code                 text not null,  -- ex: US-01
  title                text not null,
  description          text not null,
  acceptance_criteria  jsonb not null default '[]'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ── documents ────────────────────────────────────────────────
create table documents (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references projects(id) on delete cascade,
  type        document_type not null,
  content     text not null,
  version     smallint not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Triggers: updated_at ─────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

create trigger user_stories_updated_at
  before update on user_stories
  for each row execute function set_updated_at();

create trigger documents_updated_at
  before update on documents
  for each row execute function set_updated_at();

-- ── Trigger: novo usuário → cria profile ────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Índices ──────────────────────────────────────────────────
create index projects_company_id_idx on projects(company_id);
create index projects_created_by_idx on projects(created_by);
create index projects_status_idx on projects(status);
create index briefings_project_id_idx on briefings(project_id);
create index refinement_messages_project_id_idx on refinement_messages(project_id);
create index user_stories_project_id_idx on user_stories(project_id);
create index documents_project_id_idx on documents(project_id);
create index profiles_company_id_idx on profiles(company_id);
