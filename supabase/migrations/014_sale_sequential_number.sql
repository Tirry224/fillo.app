-- Numéro de vente court et lisible (ex: #FL-892) au lieu de l'UUID brut.
-- sale_number est un compteur séquentiel par boutique, stocké sur shops
-- pour rester incrémenté atomiquement (verrouillage de la ligne shop lors
-- de l'update) quel que soit le point d'entrée qui crée la vente
-- (RPC publique submit_public_request ou ajout manuel côté commerçant).
alter table public.shops
  add column if not exists sale_counter integer not null default 0;

alter table public.sales
  add column if not exists sale_number integer;

create or replace function public.set_sale_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.sale_number is null then
    update public.shops
      set sale_counter = sale_counter + 1
      where id = new.shop_id
      returning sale_counter into new.sale_number;
  end if;
  return new;
end;
$$;

drop trigger if exists sales_set_sale_number on public.sales;
create trigger sales_set_sale_number
  before insert on public.sales
  for each row
  execute function public.set_sale_number();

-- Backfill : numérote les ventes existantes par boutique, dans l'ordre de
-- création, puis aligne le compteur de chaque boutique sur son maximum.
with numbered as (
  select id, shop_id, row_number() over (partition by shop_id order by created_at) as rn
  from public.sales
)
update public.sales s
  set sale_number = numbered.rn
  from numbered
  where s.id = numbered.id;

update public.shops sh
  set sale_counter = coalesce(
    (select max(s.sale_number) from public.sales s where s.shop_id = sh.id),
    0
  );

alter table public.sales
  alter column sale_number set not null;
