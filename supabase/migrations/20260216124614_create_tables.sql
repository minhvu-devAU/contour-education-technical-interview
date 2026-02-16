-- =============================================
-- students table
-- =============================================
create table public.students (
  id uuid primary key
    references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.students enable row level security;
alter table public.students force row level security;

create policy "Users can view own profile"
  on public.students for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.students for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.students for update to authenticated
  using ((select auth.uid()) = id);

-- =============================================
-- consultations table
-- =============================================
create table public.consultations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null
    references public.students(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  reason text not null,
  datetime timestamptz not null,
  is_complete boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index consultations_user_id_idx
  on public.consultations(user_id);

alter table public.consultations enable row level security;
alter table public.consultations force row level security;

create policy "Users can view own consultations"
  on public.consultations for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own consultations"
  on public.consultations for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own consultations"
  on public.consultations for update to authenticated
  using ((select auth.uid()) = user_id);
