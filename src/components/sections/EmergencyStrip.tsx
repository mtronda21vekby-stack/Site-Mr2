import type { Locale } from '@/components/layout/Header';

interface EmergencyStripProps {
  title: string;
  text: string;
  phoneNumber: string;
  phoneDisplay: string;
  locale: Locale;
}

/**
 * The emergency strip is a full-width call-to-action banner that encourages
 * customers to call immediately when they need urgent assistance. It uses a
 * contrasting background and simple layout for maximum visibility. The text
 * and button labels can be localised via the home content JSON.
 */
export default function EmergencyStrip({
  title,
  text,
  phoneNumber,
  phoneDisplay,
  locale,
}: EmergencyStripProps) {
  return (
    <section className="bg-accent-blue py-8 text-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:gap-8 sm:px-6 lg:px-8">
        <div className="max-w-lg text-center sm:text-left">
          <h2 className="text-xl font-heading font-semibold mb-2">
            {title}
          </h2>
          <p className="text-sm text-black/80">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={`tel:${phoneNumber}`}
            className="inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-accent-blue transition-colors hover:bg-black/80"
          >
            Call {phoneDisplay}
          </a>
          {/* Also link to the contact page for non-urgent requests */}
          <a
            href={`/${locale}/contact`}
            className="inline-block rounded-full border border-black px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black/10"
          >
            Request service
          </a>
        </div>
      </div>
    </section>
  );
}