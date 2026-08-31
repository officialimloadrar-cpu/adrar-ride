
-- Universal orders table
create table if not exists public.orders(
 id uuid primary key default gen_random_uuid(),
 type text check (type in ('transport','colis')) not null,
 mode text,
 distance_km float,
 weight_kg float,
 seats int,
 price int not null,
 status text default 'pending',
 meta jsonb,
 created_at timestamp with time zone default now()
);
create table if not exists public.debts(
 id uuid primary key default gen_random_uuid(),
 driver_id text not null,
 amount int not null,
 reason text,
 created_at timestamp with time zone default now()
);
alter table public.orders enable row level security;
alter table public.debts enable row level security;
create policy "allow all" on public.orders for all using (true) with check (true);
create policy "allow all" on public.debts for all using (true) with check (true);
