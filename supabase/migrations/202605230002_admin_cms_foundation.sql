-- Planetlocksmiths CMS foundation
-- Apply this in Supabase SQL Editor before using the admin panel in production.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text,
  logo_url text,
  logo_alt text,
  phone_primary text,
  phone_display text,
  email text,
  service_hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings
  add column if not exists brand_name text,
  add column if not exists logo_url text,
  add column if not exists logo_alt text,
  add column if not exists phone_primary text,
  add column if not exists phone_display text,
  add column if not exists email text,
  add column if not exists service_hours text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

insert into public.site_settings (brand_name, logo_alt, phone_primary, phone_display, email, service_hours)
select 'Planetlocksmiths', 'Planetlocksmiths', '+12155550100', '+1 (215) 555-0100', 'info@planetlocksmiths.com', '24/7'
where not exists (select 1 from public.site_settings);

create table if not exists public.home_pages (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  hero_title text,
  hero_subtitle text,
  hero_primary_cta text,
  hero_secondary_cta text,
  emergency_title text,
  emergency_text text,
  reviews_title text,
  faq_title text,
  contact_title text,
  contact_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.home_pages
  add column if not exists locale text,
  add column if not exists hero_title text,
  add column if not exists hero_subtitle text,
  add column if not exists hero_primary_cta text,
  add column if not exists hero_secondary_cta text,
  add column if not exists emergency_title text,
  add column if not exists emergency_text text,
  add column if not exists reviews_title text,
  add column if not exists faq_title text,
  add column if not exists contact_title text,
  add column if not exists contact_text text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  slug text not null,
  title text,
  excerpt text,
  intro text,
  seo_title text,
  seo_description text,
  sort_order integer default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services
  add column if not exists locale text,
  add column if not exists slug text,
  add column if not exists title text,
  add column if not exists excerpt text,
  add column if not exists intro text,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists sort_order integer default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  slug text not null,
  city text,
  state text,
  title text,
  intro text,
  highlights text[] default '{}',
  supported_services text[] default '{}',
  seo_title text,
  seo_description text,
  sort_order integer default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.areas
  add column if not exists locale text,
  add column if not exists slug text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists title text,
  add column if not exists intro text,
  add column if not exists highlights text[] default '{}',
  add column if not exists supported_services text[] default '{}',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists sort_order integer default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  name text,
  rating integer default 5,
  quote text,
  date text,
  city text,
  sort_order integer default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reviews
  add column if not exists locale text,
  add column if not exists name text,
  add column if not exists rating integer default 5,
  add column if not exists quote text,
  add column if not exists date text,
  add column if not exists city text,
  add column if not exists sort_order integer default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  question text,
  answer text,
  sort_order integer default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faq_items
  add column if not exists locale text,
  add column if not exists question text,
  add column if not exists answer text,
  add column if not exists sort_order integer default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_content_blocks (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  page_key text not null,
  slot text not null,
  eyebrow text,
  title text,
  body text,
  items jsonb default '[]'::jsonb,
  cta_label text,
  cta_href text,
  sort_order integer default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_content_blocks
  add column if not exists locale text,
  add column if not exists page_key text,
  add column if not exists slot text,
  add column if not exists eyebrow text,
  add column if not exists title text,
  add column if not exists body text,
  add column if not exists items jsonb default '[]'::jsonb,
  add column if not exists cta_label text,
  add column if not exists cta_href text,
  add column if not exists sort_order integer default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text,
  title text,
  alt text,
  category text default 'gallery',
  sort_order integer default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_images
  add column if not exists image_url text,
  add column if not exists storage_path text,
  add column if not exists title text,
  add column if not exists alt text,
  add column if not exists category text default 'gallery',
  add column if not exists sort_order integer default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  service_needed text,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  location text,
  message text,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists service_needed text,
  add column if not exists vehicle_make text,
  add column if not exists vehicle_model text,
  add column if not exists vehicle_year text,
  add column if not exists location text,
  add column if not exists message text,
  add column if not exists status text not null default 'new',
  add column if not exists notes text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['site_settings','home_pages','services','areas','reviews','faq_items','site_content_blocks','site_images','orders'] loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create index if not exists idx_home_pages_locale on public.home_pages(locale);
create index if not exists idx_services_locale_published_sort on public.services(locale, is_published, sort_order);
create index if not exists idx_areas_locale_published_sort on public.areas(locale, is_published, sort_order);
create index if not exists idx_reviews_locale_published_sort on public.reviews(locale, is_published, sort_order);
create index if not exists idx_faq_locale_published_sort on public.faq_items(locale, is_published, sort_order);
create index if not exists idx_content_blocks_lookup on public.site_content_blocks(locale, page_key, slot, is_published, sort_order);
create index if not exists idx_site_images_category_created on public.site_images(category, created_at desc);
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);

alter table public.site_settings enable row level security;
alter table public.home_pages enable row level security;
alter table public.services enable row level security;
alter table public.areas enable row level security;
alter table public.reviews enable row level security;
alter table public.faq_items enable row level security;
alter table public.site_content_blocks enable row level security;
alter table public.site_images enable row level security;
alter table public.orders enable row level security;

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings" on public.site_settings for select using (true);
drop policy if exists "admin manage site settings" on public.site_settings;
create policy "admin manage site settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read home pages" on public.home_pages;
create policy "public read home pages" on public.home_pages for select using (true);
drop policy if exists "admin manage home pages" on public.home_pages;
create policy "admin manage home pages" on public.home_pages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read published services" on public.services;
create policy "public read published services" on public.services for select using (is_published = true);
drop policy if exists "admin manage services" on public.services;
create policy "admin manage services" on public.services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read published areas" on public.areas;
create policy "public read published areas" on public.areas for select using (is_published = true);
drop policy if exists "admin manage areas" on public.areas;
create policy "admin manage areas" on public.areas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read published reviews" on public.reviews;
create policy "public read published reviews" on public.reviews for select using (is_published = true);
drop policy if exists "admin manage reviews" on public.reviews;
create policy "admin manage reviews" on public.reviews for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read published faq" on public.faq_items;
create policy "public read published faq" on public.faq_items for select using (is_published = true);
drop policy if exists "admin manage faq" on public.faq_items;
create policy "admin manage faq" on public.faq_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read published content blocks" on public.site_content_blocks;
create policy "public read published content blocks" on public.site_content_blocks for select using (is_published = true);
drop policy if exists "admin manage content blocks" on public.site_content_blocks;
create policy "admin manage content blocks" on public.site_content_blocks for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read published images" on public.site_images;
create policy "public read published images" on public.site_images for select using (is_published = true);
drop policy if exists "admin manage images" on public.site_images;
create policy "admin manage images" on public.site_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public create orders" on public.orders;
create policy "public create orders" on public.orders for insert with check (true);
drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders for select using (auth.role() = 'authenticated');
drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "admin delete orders" on public.orders;
create policy "admin delete orders" on public.orders for delete using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public read site images bucket" on storage.objects;
create policy "public read site images bucket" on storage.objects for select using (bucket_id = 'site-images');
drop policy if exists "admin insert site images bucket" on storage.objects;
create policy "admin insert site images bucket" on storage.objects for insert with check (bucket_id = 'site-images' and auth.role() = 'authenticated');
drop policy if exists "admin update site images bucket" on storage.objects;
create policy "admin update site images bucket" on storage.objects for update using (bucket_id = 'site-images' and auth.role() = 'authenticated') with check (bucket_id = 'site-images' and auth.role() = 'authenticated');
drop policy if exists "admin delete site images bucket" on storage.objects;
create policy "admin delete site images bucket" on storage.objects for delete using (bucket_id = 'site-images' and auth.role() = 'authenticated');
