-- 021_client_password_reset.sql
-- Prépare le lien entre une fiche client (par boutique) et un futur compte
-- Fillo client (auth.users, identifié par téléphone), et ajoute un mécanisme
-- de réinitialisation de mot de passe assistée par le commerçant : sans SMS
-- ni email, le seul canal de récupération réaliste pour un compte identifié
-- par téléphone est que la boutique (qui connaît déjà ce client) relaie
-- elle-même un mot de passe temporaire, par exemple sur WhatsApp.
--
-- Garde-fous appliqués :
-- 1) Seule la boutique à laquelle appartient déjà la fiche cliente peut
--    déclencher la réinitialisation, et uniquement si ce client a déjà activé
--    un compte Fillo (clients.user_id renseigné) via CETTE boutique.
-- 2) Le mot de passe temporaire est écrit dans raw_user_meta_data avec la
--    boutique et l'horodatage de la réinitialisation : le client peut voir
--    "réinitialisé par {boutique} le {date}" dès sa prochaine connexion.
-- 3) must_change_password force un changement de mot de passe à la prochaine
--    connexion (appliqué côté application, dans le flux de login client à
--    venir) ; password_reset_at permet à ce même flux de refuser un mot de
--    passe temporaire trop ancien (ex. plus de 15 minutes).

alter table public.clients
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists clients_user_id_idx on public.clients(user_id);

create or replace function public.shop_reset_client_password(target_client_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_shop_id uuid;
  v_client_user_id uuid;
  v_shop_name text;
  v_temp_password text;
begin
  select shop_id, user_id into v_shop_id, v_client_user_id
  from public.clients
  where id = target_client_id;

  if v_shop_id is null then
    raise exception 'Client introuvable';
  end if;

  if not public.is_shop_member(v_shop_id) then
    raise exception 'Accès refusé';
  end if;

  if v_client_user_id is null then
    raise exception 'Ce client n''a pas encore de compte Fillo';
  end if;

  select name into v_shop_name from public.shops where id = v_shop_id;

  v_temp_password := regexp_replace(
    encode(gen_random_bytes(9), 'base64'),
    '[^a-zA-Z0-9]', '', 'g'
  );

  update auth.users
    set encrypted_password = crypt(v_temp_password, gen_salt('bf')),
        raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
          'must_change_password', true,
          'password_reset_by_shop', v_shop_name,
          'password_reset_at', now()
        ),
        updated_at = now()
    where id = v_client_user_id;

  return jsonb_build_object('temporary_password', v_temp_password);
end;
$$;

revoke all on function public.shop_reset_client_password(uuid) from public;
grant execute on function public.shop_reset_client_password(uuid) to authenticated;
