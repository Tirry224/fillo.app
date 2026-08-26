create extension if not exists pgcrypto;

create table public.shops (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  initial text not null,
  created_at timestamptz not null default now()
);

create table public.shop_members (
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (shop_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  initials text not null,
  name text not null,
  phone text not null,
  normalized_phone text not null,
  color text not null default 'blue' check (color in ('blue', 'orange', 'green')),
  created_at timestamptz not null default now(),
  unique (shop_id, normalized_phone)
);

create table public.client_requests (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  detail text not null,
  message text not null,
  photo_path text,
  created_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  request_id uuid not null references public.client_requests(id) on delete cascade,
  product text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'pending', 'completed', 'lost')),
  photo_path text,
  created_at timestamptz not null default now()
);

create index clients_shop_id_idx on public.clients(shop_id);
create index client_requests_shop_id_idx on public.client_requests(shop_id);
create index sales_shop_id_created_at_idx on public.sales(shop_id, created_at desc);

create or replace function public.is_shop_member(target_shop_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.shop_members
    where shop_id = target_shop_id
      and user_id = auth.uid()
  );
$$;

alter table public.shops enable row level security;
alter table public.shop_members enable row level security;
alter table public.clients enable row level security;
alter table public.client_requests enable row level security;
alter table public.sales enable row level security;

create policy "members can view their shops"
  on public.shops for select
  using (public.is_shop_member(id));

create policy "members can view their memberships"
  on public.shop_members for select
  using (user_id = auth.uid());

create policy "members can read clients"
  on public.clients for select
  using (public.is_shop_member(shop_id));

create policy "members can write clients"
  on public.clients for all
  using (public.is_shop_member(shop_id))
  with check (public.is_shop_member(shop_id));

create policy "members can read requests"
  on public.client_requests for select
  using (public.is_shop_member(shop_id));

create policy "members can write requests"
  on public.client_requests for all
  using (public.is_shop_member(shop_id))
  with check (public.is_shop_member(shop_id));

create policy "members can read sales"
  on public.sales for select
  using (public.is_shop_member(shop_id));

create policy "members can write sales"
  on public.sales for all
  using (public.is_shop_member(shop_id))
  with check (public.is_shop_member(shop_id));
