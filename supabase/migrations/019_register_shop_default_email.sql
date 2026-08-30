-- shops.email n'était jamais renseigné à l'inscription : le bouton
-- "notifications email" (email_notifications, actif par défaut) reste donc
-- sans effet tant que le commerçant n'a pas lui-même saisi un email dans
-- Réglages > Commerce, puisque app/api/requests/route.ts n'envoie l'email
-- que si shops.email est renseigné. On utilise désormais l'email du compte
-- (auth.email(), disponible côté Supabase Auth pour l'utilisateur courant)
-- comme valeur par défaut à l'inscription, pour que les notifications
-- fonctionnent immédiatement sans étape manuelle supplémentaire. Le
-- commerçant garde la possibilité de le changer ensuite dans ses réglages.
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
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Utilisateur non authentifié';
  end if;

  if nullif(trim(shop_name), '') is null or nullif(trim(shop_slug), '') is null then
    raise exception 'Nom de boutique invalide';
  end if;

  if exists (select 1 from public.shops where slug = trim(shop_slug)) then
    raise exception 'Ce nom de boutique est déjà utilisé. Veuillez en choisir un autre.';
  end if;

  shop_initial := upper(left(trim(shop_name), 1));

  insert into public.shops (slug, name, initial, email)
  values (trim(shop_slug), trim(shop_name), shop_initial, auth.email())
  returning id into new_shop_id;

  insert into public.shop_members (shop_id, user_id, role)
  values (new_shop_id, current_user_id, 'owner');

  return jsonb_build_object(
    'id', new_shop_id,
    'slug', trim(shop_slug),
    'name', trim(shop_name),
    'initial', shop_initial
  );
end;
$$;

-- Rattrape les boutiques déjà inscrites avant ce correctif, dont l'email est
-- resté vide : reprend l'email du compte du propriétaire, sans écraser une
-- valeur déjà saisie manuellement dans Réglages > Commerce.
update public.shops
set email = (
  select u.email
  from public.shop_members sm
  join auth.users u on u.id = sm.user_id
  where sm.shop_id = shops.id and sm.role = 'owner'
  limit 1
)
where email is null;
