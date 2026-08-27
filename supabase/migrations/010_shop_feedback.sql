create table public.shop_feedback (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create index shop_feedback_shop_id_idx on public.shop_feedback(shop_id);

alter table public.shop_feedback enable row level security;

create policy "members can submit feedback"
  on public.shop_feedback for insert
  with check (public.is_shop_member(shop_id) and user_id = auth.uid());

grant insert on public.shop_feedback to authenticated;
