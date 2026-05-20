-- Phase 2 schema-utvidelser.
-- Kjør i Supabase SQL Editor.
-- Idempotent — safe å kjøre om igjen.

-- ============================================================================
-- 1. Instruktør-tabell (erstatter text-kolonne fra 0001)
-- ============================================================================

create table if not exists instruktorer (
  id uuid primary key default gen_random_uuid(),
  navn text not null,
  bio text not null default '',
  bilde_url text,
  opprettet timestamptz not null default now()
);

alter table kurs drop column if exists instruktor;
alter table kurs add column if not exists instruktor_id uuid references instruktorer(id) on delete set null;

alter table instruktorer enable row level security;
drop policy if exists "instruktorer_select_alle" on instruktorer;
drop policy if exists "instruktorer_admin_all"   on instruktorer;
create policy "instruktorer_select_alle" on instruktorer for select to anon, authenticated using (true);
create policy "instruktorer_admin_all"   on instruktorer for all    to authenticated using (true) with check (true);

-- ============================================================================
-- 2. Kurs: nye kolonner for richer detaljside
-- ============================================================================

alter table kurs add column if not exists bilde_url   text;
alter table kurs add column if not exists nivaa       text not null default 'alle';   -- 'nybegynner' | 'viderekomne' | 'avansert' | 'alle'
alter table kurs add column if not exists sted        text not null default 'Jossehallen';
alter table kurs add column if not exists tidspunkt   text not null default '';       -- "Mandager 18:00–19:00"
alter table kurs add column if not exists hva_laerer  text not null default '';
alter table kurs add column if not exists ta_med      text not null default '';

-- ============================================================================
-- 3. Kurspåmeldinger: split navn, nye felter, venteliste
-- ============================================================================

-- Splitt navn → fornavn + etternavn
alter table kurspaameldinger add column if not exists fornavn   text;
alter table kurspaameldinger add column if not exists etternavn text;
update kurspaameldinger set fornavn   = coalesce(fornavn, navn)  where fornavn   is null;
update kurspaameldinger set etternavn = coalesce(etternavn, '')  where etternavn is null;
alter table kurspaameldinger alter column fornavn   set not null;
alter table kurspaameldinger alter column etternavn set not null;
-- behold gamle 'navn'-kolonnen midlertidig; dropper i senere migration

alter table kurspaameldinger add column if not exists adresse              text    not null default '';
alter table kurspaameldinger add column if not exists postnummer           text    not null default '';
alter table kurspaameldinger add column if not exists poststed             text    not null default '';
alter table kurspaameldinger add column if not exists hund_alder           integer;
alter table kurspaameldinger add column if not exists kastrert             boolean not null default false;
alter table kurspaameldinger add column if not exists vilkar_godtatt_dato  timestamptz;
alter table kurspaameldinger add column if not exists venteliste_posisjon  integer;

-- Utvid status-enum med 'venteliste'
alter type paamelding_status add value if not exists 'venteliste';
