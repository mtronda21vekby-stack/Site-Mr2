import { Button } from '@/components/ui/Button';
import { getGlobalSettings, getHomeContent } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function EmergencyStrip({ locale }: { locale: Locale }) {
  const settings = getGlobalSettings();
  const content = getHomeContent(locale);
  return (
    <section className="py-4">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[32px] border border-accent-blue/20 bg-[linear-gradient(135deg,rgba(77,162,255,0.16),rgba(45,226,230,0.08))] px-6 py-8 md:flex md:items-center md:justify-between md:px-10">
          <div>
            <h3 className="font-sora text-2xl font-extrabold text-text">{content.emergencyTitle}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{content.emergencyText}</p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button href={`tel:${settings.phonePrimary}`}>Call Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
