import { Button } from "@/components/ui/Button";
import type { GlobalSettings, HomeContent } from "@/types/content";

type EmergencyStripProps = {
  content: HomeContent;
  settings: GlobalSettings;
};

export function EmergencyStrip({ content, settings }: EmergencyStripProps) {
  return (
    <section className="border-y border-line bg-[linear-gradient(90deg,rgba(255,122,122,0.14),rgba(45,226,230,0.1),rgba(214,168,95,0.12))] py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-heading text-2xl font-semibold text-text sm:text-3xl">
            {content.emergencyTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">{content.emergencyText}</p>
        </div>
        <Button href={`tel:${settings.phonePrimary}`} className="shrink-0">
          {settings.phoneDisplay}
        </Button>
      </div>
    </section>
  );
}
