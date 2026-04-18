import { Button } from "@/components/ui/Button";
import type { GlobalSettings, HomeContent } from "@/types/content";

type HeroActionsProps = {
  settings: GlobalSettings;
  content: HomeContent;
};

export function HeroActions({ settings, content }: HeroActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button href={`tel:${settings.phonePrimary}`}>{content.heroPrimaryCta}</Button>
      <Button href="#contact" variant="secondary">
        {content.heroSecondaryCta}
      </Button>
    </div>
  );
}
