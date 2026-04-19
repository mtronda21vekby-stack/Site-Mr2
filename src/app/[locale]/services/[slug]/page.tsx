import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings, getHomeContent } from '@/lib/content';

export async function generateStaticParams() {
  // Generate static params for all services defined in the home content for each locale.
  const locales: ('en' | 'es' | 'ru')[] = ['en', 'es', 'ru'];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const home = getHomeContent(locale);
    home.featuredServices.forEach((service) => {
      params.push({ locale, slug: service.slug });
    });
  }
  return params;
}

// When deploying to static hosts like Cloudflare Pages, we must
// explicitly disable on-demand dynamic segments. By setting
// `dynamicParams = false`, Next.js will 404 on unrecognised slugs
// instead of attempting to render them at runtime. Together with
// `dynamic = 'force-static'`, this ensures that only pages listed in
// `generateStaticParams` are generated and served statically【177755936908939†L246-L323】.
export const dynamicParams = false;

// Tell Next.js to statically render this page. This mirrors the
// top‑level `dynamic = 'force-static'` directive but is included
// here for clarity and explicitness on dynamic routes.
export const dynamic = 'force-static';

export default function ServiceDetailPage({
  params,
}: {
  params: { locale: 'en' | 'es' | 'ru'; slug: string };
}) {
  const global = getGlobalSettings();
  const home = getHomeContent(params.locale);
  const service = home.featuredServices.find((s) => s.slug === params.slug);
  return (
    <>
      <Header
        locale={params.locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        {service ? (
          <>
            <h1 className="text-3xl font-heading font-semibold mb-6">{service.title}</h1>
            <p className="mb-4">{service.excerpt}</p>
            <p>This is a placeholder page for the {service.title} service. In the future you can add more details and images here.</p>
          </>
        ) : (
          <p>Service not found.</p>
        )}
      </main>
      <Footer locale={params.locale} />
    </>
  );
}