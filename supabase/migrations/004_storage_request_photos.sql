-- 004_storage_request_photos.sql
-- Création du bucket public 'request-photos' pour les images transmises par les clients

insert into storage.buckets (id, name, public)
values ('request-photos', 'request-photos', true)
on conflict (id) do nothing;

-- Politique RLS 1 : Autoriser tout le monde (clients anonymes et authentifiés) à téléverser des photos
create policy "Allow public upload to request-photos"
  on storage.objects for insert
  with check (bucket_id = 'request-photos');

-- Politique RLS 2 : Autoriser tout le monde à lire/afficher les photos publiques
create policy "Allow public view request-photos"
  on storage.objects for select
  using (bucket_id = 'request-photos');
