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
  on conflict (shop_id, normalized_phone) do update
    set initials = excluded.initials,
        name = excluded.name,
        phone = excluded.phone
  returning id into target_client_id;

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
    shop_id, client_id, request_id, product, message, status, photo_path
  ) values (
    target_shop_id,
    target_client_id,
    target_request_id,
    trim(request_text),
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

revoke all on function public.submit_public_request(text, text, text, text, text) from public;
grant execute on function public.submit_public_request(text, text, text, text, text) to anon, authenticated;
