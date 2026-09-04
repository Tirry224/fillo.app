-- 028_client_conversation_order.sql
-- Permet à un client de soumettre une nouvelle commande directement depuis
-- une conversation existante (même structure qu'un envoi via le formulaire
-- public : une fiche client_requests + une vente au statut "nouveau", voir
-- submit_public_request dans 016_submit_request_returns_shop_notification.sql)
-- sans avoir à ressaisir nom/téléphone, déjà connus via son compte et cette
-- conversation. SECURITY DEFINER car client_requests/sales ne sont
-- normalement écrits que par les membres de la boutique (voir policies dans
-- 001_initial_schema.sql) ; la fonction vérifie elle-même que l'appelant est
-- bien le client rattaché à cette conversation avant d'écrire quoi que ce soit.
create or replace function public.submit_client_conversation_order(
  target_conversation_id uuid,
  request_text text,
  request_photos text[] default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_shop_id uuid;
  target_client_id uuid;
  target_request_id uuid;
begin
  if nullif(trim(request_text), '') is null then
    raise exception 'Données invalides';
  end if;

  select c.shop_id, c.client_id into target_shop_id, target_client_id
  from public.conversations c
  join public.clients cl on cl.id = c.client_id
  where c.id = target_conversation_id
    and cl.user_id = auth.uid();

  if target_shop_id is null then
    raise exception 'Conversation introuvable';
  end if;

  insert into public.client_requests (
    shop_id, client_id, title, detail, message, photos
  ) values (
    target_shop_id,
    target_client_id,
    trim(request_text),
    'Reçu à l''instant via la messagerie',
    trim(request_text),
    request_photos
  )
  returning id into target_request_id;

  insert into public.sales (
    shop_id, client_id, request_id, message, status, photos
  ) values (
    target_shop_id,
    target_client_id,
    target_request_id,
    trim(request_text),
    'new',
    request_photos
  );

  return jsonb_build_object('request_id', target_request_id);
end;
$$;

grant execute on function public.submit_client_conversation_order(uuid, text, text[]) to authenticated;
