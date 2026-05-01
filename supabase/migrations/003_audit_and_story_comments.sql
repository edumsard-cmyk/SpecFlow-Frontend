-- ============================================================
-- Auditoria + comentários em histórias (por código da US)
-- ============================================================

-- ── audit_logs ───────────────────────────────────────────────
create table audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  company_id  uuid references companies(id) on delete set null,
  user_id     uuid references profiles(id) on delete set null,
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index audit_logs_company_id_idx on audit_logs(company_id);
create index audit_logs_created_at_idx on audit_logs(created_at desc);
create index audit_logs_entity_idx on audit_logs(entity_type, entity_id);

alter table audit_logs enable row level security;

create policy "audit_logs: company or admin select"
  on audit_logs for select
  using (
    auth_role() = 'admin'
    or company_id = auth_company_id()
  );

create policy "audit_logs: member insert"
  on audit_logs for insert
  with check (
    user_id = auth.uid()
    and (
      auth_role() = 'admin'
      or company_id is null
      or company_id = auth_company_id()
    )
  );

-- ── story_comments (estável ao regravar histórias no mesmo código US-xx) ──
create table story_comments (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references projects(id) on delete cascade,
  story_code  text not null,
  user_id     uuid not null references profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index story_comments_project_id_idx on story_comments(project_id);
create index story_comments_story_idx on story_comments(project_id, story_code);

alter table story_comments enable row level security;

create policy "story_comments: select via project"
  on story_comments for select
  using (
    auth_role() = 'admin'
    or project_id in (
      select id from projects where company_id = auth_company_id()
    )
  );

create policy "story_comments: insert via project"
  on story_comments for insert
  with check (
    user_id = auth.uid()
    and project_id in (
      select id from projects where company_id = auth_company_id()
    )
  );

create policy "story_comments: delete own or admin"
  on story_comments for delete
  using (
    auth_role() = 'admin'
    or user_id = auth.uid()
  );
