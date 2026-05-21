-- Auth + roller.
-- Brukerprofil med rolle, auto-opprettelse ved registrering, rolle-helpers,
-- og oppdaterte RLS-policies. Kjør i Supabase SQL Editor.

-- ============================================================================
-- 1. Rolle-enum + brukerprofil
-- ============================================================================

do $$ begin
  create type brukerrolle as enum ('bruker', 'instruktor', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists brukerprofil (
  bruker_id  uuid        primary key references auth.users(id) on delete cascade,
  rolle      brukerrolle not null default 'bruker',
  fornavn    text        not null default '',
  etternavn  text        not null default '',
  telefon    text        not null default '',
  adresse    text        not null default '',
  postnummer text        not null default '',
  poststed   text        not null default '',
  opprettet  timestamptz not null default now(),
  oppdatert  timestamptz not null default now()
);

-- ============================================================================
-- 2. Auto-opprett profil når ny auth-bruker registreres
-- ============================================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.brukerprofil (bruker_id, fornavn, etternavn, telefon, adresse, postnummer, poststed)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'fornavn', ''),
    coalesce(new.raw_user_meta_data->>'etternavn', ''),
    coalesce(new.raw_user_meta_data->>'telefon', ''),
    coalesce(new.raw_user_meta_data->>'adresse', ''),
    coalesce(new.raw_user_meta_data->>'postnummer', ''),
    coalesce(new.raw_user_meta_data->>'poststed', '')
  )
  on conflict (bruker_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- 3. Rolle-helpers (security definer → omgår RLS, unngår rekursjon)
-- ============================================================================

create or replace function is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from brukerprofil where bruker_id = auth.uid() and rolle = 'admin'
  );
$$;

create or replace function is_admin_or_instruktor()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from brukerprofil
    where bruker_id = auth.uid() and rolle in ('admin', 'instruktor')
  );
$$;

-- ============================================================================
-- 4. RLS for brukerprofil
-- ============================================================================

alter table brukerprofil enable row level security;

drop policy if exists "profil_egen_select" on brukerprofil;
drop policy if exists "profil_egen_update" on brukerprofil;
drop policy if exists "profil_admin_all"   on brukerprofil;

create policy "profil_egen_select" on brukerprofil
  for select to authenticated using (bruker_id = auth.uid() or is_admin());
create policy "profil_egen_update" on brukerprofil
  for update to authenticated using (bruker_id = auth.uid()) with check (bruker_id = auth.uid());
create policy "profil_admin_all" on brukerprofil
  for all to authenticated using (is_admin()) with check (is_admin());

-- ============================================================================
-- 5. Oppdater eksisterende policies fra "alle authenticated = admin"
--    til ekte rolle-sjekk.
-- ============================================================================

-- Kurs: instruktør/admin kan skrive (instruktør-eierskap forfines i #14)
drop policy if exists "kurs_admin_all" on kurs;
create policy "kurs_admin_all" on kurs
  for all to authenticated using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());

-- Påmeldinger: instruktør/admin kan lese/endre
drop policy if exists "paameldinger_admin_all" on kurspaameldinger;
create policy "paameldinger_admin_all" on kurspaameldinger
  for all to authenticated using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());

-- Instruktorer: kun admin kan skrive
drop policy if exists "instruktorer_admin_all" on instruktorer;
create policy "instruktorer_admin_all" on instruktorer
  for all to authenticated using (is_admin()) with check (is_admin());

-- Tilgjengelige tider: kun admin
drop policy if exists "tider_admin_all" on tilgjengelige_tider;
create policy "tider_admin_all" on tilgjengelige_tider
  for all to authenticated using (is_admin()) with check (is_admin());

-- Bookinger: admin/instruktør kan lese/endre alt (insert forblir åpent fra før)
drop policy if exists "bookinger_admin_all" on bookinger;
create policy "bookinger_admin_all" on bookinger
  for all to authenticated using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());
