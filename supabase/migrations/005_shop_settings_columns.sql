-- 005_shop_settings_columns.sql
-- Ajout des colonnes de localisation, téléphone et notifications dans la table public.shops

alter table public.shops
  add column if not exists phone text,
  add column if not exists location text,
  add column if not exists email text,
  add column if not exists email_notifications boolean default true;
