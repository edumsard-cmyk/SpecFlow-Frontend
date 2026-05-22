-- Inclui 'images' em input_type (briefing guiado por imagens + texto).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'input_type'
      AND e.enumlabel = 'images'
  ) THEN
    ALTER TYPE input_type ADD VALUE 'images';
  END IF;
END
$$;
