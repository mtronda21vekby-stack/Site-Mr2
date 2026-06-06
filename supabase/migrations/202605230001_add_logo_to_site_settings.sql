alter table public.site_settings
  add column if not exists logo_url text,
  add column if not exists logo_alt text;

update public.site_settings
set logo_alt = coalesce(nullif(logo_alt, ''), brand_name, 'Planet Locksmiths logo')
where logo_alt is null or logo_alt = '';