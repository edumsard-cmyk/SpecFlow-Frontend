-- Etapa Conclusão + resumo estruturado do refinamento
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'conclusion';

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS conclusion jsonb;

COMMENT ON COLUMN projects.conclusion IS 'Resumo estruturado gerado a partir do refinamento (summary, highlights, recommendations).';
