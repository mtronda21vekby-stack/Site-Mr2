import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Planetlocksmiths',
    template: '%s | Planetlocksmiths',
  },
  description:
    'Mobile automotive locksmith service in Philadelphia. Car lockout help, key replacement, and key programming available 24/7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// When deploying to platforms like Cloudflare Pages that only support
// static rendering, tell Next.js to treat all pages in this app as
// statically generated. Without this directive, the app router will
// default to streaming or server rendering for routes that don't
// explicitly opt out, which causes deployment failures on Cloudflare
// because the functions environment is not enabled by default【77012206105408†L58-L66】.
// Setting `dynamic` to `'force-static'` forces Next.js to pre-render
// every page during `next build` and serve it as a static asset.
export const dynamic = 'force-static';