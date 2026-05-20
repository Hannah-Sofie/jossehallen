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
-- Row Level Security
-- Anon kan: se aktive kurs/tider/instruktorer, melde seg på kurs, booke tid.
-- Authenticated (= admin) kan: alt.
-- =========================================================================

alter table instruktorer          enable row level security;
alter table kurs                  enable row level security;
alter table kurspaameldinger      enable row level security;
alter table tilgjengelige_tider   enable row level security;
alter table bookinger             enable row level security;

drop policy if exists "instruktorer_select_alle" on instruktorer;
drop policy if exists "instruktorer_admin_all"   on instruktorer;
create policy "instruktorer_select_alle" on instruktorer for select to anon, authenticated using (true);
create policy "instruktorer_admin_all"   on instruktorer for all    to authenticated using (true) with check (true);

drop policy if exists "kurs_select_alle" on kurs;
drop policy if exists "kurs_admin_all"   on kurs;
create policy "kurs_select_alle" on kurs for select to anon, authenticated using (true);
create policy "kurs_admin_all"   on kurs for all    to authenticated using (true) with check (true);

drop policy if exists "paameldinger_insert_alle" on kurspaameldinger;
drop policy if exists "paameldinger_admin_all"   on kurspaameldinger;
create policy "paameldinger_insert_alle" on kurspaameldinger for insert to anon, authenticated with check (true);
create policy "paameldinger_admin_all"   on kurspaameldinger for all    to authenticated using (true) with check (true);

drop policy if exists "tider_select_alle" on tilgjengelige_tider;
drop policy if exists "tider_admin_all"   on tilgjengelige_tider;
create policy "tider_select_alle" on tilgjengelige_tider for select to anon, authenticated using (true);
create policy "tider_admin_all"   on tilgjengelige_tider for all    to authenticated using (true) with check (true);

drop policy if exists "bookinger_insert_alle" on bookinger;
drop policy if exists "bookinger_admin_all"   on bookinger;
create policy "bookinger_insert_alle" on bookinger for insert to anon, authenticated with check (true);
create policy "bookinger_admin_all"   on bookinger for all    to authenticated using (true) with check (true);

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
