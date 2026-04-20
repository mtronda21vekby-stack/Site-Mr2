# Planetlocksmiths — OpenNext / Cloudflare Workers build

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

## Notes

- `NEXTJS_ENV=development` is in `.dev.vars` for local preview.
- If you deploy from Cloudflare dashboard, use a Workers-compatible build/deploy flow rather than Pages output-directory mode.
