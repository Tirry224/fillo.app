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

  insert into public.shops (slug, name, initial)
  values (trim(shop_slug), trim(shop_name), shop_initial)
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

revoke all on function public.register_shop(text, text) from public;
grant execute on function public.register_shop(text, text) to authenticated;

create policy "members can update their shops"
  on public.shops for update
  using (public.is_shop_member(id))
  with check (public.is_shop_member(id));
