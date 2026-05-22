-- Koble instruktorer til en auth-bruker, og la instruktør kun styre egne kurs.
-- Kjør i Supabase SQL Editor.

alter table instruktorer
  add column if not exists bruker_id uuid references auth.users(id) on delete set null;

create index if not exists instruktorer_bruker_idx on instruktorer (bruker_id);

-- Hjelper: instruktorer-id-ene som tilhører innlogget bruker
create or replace function mine_instruktor_ider()
returns setof uuid language sql security definer set search_path = public stable as $$
  select id from instruktorer where bruker_id = auth.uid();
$$;

-- ============================================================================
-- Kurs: admin styrer alt; instruktør styrer kurs der instruktor_id er deres egen
-- ============================================================================

drop policy if exists "kurs_admin_all" on kurs;
create policy "kurs_admin_all" on kurs
  for all to authenticated
  using (is_admin() or instruktor_id in (select mine_instruktor_ider()))
  with check (is_admin() or instruktor_id in (select mine_instruktor_ider()));

-- ============================================================================
-- Påmeldinger: admin alt; instruktør ser/endrer kun for sine egne kurs
-- ============================================================================

drop policy if exists "paameldinger_admin_all" on kurspaameldinger;
create policy "paameldinger_admin_all" on kurspaameldinger
  for all to authenticated
  using (
    is_admin()
    or kurs_id in (
      select k.id from kurs k where k.instruktor_id in (select mine_instruktor_ider())
    )
  )
  with check (
    is_admin()
    or kurs_id in (
      select k.id from kurs k where k.instruktor_id in (select mine_instruktor_ider())
    )
  );

-- ============================================================================
-- Instruktorer: admin alt; instruktør kan redigere sin egen profil
-- ============================================================================

drop policy if exists "instruktorer_egen_update" on instruktorer;
create policy "instruktorer_egen_update" on instruktorer
  for update to authenticated
  using (bruker_id = auth.uid()) with check (bruker_id = auth.uid());
