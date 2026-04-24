# Production Checklist

Use this checklist after every successful Cloudflare/OpenNext deployment.

## Build

Run or verify Cloudflare ran:

```bash
npm run deploy
```

The script executes:

```bash
opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

## Supabase migrations

Apply these migrations before testing admin-managed content blocks:

- `202604240002_site_content_blocks.sql`
- `202604240003_seed_site_content_blocks.sql`
- `202604240004_seed_footer_content_blocks.sql`
- `202604240005_seed_legal_content_blocks.sql`

## Admin smoke test

Open these routes after deploy:

- `/admin/direct`
- `/admin/audit`
- `/admin/content-blocks`
- `/admin/home`
- `/admin/services`
- `/admin/areas`
- `/admin/faq`
- `/admin/reviews`
- `/admin/orders`
- `/admin/settings`

Expected behavior:

- Admin loads without runtime errors.
- Sidebar includes Dashboard, Orders, Settings, Audit, Home, Content Blocks, Services, Areas, Reviews, FAQ.
- Audit loads even if some tables are empty.
- Audit shows clear warnings instead of crashing.
- Content Blocks can add, edit, publish, draft, and delete blocks.
- Home can save EN, ES, RU content.
- Services can add, save, delete, and preview service pages.
- Areas can add, save, delete, and preview area pages.
- FAQ validates published question and answer.
- Reviews validates published name and quote.
- Settings validates brand, phone, display phone, and service hours.
- Orders show submitted requests and allow status workflow if already implemented.

## Public route smoke test

Open these routes:

- `/en`
- `/en/services`
- `/en/areas`
- `/en/contact`
- `/en/privacy`
- `/en/terms`
- `/es`
- `/ru`

Expected behavior:

- Header links use real routes only.
- Phone CTAs use Settings phone values.
- Contact/request CTAs route to contact form or phone.
- Footer displays content block data or safe fallback.
- Privacy and Terms display content block data or safe fallback.
- No `undefined`, `null`, or empty visible section headings.

## Content blocks required by audit

Home:

- `home / service-depth`
- `home / customer-info`
- `home / area-section`

Service detail:

- `service-detail / hero`
- `service-detail / overview`
- `service-detail / readiness`
- `service-detail / pricing`
- `service-detail / authorization`
- `service-detail / process`

Area detail:

- `area-detail / hero`
- `area-detail / overview`
- `area-detail / prep`
- `area-detail / supported-services`
- `area-detail / local-info`
- `area-detail / coverage-notes`

Footer:

- `footer / brand`
- `footer / services`
- `footer / navigation`
- `footer / legal`

Legal:

- `legal-privacy / hero`
- `legal-privacy / section-1` through `section-5`
- `legal-terms / hero`
- `legal-terms / section-1` through `section-5`

## SEO smoke test

Open:

- `/sitemap.xml`
- `/robots.txt`

Expected behavior:

- Sitemap loads even if Supabase dynamic routes are unavailable.
- Sitemap includes static localized routes.
- Published services and areas appear when Supabase is available.
- Robots file loads.

## Visual redesign rule

Before starting visual redesign, keep these constraints:

- Do not break routes.
- Do not break Supabase content flow.
- Do not hardcode text that belongs in admin/content blocks.
- Do not remove SEO structure.
- Keep mobile layout usable.
- Respect reduced motion.
