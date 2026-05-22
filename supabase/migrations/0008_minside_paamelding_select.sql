-- La innloggede brukere se sine egne kurspåmeldinger (matchet på e-post),
-- så de kan vises på Min side. Anon kan fortsatt kun inserte.
-- Kjør i Supabase SQL Editor.

drop policy if exists "paameldinger_select_egen" on kurspaameldinger;
create policy "paameldinger_select_egen" on kurspaameldinger
  for select to authenticated
  using (
    lower(epost) = lower(auth.jwt() ->> 'email')
    or is_admin_or_instruktor()
  );
