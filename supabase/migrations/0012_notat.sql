-- Interne admin-notater på påmeldinger og bookinger.
-- Kjør i Supabase SQL Editor.

alter table kurspaameldinger add column if not exists notat text not null default '';
alter table bookinger        add column if not exists notat text not null default '';
