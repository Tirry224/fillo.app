-- 027_push_subscriptions.sql
-- Abonnements Web Push : chaque appareil/navigateur sur lequel un
-- utilisateur (commerçant ou client - les deux sont de simples utilisateurs
-- Supabase Auth, voir 022_client_account_login.sql) a activé les
-- notifications enregistre ici les identifiants nécessaires pour lui envoyer
-- une notification push depuis le serveur.

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

create index push_subscriptions_user_id_idx on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "users manage their own push subscriptions"
  on public.push_subscriptions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, delete on public.push_subscriptions to authenticated;

-- Retrouve les abonnements de l'autre partie d'une conversation, pour
-- notifier le destinataire d'un nouveau message. SECURITY DEFINER car
-- l'appelant (l'expéditeur du message) n'a normalement pas le droit de lire
-- les abonnements push de quelqu'un d'autre (policy ci-dessus le lui
-- interdit) - même logique que can_access_conversation.
create or replace function public.get_recipient_push_subscriptions(target_conversation_id uuid)
returns setof public.push_subscriptions
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  conv record;
begin
  select c.shop_id, c.client_id into conv
  from public.conversations c
  where c.id = target_conversation_id;

  if conv is null then
    return;
  end if;

  if public.is_shop_member(conv.shop_id) then
    -- L'appelant écrit côté boutique : notifier le client de la conversation.
    return query
      select ps.*
      from public.push_subscriptions ps
      join public.clients cl on cl.user_id = ps.user_id
      where cl.id = conv.client_id;
  else
    -- L'appelant écrit côté client : notifier tous les membres de la boutique.
    return query
      select ps.*
      from public.push_subscriptions ps
      join public.shop_members sm on sm.user_id = ps.user_id
      where sm.shop_id = conv.shop_id;
  end if;
end;
$$;

grant execute on function public.get_recipient_push_subscriptions(uuid) to authenticated;

-- Supprime un abonnement devenu invalide (le service push répond 404/410,
-- signe que l'utilisateur a désinstallé l'app ou révoqué la permission).
-- SECURITY DEFINER : c'est le serveur qui appelle ceci après une tentative
-- d'envoi, potentiellement pour un abonnement qui n'appartient pas à
-- l'expéditeur du message (voir get_recipient_push_subscriptions ci-dessus) ;
-- l'endpoint est un identifiant unique et non devinable fourni par le
-- navigateur, pas une donnée sensible à protéger davantage.
create or replace function public.delete_push_subscription(target_endpoint text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.push_subscriptions where endpoint = target_endpoint;
$$;

grant execute on function public.delete_push_subscription(text) to authenticated;
