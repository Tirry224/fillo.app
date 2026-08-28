-- Le son de notification temps réel (qui écoutait les INSERT sur sales via
-- Realtime, voir 015_sales_realtime.sql) est remplacé par une notification
-- email envoyée depuis le serveur. La réplication Realtime sur sales n'a
-- plus de consommateur dans le code : on la retire.
do $$
begin
  if exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'sales'
  ) then
    alter publication supabase_realtime drop table public.sales;
  end if;
end $$;
