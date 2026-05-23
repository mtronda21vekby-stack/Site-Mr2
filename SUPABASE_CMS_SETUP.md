# Planetlocksmiths Supabase CMS Setup

This project uses Supabase as the CMS/data layer for the public website and admin panel.

## Required environment variables

Set these in Cloudflare/OpenNext deployment and local `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://planetlocksmiths.com
```

`SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser. It is only for server-side routes.

## Apply database migrations

Open Supabase Dashboard → SQL Editor and run these files in order:

```txt
supabase/migrations/202605230001_add_logo_to_site_settings.sql
supabase/migrations/202605230002_admin_cms_foundation.sql
supabase/migrations/202605230003_orders_admin_fields.sql
supabase/migrations/202605230004_site_background_settings.sql
```

The migrations create or update:

- `site_settings`
- `home_pages`
- `services`
- `areas`
- `reviews`
- `faq_items`
- `site_content_blocks`
- `site_images`
- `orders`
- Storage bucket: `site-images`
- RLS policies for public content reads and authenticated admin writes
- Public insert policy for `orders`
- Admin order fields: `vehicle_make_model`, `urgency`, `preferred_time`, `admin_note`, `assigned_to`
- CMS-managed background fields: `background_image_url`, `background_mobile_image_url`, `background_alt`, `background_opacity`, `background_position`, `background_mobile_position`

## Admin authentication

The admin UI logs in with Supabase Auth at:

```txt
/admin/login
```

Create at least one Supabase Auth user in:

```txt
Supabase Dashboard → Authentication → Users
```

Use that email/password to enter the admin panel.

## Logo workflow

Go to:

```txt
/admin/settings
```

Recommended logo file:

- PNG or WebP
- transparent background
- wide planet-lock logo ratio
- avoid JPG if you need transparency

After upload, click:

```txt
Save settings
```

The public header reads `logo_url` and `logo_alt` from `site_settings`. Header UI is marked `notranslate` so browser translation should not rewrite brand text/buttons.

## Background workflow

Go to:

```txt
/admin/backgrounds
```

Recommended background files:

- Desktop: WebP/JPG, 2400×1400 or larger
- Mobile: WebP/JPG, 1200×1800 or larger
- Keep opacity around `0.10`–`0.24` so text and CTA remain readable

Background images upload through Supabase Auth + Supabase Storage into bucket:

```txt
site-images
```

URLs are saved in:

```txt
site_settings.background_image_url
site_settings.background_mobile_image_url
```

The public `CinematicBackground` component reads these CMS fields and applies the background globally across public pages.

## Photo workflow

Go to:

```txt
/admin/photos
```

Photos now upload directly through Supabase Auth + Supabase Storage into bucket:

```txt
site-images
```

Records are saved in:

```txt
site_images
```

The public gallery reads published photos from `site_images` with `is_published = true`.

On mobile, the gallery is intentionally simple: horizontal rotating photos, no marketing copy over the carousel, tap centered photo to open fullscreen.

## Orders workflow

Public users submit requests through:

```txt
/en/contact#request-service
```

Requests are saved into:

```txt
orders
```

Admin can manage them at:

```txt
/admin/orders
```

Admin order actions:

- filter by status
- filter by urgency
- search by name, phone, email, service, location, vehicle
- update status
- assign dispatcher/technician
- save internal admin notes
- delete invalid/test requests

## Core admin pages

- `/admin/settings` — brand, logo, phone, email, hours
- `/admin/backgrounds` — global site background images
- `/admin/home` — home page copy by locale
- `/admin/services` — services CMS
- `/admin/areas` — service areas CMS
- `/admin/reviews` — reviews CMS
- `/admin/faq` — FAQ CMS
- `/admin/photos` — image CMS
- `/admin/orders` — customer requests
- `/admin/audit` — quality checks

## Production smoke test

After deployment:

1. Login at `/admin/login`.
2. Open `/admin/settings`.
3. Upload transparent PNG/WebP logo.
4. Save settings.
5. Open `/en`, `/en/services`, and `/en/contact`; verify header logo appears everywhere.
6. Open `/admin/backgrounds`.
7. Upload desktop and mobile background images.
8. Save backgrounds.
9. Open `/en` on desktop and mobile; verify the background appears subtly behind the UI.
10. Open `/admin/photos`.
11. Upload one gallery image.
12. Open `/en` on mobile; verify the rotating photo carousel appears without overlay text.
13. Submit a request through `/en/contact#request-service`.
14. Open `/admin/orders`; verify the request appears.
15. Change status and save internal note.
16. Edit Home content in `/admin/home`.
17. Verify `/en` updates.
18. Edit one Service in `/admin/services`.
19. Verify `/en/services` updates.
20. Open `/admin/audit` and fix critical warnings.

## Known rule

Do not hardcode business content in React components when it belongs in Supabase CMS. Components should render CMS data with safe fallback only.
