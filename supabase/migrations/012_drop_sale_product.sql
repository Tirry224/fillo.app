-- sales.product a toujours été rempli avec la même valeur que sales.message
-- (submit_public_request n'a qu'un seul champ de texte côté formulaire public) :
-- la colonne était redondante. On la supprime et on ajuste la RPC en
-- conséquence.
create or replace function public.submit_public_request(
  target_shop_slug text,
  customer_name text,
  customer_phone text,
  request_text text,
  request_photo_path text default null
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

  select id into target_shop_id
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
    shop_id, client_id, title, detail, message, photo_path
  ) values (
    target_shop_id,
    target_client_id,
    trim(request_text),
    'Reçu à l''instant via le formulaire client',
    trim(request_text),
    request_photo_path
  )
  returning id into target_request_id;

  insert into public.sales (
    shop_id, client_id, request_id, message, status, photo_path
  ) values (
    target_shop_id,
    target_client_id,
    target_request_id,
    trim(request_text),
    'new',
    request_photo_path
  );

  return jsonb_build_object(
    'request_id', target_request_id,
    'client_id', target_client_id
  );
end;
$$;

alter table public.sales drop column product;
