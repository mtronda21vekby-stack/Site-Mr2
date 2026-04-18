import { Badge } from "@/components/ui/Badge";
import type { GlobalSettings, HomeContent } from "@/types/content";
import { HeroActions } from "./HeroActions";
import { PlanetScene } from "./PlanetScene";

type HeroProps = {
  content: HomeContent;
  settings: GlobalSettings;
};

export function Hero({ content, settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,#05070B_100%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 flex flex-wrap gap-2">
            {content.heroBadges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-normal text-text sm:text-5xl lg:text-6xl">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {content.heroSubtitle}
          </p>
          <div className="mt-8">
            <HeroActions settings={settings} content={content} />
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm text-muted sm:grid-cols-3">
            {content.heroBadges.slice(0, 3).map((badge) => (
              <span key={badge} className="rounded-lg border border-line bg-white/5 px-4 py-3">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <PlanetScene words={content.heroOrbitWords} badges={content.heroBadges} />
        </div>
      </div>
    </section>
  );
}
