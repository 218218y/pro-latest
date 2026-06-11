-- WardrobePro multi-store Supabase Cloud Sync tables
--
-- Use this when multiple stores share the SAME Supabase project/account.
-- Existing Bargig table is intentionally left as public.wp_shared_state.
-- New stores get separate tables so their rooms/payloads do not collide.
--
-- IMPORTANT:
-- This matches the current app's open/no-login sync model.
-- Anyone with the anon key + room/table route can read/write that store table.
-- For real access control later, move to Auth + RLS policies or separate Supabase projects.

create or replace function public.wp_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -------------------------
-- Store 1
-- -------------------------
create table if not exists public.wp_shared_state_store_1 (
  room text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists wp_shared_state_store_1_set_updated_at on public.wp_shared_state_store_1;
create trigger wp_shared_state_store_1_set_updated_at
before update on public.wp_shared_state_store_1
for each row execute function public.wp_set_updated_at();

insert into public.wp_shared_state_store_1 (room, payload)
values ('public', '{}'::jsonb)
on conflict (room) do nothing;

alter table public.wp_shared_state_store_1 disable row level security;

drop policy if exists "public read" on public.wp_shared_state_store_1;
drop policy if exists "public insert" on public.wp_shared_state_store_1;
drop policy if exists "public update" on public.wp_shared_state_store_1;
drop policy if exists "public delete" on public.wp_shared_state_store_1;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.wp_shared_state_store_1 to anon;
grant select, insert, update, delete on table public.wp_shared_state_store_1 to authenticated;

-- -------------------------
-- Store 2
-- -------------------------
create table if not exists public.wp_shared_state_store_2 (
  room text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists wp_shared_state_store_2_set_updated_at on public.wp_shared_state_store_2;
create trigger wp_shared_state_store_2_set_updated_at
before update on public.wp_shared_state_store_2
for each row execute function public.wp_set_updated_at();

insert into public.wp_shared_state_store_2 (room, payload)
values ('public', '{}'::jsonb)
on conflict (room) do nothing;

alter table public.wp_shared_state_store_2 disable row level security;

drop policy if exists "public read" on public.wp_shared_state_store_2;
drop policy if exists "public insert" on public.wp_shared_state_store_2;
drop policy if exists "public update" on public.wp_shared_state_store_2;
drop policy if exists "public delete" on public.wp_shared_state_store_2;

grant select, insert, update, delete on table public.wp_shared_state_store_2 to anon;
grant select, insert, update, delete on table public.wp_shared_state_store_2 to authenticated;

-- Realtime note:
-- The app uses Supabase Realtime Broadcast as a lightweight hint channel and then pulls via REST.
-- No Postgres publication setup is required for Broadcast mode.
-- Store channel prefixes are configured in sites/store-1 and sites/store-2:
--   wp_cloud_sync_store_1
--   wp_cloud_sync_store_2
