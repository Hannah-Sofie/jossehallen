-- Kursøkter: ett møte per rad. Et kurs kan ha mange økter (f.eks. 8 ukentlige).
-- Øktene vises som opptatt i utleie-kalenderen.
-- Kjør i Supabase SQL Editor.

do $$ begin
  create type oekt_status as enum ('planlagt', 'avlyst', 'gjennomfort');
exception when duplicate_object then null; end $$;

create table if not exists kurs_oekter (
  id        uuid        primary key default gen_random_uuid(),
  kurs_id   uuid        not null references kurs(id) on delete cascade,
  dato      date        not null,
  start_tid time        not null,
  slutt_tid time        not null,
  status    oekt_status not null default 'planlagt',
  opprettet timestamptz not null default now(),
  constraint oekt_start_for_slutt check (start_tid < slutt_tid)
);

create index if not exists kurs_oekter_kurs_idx on kurs_oekter (kurs_id);
create index if not exists kurs_oekter_dato_idx on kurs_oekter (dato, start_tid);

alter table kurs_oekter enable row level security;

drop policy if exists "oekter_select_alle" on kurs_oekter;
drop policy if exists "oekter_admin_all"   on kurs_oekter;
-- Alle kan se øktene (for å vise opptatt-tider i kalenderen)
create policy "oekter_select_alle" on kurs_oekter
  for select to anon, authenticated using (true);
-- Admin/instruktør kan opprette/endre/slette
create policy "oekter_admin_all" on kurs_oekter
  for all to authenticated
  using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());
