-- Keep the city name as Philadelphia in Spanish CMS content.
-- Run after 202605230005_seed_locksmith_site_content.sql if that seed was already applied.

update public.home_pages
set
  hero_title = replace(hero_title, 'Filadelfia', 'Philadelphia'),
  hero_subtitle = replace(hero_subtitle, 'Filadelfia', 'Philadelphia'),
  emergency_text = replace(emergency_text, 'Filadelfia', 'Philadelphia')
where locale = 'es';

update public.services
set
  intro = replace(intro, 'Filadelfia', 'Philadelphia'),
  seo_title = replace(seo_title, 'Filadelfia', 'Philadelphia'),
  seo_description = replace(seo_description, 'Filadelfia', 'Philadelphia')
where locale = 'es';

update public.areas
set
  city = case when city = 'Filadelfia' then 'Philadelphia' else city end,
  title = replace(title, 'Filadelfia', 'Philadelphia'),
  intro = replace(intro, 'Filadelfia', 'Philadelphia'),
  seo_title = replace(seo_title, 'Filadelfia', 'Philadelphia'),
  seo_description = replace(seo_description, 'Filadelfia', 'Philadelphia')
where locale = 'es';

update public.faq_items
set answer = replace(answer, 'Filadelfia', 'Philadelphia')
where locale = 'es';

update public.reviews
set city = replace(city, 'Filadelfia', 'Philadelphia')
where locale = 'es';

update public.site_content_blocks
set
  body = replace(body, 'Filadelfia', 'Philadelphia'),
  items = replace(items::text, 'Filadelfia', 'Philadelphia')::jsonb
where locale = 'es';
