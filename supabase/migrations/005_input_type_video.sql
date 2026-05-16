-- Inclui 'video' em input_type (alinhado com a UI de novo projeto e com src/lib/supabase/types.ts).
-- Idempotente: ignora se o valor já existir (PG 14+ sem IF NOT EXISTS em ADD VALUE).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'input_type'
      AND e.enumlabel = 'video'
  ) THEN
    ALTER TYPE input_type ADD VALUE 'video';
  END IF;
END
$$;
