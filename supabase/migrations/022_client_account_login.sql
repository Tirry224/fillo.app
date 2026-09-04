-- 022_client_account_login.sql
-- Le compte Fillo d'un client utilise le même mécanisme que celui des
-- boutiques (email + mot de passe, natif Supabase Auth) : aucune inscription
-- téléphone Supabase n'est utilisée (elle exige un provider SMS payant, voir
-- discussion produit). Le client saisit son propre email à la création de
-- son compte, mais continue de se connecter avec son numéro de téléphone :
-- resolve_client_login_email retrouve l'email associé à un numéro déjà lié
-- à un compte, pour que le serveur (jamais le navigateur) appelle ensuite
-- signInWithPassword avec cet email.

create or replace function public.link_client_identity(p_phone text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_normalized_phone text;
begin
  if auth.uid() is null then
    raise exception 'Utilisateur non authentifié';
  end if;

  v_normalized_phone := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  if v_normalized_phone = '' then
    raise exception 'Numéro invalide';
  end if;

  -- Rattache toutes les fiches clients (une par boutique) déjà existantes
  -- pour ce numéro et pas encore liées à un compte, au compte qui vient de
  -- se créer/connecter. Ne touche jamais une fiche déjà liée à quelqu'un
  -- d'autre.
  update public.clients
    set user_id = auth.uid()
    where normalized_phone = v_normalized_phone
      and user_id is null;
end;
$$;

revoke all on function public.link_client_identity(text) from public;
grant execute on function public.link_client_identity(text) to authenticated;

create or replace function public.resolve_client_login_email(p_phone text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_normalized_phone text;
  v_user_id uuid;
  v_email text;
begin
  v_normalized_phone := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  if v_normalized_phone = '' then
    return null;
  end if;

  select user_id into v_user_id
    from public.clients
    where normalized_phone = v_normalized_phone
      and user_id is not null
    limit 1;

  if v_user_id is null then
    return null;
  end if;

  select email into v_email from auth.users where id = v_user_id;
  return v_email;
end;
$$;

revoke all on function public.resolve_client_login_email(text) from public;
grant execute on function public.resolve_client_login_email(text) to anon, authenticated;
