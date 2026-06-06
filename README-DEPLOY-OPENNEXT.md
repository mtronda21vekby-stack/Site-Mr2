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

The contact form always writes service requests to Supabase `orders`. Email notifications are optional and use Resend through the server route.

Set these Cloudflare Worker environment variables/secrets:

```bash
RESEND_API_KEY=...
CONTACT_TO_EMAIL=planetlocksmits@gmail.com
CONTACT_FROM_EMAIL="Planet Locksmiths <mail@your-verified-domain.com>"
```

`CONTACT_FROM_EMAIL` should use a Resend-verified sender/domain. If `RESEND_API_KEY` is missing, the form still succeeds and the request remains available in the admin orders page.

## Notes

- `NEXTJS_ENV=development` is in `.dev.vars` for local preview.
- If you deploy from Cloudflare dashboard, use a Workers-compatible build/deploy flow rather than Pages output-directory mode.
