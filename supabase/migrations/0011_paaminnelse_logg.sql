-- Logg over sendte påminnelser, for å unngå dobbeltsending.
-- Kun service-role (cron) skriver/leser her. Kjør i Supabase SQL Editor.

create table if not exists paaminnelse_logg (
  id       uuid        primary key default gen_random_uuid(),
  type     text        not null,   -- 'kurs' | 'booking'
  ref_id   uuid        not null,   -- paamelding_id eller booking_id
  for_dato date        not null,   -- dato påminnelsen gjelder
  sendt    timestamptz not null default now(),
  unique (type, ref_id, for_dato)
);

alter table paaminnelse_logg enable row level security;
-- Ingen policies → kun service-role (som omgår RLS) har tilgang.
