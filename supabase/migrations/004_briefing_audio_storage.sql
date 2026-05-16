-- Bucket público para áudio do briefing (URL longa por projeto — uso via link direto).
insert into storage.buckets (id, name, public, file_size_limit)
values ('briefing-media', 'briefing-media', true, 52428800)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

-- Upload: apenas objetos sob pasta = id do projeto da empresa do usuário.
create policy "briefing-media insert company project"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'briefing-media'
    and exists (
      select 1
      from public.projects p
      join public.profiles pr on pr.company_id = p.company_id and pr.id = auth.uid()
      where p.id::text = (storage.foldername(storage.objects.name))[1]
    )
  );

create policy "briefing-media select company project"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'briefing-media'
    and exists (
      select 1
      from public.projects p
      join public.profiles pr on pr.company_id = p.company_id and pr.id = auth.uid()
      where p.id::text = (storage.foldername(storage.objects.name))[1]
    )
  );

create policy "briefing-media update company project"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'briefing-media'
    and exists (
      select 1
      from public.projects p
      join public.profiles pr on pr.company_id = p.company_id and pr.id = auth.uid()
      where p.id::text = (storage.foldername(storage.objects.name))[1]
    )
  );

create policy "briefing-media delete company project"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'briefing-media'
    and exists (
      select 1
      from public.projects p
      join public.profiles pr on pr.company_id = p.company_id and pr.id = auth.uid()
      where p.id::text = (storage.foldername(storage.objects.name))[1]
    )
  );
