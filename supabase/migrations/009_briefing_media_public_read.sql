-- Bucket briefing-media é público: permite leitura via URL pública e players no browser.
-- (Upload continua restrito a utilizadores autenticados da empresa do projeto.)

drop policy if exists "briefing-media public read" on storage.objects;

create policy "briefing-media public read"
  on storage.objects for select
  to public
  using (bucket_id = 'briefing-media');
