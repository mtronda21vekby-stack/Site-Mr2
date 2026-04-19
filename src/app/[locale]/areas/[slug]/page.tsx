import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings } from '@/lib/content';

export default function AreaDetailPage({
  params,
}: {
  params: { locale: 'en' | 'es' | 'ru'; slug: string };
}) {
  const global = getGlobalSettings();
  return (
    <>
      <Header
        locale={params.locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        <h1 className="text-3xl font-heading font-semibold mb-6">Service Area</h1>
        <p>This area page is a placeholder for {params.slug}. Add details about service coverage, highlights and supported services here.</p>
      </main>
      <Footer locale={params.locale} />
    </>
  );
}

// Pre-generate static paths for area pages at build time. Without this
// function Next.js would treat `[slug]` as dynamic and try to render
// unknown slugs on demand. Static sites like Cloudflare Pages cannot
// execute server-side code, so we enumerate the valid slugs and locales
// here. Currently only `philadelphia` is supported.
export async function generateStaticParams() {
  const locales: ('en' | 'es' | 'ru')[] = ['en', 'es', 'ru'];
  const areaSlugs = ['philadelphia'];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of areaSlugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

// Disallow fallback on unknown slugs so that only the paths returned
// from `generateStaticParams` are built. This is required for static
// hosting environments【177755936908939†L246-L323】.
export const dynamicParams = false;

// Make this route statically rendered. Combined with
// `generateStaticParams` and `dynamicParams = false` this ensures
// full SSG behavior.
export const dynamic = 'force-static';