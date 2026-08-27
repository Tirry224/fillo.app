-- 007_storage_request_photos_limits.sql
-- Le bucket request-photos accepte des uploads anonymes (formulaire public).
-- Sans limite au niveau du bucket, n'importe qui peut appeler l'API Storage
-- directement (en dehors de l'app) pour déposer des fichiers volumineux ou
-- de type arbitraire. On restreint ça au niveau du bucket lui-même, ce qui
-- s'applique quel que soit le client qui appelle l'API.

update storage.buckets
set
  file_size_limit = 5242880, -- 5 Mo
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'request-photos';
