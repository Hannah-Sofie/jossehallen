-- Legger til instruktør-kolonne på kurs.
-- Kjør i Supabase SQL Editor.

alter table kurs
  add column if not exists instruktor text not null default '';
