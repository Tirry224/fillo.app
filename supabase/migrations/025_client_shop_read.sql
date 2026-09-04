-- 025_client_shop_read.sql
-- Un client doit pouvoir lire le nom/l'initiale de la boutique avec laquelle
-- il a une conversation (affichage de la liste "Mes conversations"). Portée
-- strictement limitée aux boutiques où il a effectivement une conversation
-- - pas un accès général à la table `shops`.

create policy "clients can view shops they have a conversation with"
  on public.shops for select
  using (
    exists (
      select 1
      from public.conversations c
      join public.clients cl on cl.id = c.client_id
      where c.shop_id = shops.id
        and cl.user_id = auth.uid()
    )
  );
