-- PIN-kode for hall-låsen. Admin setter koden (manuell lås).
-- Bruker ser KUN koden for sin egen booking, og kun ±15 min rundt tiden.
-- Kjør i Supabase SQL Editor.

create table if not exists pinkoder (
  id           uuid        primary key default gen_random_uuid(),
  kode         text        not null,
  gyldig_fra   timestamptz not null default now(),
  gyldig_til   timestamptz,                     -- null = åpen/gjeldende
  notat        text        not null default '',
  opprettet_av uuid        references auth.users(id),
  opprettet    timestamptz not null default now()
);

create index if not exists pinkoder_gyldig_idx on pinkoder (gyldig_fra desc);

alter table pinkoder enable row level security;
drop policy if exists "pinkoder_admin_all" on pinkoder;
-- Kun admin kan lese/skrive pinkoder direkte. Vanlige brukere får koden via min_pinkode().
create policy "pinkoder_admin_all" on pinkoder
  for all to authenticated using (is_admin()) with check (is_admin());

-- Koden som gjelder på et gitt tidspunkt
create or replace function pinkode_for(p_tid timestamptz)
returns text language sql security definer set search_path = public stable as $$
  select kode from pinkoder
  where gyldig_fra <= p_tid and (gyldig_til is null or gyldig_til > p_tid)
  order by gyldig_fra desc
  limit 1;
$$;

-- Koden for brukerens egen booking — kun ±15 min rundt booking-tiden
create or replace function min_pinkode(p_booking_id uuid)
returns text language plpgsql security definer set search_path = public stable as $$
declare
  v_uid   uuid := auth.uid();
  v_start timestamptz;
  v_end   timestamptz;
begin
  if v_uid is null then return null; end if;

  select (t.dato + t.start_tid) at time zone 'Europe/Oslo',
         (t.dato + t.slutt_tid) at time zone 'Europe/Oslo'
  into v_start, v_end
  from bookinger b
  join tilgjengelige_tider t on t.id = b.tid_id
  where b.id = p_booking_id and b.bruker_id = v_uid and b.status <> 'avbrutt';

  if v_start is null then return null; end if;

  if now() >= v_start - interval '15 minutes'
     and now() <= v_end + interval '15 minutes' then
    return pinkode_for(v_start);
  end if;
  return null;
end;
$$;

grant execute on function min_pinkode(uuid) to authenticated;
