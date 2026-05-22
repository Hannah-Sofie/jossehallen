-- Hall-utleie: bookinger-skjema, atomisk booking-funksjon, RLS.
-- Booking krever innlogget bruker. Kjør i Supabase SQL Editor.

-- ============================================================================
-- 1. Bookinger: split navn, bruker_id, vilkår
-- ============================================================================

alter table bookinger add column if not exists fornavn   text;
alter table bookinger add column if not exists etternavn text;
update bookinger set fornavn = coalesce(fornavn, navn), etternavn = coalesce(etternavn, '')
  where fornavn is null;
alter table bookinger drop column if exists navn;

alter table bookinger add column if not exists bruker_id uuid references auth.users(id) on delete set null;
alter table bookinger add column if not exists vilkar_godtatt_dato timestamptz;

create index if not exists bookinger_bruker_idx on bookinger (bruker_id);

-- ============================================================================
-- 2. RLS: innlogget bruker kan booke + se egne; admin/instruktør ser alt
-- ============================================================================

drop policy if exists "bookinger_insert_alle"  on bookinger;
drop policy if exists "bookinger_insert_egen"  on bookinger;
drop policy if exists "bookinger_select_egen"  on bookinger;
drop policy if exists "bookinger_admin_all"    on bookinger;

create policy "bookinger_select_egen" on bookinger
  for select to authenticated
  using (bruker_id = auth.uid() or is_admin_or_instruktor());

create policy "bookinger_admin_all" on bookinger
  for all to authenticated
  using (is_admin_or_instruktor()) with check (is_admin_or_instruktor());

-- (Insert skjer via book_tid() under — ingen direkte insert-policy for vanlig bruker.)

-- ============================================================================
-- 3. Atomisk booking — security definer, hindrer dobbelbooking
-- ============================================================================

create or replace function book_tid(
  p_tid_id    uuid,
  p_fornavn   text,
  p_etternavn text,
  p_epost     text,
  p_telefon   text,
  p_formaal   text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_uid        uuid := auth.uid();
  v_ledig      boolean;
  v_booking_id uuid;
begin
  if v_uid is null then
    raise exception 'Krever innlogging' using errcode = '28000';
  end if;

  -- Lås raden så to samtidige bookinger ikke kan ta samme tid
  select ledig into v_ledig
  from tilgjengelige_tider
  where id = p_tid_id
  for update;

  if v_ledig is null then
    raise exception 'Tiden finnes ikke' using errcode = 'P0002';
  end if;
  if not v_ledig then
    raise exception 'Tiden er allerede booket' using errcode = 'P0001';
  end if;

  update tilgjengelige_tider set ledig = false where id = p_tid_id;

  insert into bookinger (tid_id, bruker_id, fornavn, etternavn, epost, telefon, formaal, status, vilkar_godtatt_dato)
  values (p_tid_id, v_uid, p_fornavn, p_etternavn, p_epost, p_telefon, p_formaal, 'venter_betaling', now())
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

grant execute on function book_tid(uuid, text, text, text, text, text) to authenticated;

-- ============================================================================
-- 4. Frigjør tid igjen når booking avbrytes/slettes (admin)
-- ============================================================================

create or replace function frigjor_tid_ved_avbrutt()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'DELETE') then
    update tilgjengelige_tider set ledig = true where id = old.tid_id;
    return old;
  elsif (tg_op = 'UPDATE' and new.status = 'avbrutt' and old.status <> 'avbrutt') then
    update tilgjengelige_tider set ledig = true where id = new.tid_id;
    return new;
  end if;
  return new;
end;
$$;

drop trigger if exists booking_frigjor_tid on bookinger;
create trigger booking_frigjor_tid
  after update or delete on bookinger
  for each row execute function frigjor_tid_ved_avbrutt();
