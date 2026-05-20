-- Jossehallen — initial schema
-- Kjør i Supabase SQL Editor (Project → SQL Editor → New query → lim inn → Run).
-- Safe å kjøre om igjen: alle CREATE bruker IF NOT EXISTS, policies droppes først.

-- =========================================================================
-- Tabeller
-- =========================================================================

create table if not exists kurs (
  id          uuid        primary key default gen_random_uuid(),
  navn        text        not null,
  beskrivelse text        not null default '',
  start_dato  date        not null,
  slutt_dato  date,
  pris        integer     not null default 0,           -- NOK heltall (ingen øre)
  maks_deltakere integer  not null default 10,
  aktiv       boolean     not null default true,        -- false = utkast/skjult
  opprettet   timestamptz not null default now()
);

create index if not exists kurs_aktiv_start_idx on kurs (aktiv, start_dato);

create type paamelding_status as enum ('venter_betaling', 'bekreftet', 'avbrutt');

create table if not exists kurspaameldinger (
  id           uuid              primary key default gen_random_uuid(),
  kurs_id      uuid              not null references kurs(id) on delete cascade,
  navn         text              not null,
  epost        text              not null,
  telefon      text              not null,
  hund_navn    text              not null,
  hund_rase    text              not null default '',
  kommentar    text              not null default '',
  status       paamelding_status not null default 'venter_betaling',
  opprettet    timestamptz       not null default now()
);

create index if not exists kurspaameldinger_kurs_idx on kurspaameldinger (kurs_id);
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

create type booking_status as enum ('venter_betaling', 'bekreftet', 'avbrutt');

create table if not exists bookinger (
  id        uuid           primary key default gen_random_uuid(),
  tid_id    uuid           not null references tilgjengelige_tider(id) on delete restrict,
  navn      text           not null,
  epost     text           not null,
  telefon   text           not null,
  formaal   text           not null default '',
  status    booking_status not null default 'venter_betaling',
  opprettet timestamptz    not null default now()
);

create index if not exists bookinger_tid_idx on bookinger (tid_id);
create index if not exists bookinger_status_idx on bookinger (status);

-- =========================================================================
-- Row Level Security
-- Anon kan: se aktive kurs, se ledige tider, melde seg på kurs, booke en tid.
-- Authenticated (= admin) kan: alt.
-- =========================================================================

alter table kurs                  enable row level security;
alter table kurspaameldinger      enable row level security;
alter table tilgjengelige_tider   enable row level security;
alter table bookinger             enable row level security;

-- KURS
drop policy if exists "kurs_select_alle"        on kurs;
drop policy if exists "kurs_admin_all"          on kurs;
create policy "kurs_select_alle" on kurs for select to anon, authenticated using (true);
create policy "kurs_admin_all"   on kurs for all    to authenticated using (true) with check (true);

-- KURSPAAMELDINGER
drop policy if exists "paameldinger_insert_alle" on kurspaameldinger;
drop policy if exists "paameldinger_admin_all"   on kurspaameldinger;
create policy "paameldinger_insert_alle" on kurspaameldinger for insert to anon, authenticated with check (true);
create policy "paameldinger_admin_all"   on kurspaameldinger for all    to authenticated using (true) with check (true);

-- TILGJENGELIGE_TIDER
drop policy if exists "tider_select_alle" on tilgjengelige_tider;
drop policy if exists "tider_admin_all"   on tilgjengelige_tider;
create policy "tider_select_alle" on tilgjengelige_tider for select to anon, authenticated using (true);
create policy "tider_admin_all"   on tilgjengelige_tider for all    to authenticated using (true) with check (true);

-- BOOKINGER
drop policy if exists "bookinger_insert_alle" on bookinger;
drop policy if exists "bookinger_admin_all"   on bookinger;
create policy "bookinger_insert_alle" on bookinger for insert to anon, authenticated with check (true);
create policy "bookinger_admin_all"   on bookinger for all    to authenticated using (true) with check (true);

-- =========================================================================
-- Seed-data (valgfritt — fjern hvis ikke ønsket)
-- =========================================================================

insert into kurs (navn, beskrivelse, start_dato, slutt_dato, pris, maks_deltakere)
values
  ('Valpekurs', 'For valper 3–6 mnd. Grunnleggende sosialisering og lydighet.', current_date + 14, current_date + 56, 1800, 8),
  ('Hverdagslydighet', 'For voksne hunder. 6 kvelder med praktisk trening.', current_date + 21, current_date + 63, 1600, 10),
  ('Agility nybegynner', 'Smakebit av agility. Krever god grunnlydighet.', current_date + 28, current_date + 56, 2000, 6)
on conflict do nothing;

insert into tilgjengelige_tider (dato, start_tid, slutt_tid)
select
  current_date + i,
  start_tid,
  start_tid + interval '1 hour'
from generate_series(1, 14) as i,
     (values (time '09:00'), (time '10:30'), (time '17:00'), (time '18:30')) as t(start_tid)
on conflict do nothing;
