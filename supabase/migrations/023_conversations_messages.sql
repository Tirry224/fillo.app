-- 023_conversations_messages.sql
-- Schéma de la messagerie : une conversation relie une fiche client (par
-- boutique, table existante) à sa boutique, et regroupe ses messages. Une
-- seule conversation par (boutique, client) - pas de fils de discussion
-- multiples pour l'instant, cohérent avec le MVP demandé.
--
-- Le "non lu" est calculé (last_message_at comparé à shop/client_last_read_at)
-- plutôt que suivi message par message : suffisant pour le besoin actuel
-- (badge non-lu côté commerçant), plus simple à maintenir.

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  last_message_at timestamptz,
  shop_last_read_at timestamptz,
  client_last_read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (shop_id, client_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_role text not null check (sender_role in ('shop', 'client')),
  sender_user_id uuid not null references auth.users(id),
  body text not null,
  created_at timestamptz not null default now()
);

create index conversations_shop_id_idx on public.conversations(shop_id);
create index conversations_client_id_idx on public.conversations(client_id);
create index messages_conversation_id_created_at_idx on public.messages(conversation_id, created_at);

-- Tient last_message_at à jour automatiquement à chaque nouveau message,
-- plutôt que de compter sur chaque point d'entrée applicatif pour le faire
-- (même logique que le compteur sale_number, voir 014_sale_sequential_number.sql).
create or replace function public.touch_conversation_last_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
    set last_message_at = new.created_at
    where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_touch_conversation
  after insert on public.messages
  for each row
  execute function public.touch_conversation_last_message();

-- Vrai côté boutique OU côté client si l'appelant a légitimement accès à
-- cette conversation. Utilisée par les policies de `messages`, qui n'ont
-- pas directement shop_id/client_id pour s'appuyer sur is_shop_member.
create or replace function public.can_access_conversation(target_conversation_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.conversations c
    left join public.clients cl on cl.id = c.client_id
    where c.id = target_conversation_id
      and (
        public.is_shop_member(c.shop_id)
        or cl.user_id = auth.uid()
      )
  );
$$;

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "shop members can read their conversations"
  on public.conversations for select
  using (public.is_shop_member(shop_id));

create policy "shop members can write their conversations"
  on public.conversations for all
  using (public.is_shop_member(shop_id))
  with check (public.is_shop_member(shop_id));

create policy "clients can read their conversations"
  on public.conversations for select
  using (
    exists (
      select 1 from public.clients cl
      where cl.id = conversations.client_id
        and cl.user_id = auth.uid()
    )
  );

create policy "clients can start their conversations"
  on public.conversations for insert
  with check (
    exists (
      select 1 from public.clients cl
      where cl.id = conversations.client_id
        and cl.user_id = auth.uid()
    )
  );

create policy "clients can update their conversations"
  on public.conversations for update
  using (
    exists (
      select 1 from public.clients cl
      where cl.id = conversations.client_id
        and cl.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clients cl
      where cl.id = conversations.client_id
        and cl.user_id = auth.uid()
    )
  );

create policy "participants can read messages"
  on public.messages for select
  using (public.can_access_conversation(conversation_id));

-- sender_role doit correspondre à l'identité réelle de l'appelant : un
-- commerçant ne peut pas envoyer un message marqué "client" et inversement.
create policy "participants can send messages"
  on public.messages for insert
  with check (
    sender_user_id = auth.uid()
    and (
      (
        sender_role = 'shop'
        and exists (
          select 1 from public.conversations c
          where c.id = messages.conversation_id
            and public.is_shop_member(c.shop_id)
        )
      )
      or (
        sender_role = 'client'
        and exists (
          select 1 from public.conversations c
          join public.clients cl on cl.id = c.client_id
          where c.id = messages.conversation_id
            and cl.user_id = auth.uid()
        )
      )
    )
  );

grant select, insert, update on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;
