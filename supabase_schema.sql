create table profiles (id uuid primary key, phone text unique, role text check (role in ('driver','client')), created_at timestamp default now());
create table orders (id uuid primary key default gen_random_uuid(), type text check (type in ('transport','colis','cargo','rental','makla','souk','heavy')), distance_km numeric, price numeric, commission numeric, driver_id uuid references profiles(id), status text check (status in ('pending','accepted','in_progress','done','cancelled')) default 'pending', from_lat numeric, from_lng numeric, to_lat numeric, to_lng numeric, same_customer boolean default false, created_at timestamp default now());
create table driver_debts (driver_id uuid primary key references profiles(id), accumulated numeric default 0, expires_at timestamp, status text default 'active', color text default 'green');
create table driver_payments (id uuid primary key default gen_random_uuid(), driver_id uuid references profiles(id), amount numeric, method text, created_at timestamp default now());
create table rental_orders (id uuid primary key default gen_random_uuid(), car_type text, days int, with_driver boolean, total_price numeric, deposit numeric, status text default 'pending', created_at timestamp default now());
create table car_fleet (id uuid primary key default gen_random_uuid(), owner_id uuid references profiles(id), car_type text, daily_price numeric, weekly_price numeric, with_driver boolean);
alter table driver_debts enable row level security;
create policy "driver read own debts" on driver_debts for select using (auth.uid() = driver_id);
create policy "driver read own payments" on driver_payments for select using (auth.uid() = driver_id);
