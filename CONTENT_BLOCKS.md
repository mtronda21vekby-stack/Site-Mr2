# Content Blocks Map

`site_content_blocks` is the flexible CMS layer for editable public-site sections that do not belong directly to Home, Services, Areas, Reviews, FAQ, Orders, or Settings.

## Required page keys and slots

### Home

- `home / service-depth`
- `home / customer-info`
- `home / area-section`

### Service detail pages

Global service detail defaults:

- `service-detail / hero`
- `service-detail / overview`
- `service-detail / readiness`
- `service-detail / pricing`
- `service-detail / authorization`
- `service-detail / process`

Per-service overrides use:

- `service:{slug} / hero`
- `service:{slug} / overview`
- `service:{slug} / readiness`
- `service:{slug} / pricing`
- `service:{slug} / authorization`
- `service:{slug} / process`

### Area detail pages

Global area detail defaults:

- `area-detail / hero`
- `area-detail / overview`
- `area-detail / prep`
- `area-detail / supported-services`
- `area-detail / local-info`
- `area-detail / coverage-notes`

Per-area overrides use:

- `area:{slug} / hero`
- `area:{slug} / overview`
- `area:{slug} / prep`
- `area:{slug} / supported-services`
- `area:{slug} / local-info`
- `area:{slug} / coverage-notes`

### Footer

- `footer / brand`
- `footer / services`
- `footer / navigation`
- `footer / legal`

### Legal pages

Privacy:

- `legal-privacy / hero`
- `legal-privacy / section-1`
- `legal-privacy / section-2`
- `legal-privacy / section-3`
- `legal-privacy / section-4`
- `legal-privacy / section-5`

Terms:

- `legal-terms / hero`
- `legal-terms / section-1`
- `legal-terms / section-2`
- `legal-terms / section-3`
- `legal-terms / section-4`
- `legal-terms / section-5`

## Field behavior

- `eyebrow`: small section label.
- `title`: section heading.
- `body`: main paragraph content.
- `items`: one item per line in admin, saved as JSON array.
- `cta_label`: button/link label.
- `cta_href`: internal path, hash link, `tel:`, `mailto:`, or `https://` URL.
- `sort_order`: display order for multi-section pages.
- `is_published`: only published blocks are used on public pages.

## Audit

`/admin/audit` checks required blocks for Home, Service detail, Area detail, Footer, Privacy, and Terms.

## Visual redesign rule

During visual redesign, preserve this content flow. Restyle components and layouts, but do not hardcode text that belongs in `site_content_blocks`.
