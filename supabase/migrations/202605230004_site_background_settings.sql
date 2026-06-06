-- CMS-managed site background images.

alter table public.site_settings
  add column if not exists background_image_url text,
  add column if not exists background_mobile_image_url text,
  add column if not exists background_alt text,
  add column if not exists background_opacity numeric not null default 0.16,
  add column if not exists background_position text not null default 'center center',
  add column if not exists background_mobile_position text not null default 'center center';

update public.site_settings
set
  background_alt = coalesce(nullif(background_alt, ''), brand_name, 'Planet Locksmiths background'),
  background_opacity = coalesce(background_opacity, 0.16),
  background_position = coalesce(nullif(background_position, ''), 'center center'),
  background_mobile_position = coalesce(nullif(background_mobile_position, ''), 'center center')
where true;
