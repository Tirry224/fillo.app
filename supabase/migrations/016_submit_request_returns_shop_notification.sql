-- Le formulaire client déclenche désormais une notification par email au
-- commerçant (à la place du son temps réel). submit_public_request est
-- SECURITY DEFINER et peut donc lire les colonnes privées de shops (email,
-- email_notifications) sans les exposer via une policy RLS publique : ces
-- valeurs ne sont renvoyées qu'au serveur Next.js qui appelle cette
-- fonction (app/api/requests/route.ts), jamais directement au client final.

create or replace function public.submit_public_request(
  target_shop_slug text,
  customer_name text,
  customer_phone text,
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
  target_shop_name text;
  target_shop_email text;
  target_shop_email_notifications boolean;
  target_client_id uuid;
  target_request_id uuid;
  normalized_customer_phone text;
  customer_initials text;
  existing_client_id uuid;
  existing_client_name text;
begin
  if nullif(trim(target_shop_slug), '') is null
    or nullif(trim(customer_name), '') is null
    or nullif(trim(customer_phone), '') is null
    or nullif(trim(request_text), '') is null then
    raise exception 'Données invalides';
  end if;

  select id, name, email, email_notifications
    into target_shop_id, target_shop_name, target_shop_email, target_shop_email_notifications
  from public.shops
  where slug = trim(target_shop_slug);

  if target_shop_id is null then
    raise exception 'Boutique introuvable';
  end if;

  normalized_customer_phone := regexp_replace(customer_phone, '\D', '', 'g');
  customer_initials := upper(left(regexp_replace(trim(customer_name), '\s+', '', 'g'), 2));

  select id, name into existing_client_id, existing_client_name
  from public.clients
  where shop_id = target_shop_id
    and normalized_phone = normalized_customer_phone;

  if existing_client_id is not null then
    if lower(trim(existing_client_name)) <> lower(trim(customer_name)) then
      raise exception 'Ce numéro est déjà associé à un autre client de cette boutique.';
    end if;

    update public.clients
      set phone = trim(customer_phone)
      where id = existing_client_id;

    target_client_id := existing_client_id;
  else
    insert into public.clients (
      shop_id, initials, name, phone, normalized_phone, color
    ) values (
      target_shop_id,
      customer_initials,
      trim(customer_name),
      trim(customer_phone),
      normalized_customer_phone,
      'blue'
    )
    returning id into target_client_id;
  end if;

  insert into public.client_requests (
    shop_id, client_id, title, detail, message, photos
  ) values (
    target_shop_id,
    target_client_id,
    trim(request_text),
    'Reçu à l''instant via le formulaire client',
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

  return jsonb_build_object(
    'request_id', target_request_id,
    'client_id', target_client_id,
    'shop_name', target_shop_name,
    'shop_email', target_shop_email,
    'email_notifications', coalesce(target_shop_email_notifications, false)
  );
end;
$$;
