-- View som eksponerer kurs + antall ledige plasser til anon,
-- UTEN å lekke persondata fra kurspaameldinger.
-- Kjøres med view-eierens rettigheter (security_invoker=false er default),
-- så den kan telle påmeldinger selv om anon ikke har select på tabellen.
-- Eksponerer kun aggregerte tall.

create or replace view kurs_offentlig as
select
  k.id,
  k.navn,
  k.beskrivelse,
  k.instruktor_id,
  k.bilde_url,
  k.nivaa,
  k.sted,
  k.tidspunkt,
  k.hva_laerer,
  k.ta_med,
  k.start_dato,
  k.slutt_dato,
  k.pris,
  k.maks_deltakere,
  k.aktiv,
  k.opprettet,
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
