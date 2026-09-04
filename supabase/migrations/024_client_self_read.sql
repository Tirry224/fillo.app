-- 024_client_self_read.sql
-- Un client authentifié doit pouvoir lire ses propres fiches `clients` (une
-- par boutique avec laquelle il a échangé) : sans ça, les policies RLS de
-- `conversations`/`messages` qui vérifient "clients.user_id = auth.uid()"
-- via une sous-requête sur `clients` échouent silencieusement, puisque
-- cette sous-requête est elle-même soumise au RLS de `clients` (seule
-- `is_shop_member(shop_id)` existait jusqu'ici, donc rien n'était visible
-- pour le client). Portée strictement limitée à ses propres lignes.

create policy "clients can read their own client rows"
  on public.clients for select
  using (user_id = auth.uid());
