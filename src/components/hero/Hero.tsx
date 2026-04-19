import HeroActions from './HeroActions';
import PlanetScene from './PlanetScene';
import { Badge } from '@/components/ui/Badge';
import { getGlobalSettings, getHomeContent } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function Hero({ locale }: { locale: Locale }) {
  const content = getHomeContent(locale);
  const settings = getGlobalSettings();

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(77,162,255,0.12),transparent_28%),linear-gradient(180deg,#05070B_0%,#070B13_100%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan">{settings.primaryCity} • {settings.serviceHours}</p>
          <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight text-text md:text-6xl">{content.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">{content.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {content.heroBadges.map((badge) => <Badge key={badge}>{badge}</Badge>)}
          </div>
          <div className="mt-8">
            <HeroActions locale={locale} callHref={`tel:${settings.phonePrimary}`} primaryLabel={content.heroPrimaryCta} secondaryLabel={content.heroSecondaryCta} />
          </div>
        </div>
        <PlanetScene words={content.heroOrbitWords} />
      </div>
    </section>
  );
}
