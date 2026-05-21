-- Fjerner den gamle navn-kolonnen på kurspaameldinger.
-- Vi har migrert til fornavn + etternavn (0002). Kolonnen var NOT NULL og
-- blokkerte nye påmeldinger.
-- (bookinger.navn beholdes til #4 splitter den.)

alter table kurspaameldinger drop column if exists navn;
