-- 009_grant_authenticated_table_access.sql
-- Les tables ont été créées via des migrations SQL brutes plutôt que via
-- l'éditeur de tables du dashboard Supabase, qui accorde automatiquement
-- les privilèges de base aux rôles anon/authenticated. Sans ce GRANT, le
-- rôle "authenticated" reçoit "permission denied" avant même que les
-- policies RLS ne soient évaluées : les policies restent correctes mais
-- inopérantes, l'accès est bloqué en amont.
-- Les fonctions RPC (register_shop, submit_public_request, get_public_shop)
-- n'étaient pas concernées car SECURITY DEFINER : elles s'exécutent avec
-- les droits du propriétaire de la fonction, pas ceux de l'appelant.

grant usage on schema public to authenticated;

grant select, update on public.shops to authenticated;
grant select on public.shop_members to authenticated;
grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.client_requests to authenticated;
grant select, insert, update, delete on public.sales to authenticated;
