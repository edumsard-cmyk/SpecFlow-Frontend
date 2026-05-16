-- Adiciona 'conclusion' ao enum (compatível com Postgres/Supabase)
DO $$
BEGIN
  ALTER TYPE project_status ADD VALUE 'conclusion';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

NOTIFY pgrst, 'reload schema';
