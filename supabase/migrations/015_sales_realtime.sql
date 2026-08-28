-- Active la réplication Realtime sur sales pour le son/badge de nouvelle
-- demande côté commerçant (écoute des INSERT depuis le navigateur). La
-- RLS existante ("members can read sales") continue de s'appliquer aux
-- événements Realtime : un commerçant ne reçoit que les événements de sa
-- propre boutique.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'sales'
  ) then
    alter publication supabase_realtime add table public.sales;
  end if;
end $$;
