-- 006_public_shop_lookup_and_safety.sql
-- 1) Permet à la page publique /[shopSlug] de lire le nom réel d'une boutique
--    sans exposer les colonnes privées (phone, location, email) ni ouvrir
--    une policy SELECT publique sur la table shops.
-- 2) Empêche une demande publique de réécrire le nom/les initiales d'un
--    client existant (seul le téléphone, potentiellement reformaté, est
--    mis à jour) - la resoumission par un client légitime reste possible,
--    mais un tiers connaissant juste un numéro ne peut plus renommer un
--    client déjà enregistré chez le commerçant.
-- 3) register_shop : au lieu d'échouer si le slug est déjà pris, en génère
--    automatiquement une variante disponible (slug-2, slug-3, ...).

create or replace function public.get_public_shop(shop_slug text)
returns table(name text, initial text)
language sql
security definer
set search_path = public
stable
as $$
  select s.name, s.initial
  from public.shops s
  where s.slug = trim(shop_slug);
$$;

revoke all on function public.get_public_shop(text) from public;
grant execute on function public.get_public_shop(text) to anon, authenticated;

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
    set phone = excluded.phone
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

create or replace function public.register_shop(
  shop_name text,
  shop_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  new_shop_id uuid;
  shop_initial text;
  base_slug text;
  final_slug text;
  attempt int := 0;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Utilisateur non authentifié';
  end if;

  if nullif(trim(shop_name), '') is null or nullif(trim(shop_slug), '') is null then
    raise exception 'Nom de boutique invalide';
  end if;

  base_slug := trim(shop_slug);
  final_slug := base_slug;

  while exists (select 1 from public.shops where slug = final_slug) loop
    attempt := attempt + 1;
    if attempt > 50 then
      raise exception 'Impossible de générer un identifiant de boutique disponible';
    end if;
    final_slug := base_slug || '-' || (attempt + 1)::text;
  end loop;

  shop_initial := upper(left(trim(shop_name), 1));

  insert into public.shops (slug, name, initial)
  values (final_slug, trim(shop_name), shop_initial)
  returning id into new_shop_id;

  insert into public.shop_members (shop_id, user_id, role)
  values (new_shop_id, current_user_id, 'owner');

  return jsonb_build_object(
    'id', new_shop_id,
    'slug', final_slug,
    'name', trim(shop_name),
    'initial', shop_initial
  );
end;
$$;
