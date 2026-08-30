-- Réactive la réplication Realtime sur sales (retirée en 017 quand le son
-- de notification a été remplacé par un email), cette fois pour rafraîchir
-- automatiquement le tableau de bord du commerçant à l'arrivée d'une
-- nouvelle commande, sans qu'il ait à recharger la page manuellement. La
-- policy RLS "members can write sales" continue de s'appliquer aux
-- événements Realtime : un commerçant ne reçoit que ceux de sa propre
-- boutique.
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
