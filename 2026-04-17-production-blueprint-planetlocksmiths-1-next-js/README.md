# Planetlocksmiths

Production-oriented Next.js app for a multilingual mobile automotive locksmith website.

## Stack

- Next.js 15 app router
- TypeScript
- Tailwind CSS
- Framer Motion
- Decap CMS
- Cloudflare Pages-ready project config

## Routes

- `/en`, `/es`, `/ru`
- `/{locale}/services`
- `/{locale}/services/{slug}`
- `/{locale}/areas`
- `/{locale}/areas/philadelphia`
- `/{locale}/about`
- `/{locale}/reviews`
- `/{locale}/faq`
- `/{locale}/contact`

## Content

Editable JSON content lives in `src/content`.

Decap CMS files live in `public/admin`.

## Commands

```bash
npm install
npm run dev
npm run build
```

The contact route currently validates and rate-limits requests, then returns success. Connect email, CRM, or dispatch delivery inside `src/app/api/contact/route.ts`.
