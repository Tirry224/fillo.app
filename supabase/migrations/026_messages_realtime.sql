-- 026_messages_realtime.sql
-- Active la réplication Realtime sur messages pour que la messagerie
-- affiche les nouveaux messages sans recharger la page (côté client comme
-- côté commerçant). La RLS existante ("participants can read messages")
-- continue de s'appliquer aux événements Realtime : chacun ne reçoit que les
-- messages des conversations auxquelles il a effectivement accès (même
-- principe que 018_sales_realtime_dashboard.sql pour les ventes).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
