-- Jossehallen — komplett schema (Phase 2)
-- Kjør i Supabase SQL Editor (Project → SQL Editor → New query → lim inn → Run).
-- Safe å kjøre om igjen: alle CREATE bruker IF NOT EXISTS, policies droppes først.
--
-- Hvis du har en eksisterende DB fra Phase 1, kjør migrations/0001 + 0002
-- istedenfor å kjøre denne.

-- =========================================================================
-- Tabeller
-- =========================================================================

create table if not exists instruktorer (
  id          uuid        primary key default gen_random_uuid(),
  navn        text        not null,
  bio         text        not null default '',
  bilde_url   text,
  opprettet   timestamptz not null default now()
);

create table if not exists kurs (
  id             uuid        primary key default gen_random_uuid(),
  navn           text        not null,
  beskrivelse    text        not null default '',
  instruktor_id  uuid        references instruktorer(id) on delete set null,
  bilde_url      text,
  nivaa          text        not null default 'alle',         -- nybegynner|viderekomne|avansert|alle
  sted           text        not null default 'Jossehallen',
  tidspunkt      text        not null default '',             -- "Mandager 18:00–19:00"
  hva_laerer     text        not null default '',
  ta_med         text        not null default '',
  start_dato     date        not null,
  slutt_dato     date,
  pris           integer     not null default 0,              -- NOK heltall
  maks_deltakere integer     not null default 10,
  aktiv          boolean     not null default true,           -- false = utkast/skjult
  opprettet      timestamptz not null default now()
);

create index if not exists kurs_aktiv_start_idx on kurs (aktiv, start_dato);

do $$ begin
  create type paamelding_status as enum ('venter_betaling', 'bekreftet', 'avbrutt', 'venteliste');
exception when duplicate_object then null; end $$;

create table if not exists kurspaameldinger (
  id                   uuid              primary key default gen_random_uuid(),
  kurs_id              uuid              not null references kurs(id) on delete cascade,
  fornavn              text              not null,
  etternavn            text              not null,
  epost                text              not null,
  telefon              text              not null,
  adresse              text              not null default '',
  postnummer           text              not null default '',
  poststed             text              not null default '',
  hund_navn            text              not null,
  hund_alder           integer,
  hund_rase            text              not null default '',
  kastrert             boolean           not null default false,
  kommentar            text              not null default '',
  status               paamelding_status not null default 'venter_betaling',
  venteliste_posisjon  integer,
  vilkar_godtatt_dato  timestamptz,
  opprettet            timestamptz       not null default now()
);

create index if not exists kurspaameldinger_kurs_idx   on kurspaameldinger (kurs_id);
create index if not exists kurspaameldinger_status_idx on kurspaameldinger (status);

create table if not exists tilgjengelige_tider (
  id         uuid        primary key default gen_random_uuid(),
  dato       date        not null,
  start_tid  time        not null,
  slutt_tid  time        not null,
  ledig      boolean     not null default true,
  opprettet  timestamptz not null default now(),
  constraint tider_start_for_slutt check (start_tid < slutt_tid),
  unique (dato, start_tid, slutt_tid)
);

create index if not exists tider_ledig_dato_idx on tilgjengelige_tider (ledig, dato);

do $$ begin
  create type booking_status as enum ('venter_betaling', 'bekreftet', 'avbrutt');
exception when duplicate_object then null; end $$;

create table if not exists bookinger (
  id        uuid           primary key default gen_random_uuid(),
  tid_id    uuid           not null references tilgjengelige_tider(id) on delete restrict,
  navn      text           not null,                    -- splittes til fornavn/etternavn i #4
  epost     text           not null,
  telefon   text           not null,
  formaal   text           not null default '',
  status    booking_status not null default 'venter_betaling',
  opprettet timestamptz    not null default now()
);

create index if not exists bookinger_tid_idx    on bookinger (tid_id);
create index if not exists bookinger_status_idx on bookinger (status);

-- =========================================================================
-- Auth + roller: brukerprofil, auto-opprett-trigger, rolle-helpers
-- =========================================================================

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

create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
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
  after insert on auth.users for each row execute function handle_new_user();

create or replace function is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from brukerprofil where bruker_id = auth.uid() and rolle = 'admin');
$$;

create or replace function is_admin_or_instruktor()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from brukerprofil where bruker_id = auth.uid() and rolle in ('admin', 'instruktor'));
$$;

-- =========================================================================
-- Row Level Security
-- Anon: se aktive kurs/tider/instruktorer, melde på kurs, booke tid.
-- bruker: se/endre egen profil. instruktør: kurs+påmeldinger. admin: alt.
-- =========================================================================

alter table instruktorer          enable row level security;
alter table kurs                  enable row level security;
alter table kurspaameldinger      enable row level security;
alter table tilgjengelige_tider   enable row level security;
alter table bookinger             enable row level security;
alter table brukerprofil          enable row level security;

drop policy if exists "instruktorer_select_alle" on instruktorer;
drop policy if exists "instruktorer_admin_all"   on instruktorer;
create policy "instruktorer_select_alle" on instruktorer for select to anon, authenticated using (true);
create policy "instruktorer_admin_all"   on instruktorer for all    to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "kurs_select_alle" on kurs;
drop policy if exists "kurs_admin_all"   on kurs;
create policy "kurs_select_alle" on kurs for select to anon, authenticated using (true);
create policy "kurs_admin_all"   on kurs for all    to authenticated using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());

drop policy if exists "paameldinger_insert_alle" on kurspaameldinger;
drop policy if exists "paameldinger_admin_all"   on kurspaameldinger;
create policy "paameldinger_insert_alle" on kurspaameldinger for insert to anon, authenticated with check (true);
create policy "paameldinger_admin_all"   on kurspaameldinger for all    to authenticated using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());

drop policy if exists "tider_select_alle" on tilgjengelige_tider;
drop policy if exists "tider_admin_all"   on tilgjengelige_tider;
create policy "tider_select_alle" on tilgjengelige_tider for select to anon, authenticated using (true);
create policy "tider_admin_all"   on tilgjengelige_tider for all    to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "bookinger_insert_alle" on bookinger;
drop policy if exists "bookinger_admin_all"   on bookinger;
create policy "bookinger_insert_alle" on bookinger for insert to anon, authenticated with check (true);
create policy "bookinger_admin_all"   on bookinger for all    to authenticated using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());

drop policy if exists "profil_egen_select" on brukerprofil;
drop policy if exists "profil_egen_update" on brukerprofil;
drop policy if exists "profil_admin_all"   on brukerprofil;
create policy "profil_egen_select" on brukerprofil for select to authenticated using (bruker_id = auth.uid() or is_admin());
create policy "profil_egen_update" on brukerprofil for update to authenticated using (bruker_id = auth.uid()) with check (bruker_id = auth.uid());
create policy "profil_admin_all"   on brukerprofil for all    to authenticated using (is_admin()) with check (is_admin());

-- =========================================================================
-- View: kurs + antall ledige plasser (uten å lekke persondata til anon)
-- =========================================================================

create or replace view kurs_offentlig as
select
  k.id, k.navn, k.beskrivelse, k.instruktor_id, k.bilde_url, k.nivaa,
  k.sted, k.tidspunkt, k.hva_laerer, k.ta_med, k.start_dato, k.slutt_dato,
  k.pris, k.maks_deltakere, k.aktiv, k.opprettet,
  coalesce(p.antall_aktive, 0)::int as antall_aktive,
  greatest(k.maks_deltakere - coalesce(p.antall_aktive, 0), 0)::int as ledige_plasser
from kurs k
left join (
  select kurs_id, count(*) as antall_aktive
  from kurspaameldinger
  where status in ('venter_betaling', 'bekreftet')
  group by kurs_id
) p on p.kurs_id = k.id;

grant select on kurs_offentlig to anon, authenticated;

-- =========================================================================
-- Seed-data (valgfritt — fjern hvis ikke ønsket)
-- =========================================================================

insert into kurs (navn, beskrivelse, start_dato, slutt_dato, pris, maks_deltakere, nivaa, tidspunkt)
values
  ('Valpekurs',           'For valper 3–6 mnd. Grunnleggende sosialisering og lydighet.', current_date + 14, current_date + 56, 1800,  8, 'nybegynner', 'Mandager 18:00'),
  ('Hverdagslydighet',    'For voksne hunder. 6 kvelder med praktisk trening.',           current_date + 21, current_date + 63, 1600, 10, 'nybegynner', 'Tirsdager 19:00'),
  ('Agility nybegynner',  'Smakebit av agility. Krever god grunnlydighet.',               current_date + 28, current_date + 56, 2000,  6, 'viderekomne', 'Lørdager 11:00')
on conflict do nothing;

insert into tilgjengelige_tider (dato, start_tid, slutt_tid)
select
  current_date + i,
  start_tid,
  start_tid + interval '1 hour'
from generate_series(1, 14) as i,
     (values (time '09:00'), (time '10:30'), (time '17:00'), (time '18:30')) as t(start_tid)
on conflict do nothing;
