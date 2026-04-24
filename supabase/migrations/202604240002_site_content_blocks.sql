create table if not exists public.site_content_blocks (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('en', 'es', 'ru')),
  page_key text not null,
  slot text not null,
  eyebrow text,
  title text,
  body text,
  items jsonb not null default '[]'::jsonb,
  cta_label text,
  cta_href text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_content_blocks_lookup_idx
  on public.site_content_blocks (locale, page_key, slot, sort_order);

alter table public.site_content_blocks enable row level security;

drop policy if exists "Public can read published site content blocks" on public.site_content_blocks;
create policy "Public can read published site content blocks"
  on public.site_content_blocks
  for select
  using (is_published = true);

drop policy if exists "Authenticated users can manage site content blocks" on public.site_content_blocks;
create policy "Authenticated users can manage site content blocks"
  on public.site_content_blocks
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create or replace function public.set_site_content_blocks_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_content_blocks_updated_at on public.site_content_blocks;
create trigger site_content_blocks_updated_at
before update on public.site_content_blocks
for each row
execute function public.set_site_content_blocks_updated_at();
