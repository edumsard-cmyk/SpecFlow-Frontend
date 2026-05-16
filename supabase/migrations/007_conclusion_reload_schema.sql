-- Garante coluna conclusion (se 006 não rodou) e recarrega cache da API Supabase
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'conclusion';

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS conclusion jsonb;

NOTIFY pgrst, 'reload schema';
