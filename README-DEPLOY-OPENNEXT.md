# Planet Locksmiths — OpenNext / Cloudflare Workers build

This package is migrated away from `@cloudflare/next-on-pages` and prepared for `@opennextjs/cloudflare`.

## Recommended deploy path

Use **Cloudflare Workers**, not Cloudflare Pages.

## Local commands

```bash
npm install
npm run preview
npm run deploy
```

## Important

- `next-on-pages` is removed from the deploy flow.
- `wrangler.jsonc` points to `.open-next/worker.js`.
- `open-next.config.ts` is included.
- `.open-next` is ignored in `.gitignore`.
- `runtime = 'edge'` should not be used in route/page files with OpenNext.

## Contact form email notifications

The contact form writes service requests to Supabase `orders`. On the server route, `SUPABASE_SERVICE_ROLE_KEY` is preferred for reliable inserts; if it is missing, the route falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY` and depends on the table RLS policy.

Set these Cloudflare Worker environment variables/secrets:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
CONTACT_TO_EMAIL=planetlocksmits@gmail.com
CONTACT_FROM_EMAIL="Planet Locksmiths <mail@your-verified-domain.com>"
```

Email notifications are optional and use Resend through the server route. `CONTACT_FROM_EMAIL` should use a Resend-verified sender/domain. If `RESEND_API_KEY` is missing, the form still succeeds and the request remains available in the admin orders page.

Recipient fallback order is `CONTACT_TO_EMAIL`, then `ADMIN_EMAIL`, then `site_settings.email`, then `planetlocksmits@gmail.com`.

## Notes

- `NEXTJS_ENV=development` is in `.dev.vars` for local preview.
- If you deploy from Cloudflare dashboard, use a Workers-compatible build/deploy flow rather than Pages output-directory mode.
