import Link from "next/link";
import type { GlobalSettings, HomeContent } from "@/types/content";
import type { Locale } from "@/types/common";
import { localizedPath } from "@/lib/i18n";

type MobileStickyCallProps = {
  locale: Locale;
  settings: GlobalSettings;
  nav: HomeContent["nav"];
};

export function MobileStickyCall({ locale, settings, nav }: MobileStickyCallProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/92 p-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
        <Link
          href={localizedPath(locale, "/contact")}
          className="rounded-lg border border-line bg-white/5 px-4 py-3 text-center text-sm font-bold text-text"
        >
          {nav.contact}
        </Link>
        <Link
          href={`tel:${settings.phonePrimary}`}
          className="rounded-lg bg-accent-cyan px-4 py-3 text-center text-sm font-black text-bg"
        >
          {nav.callNow}
        </Link>
      </div>
    </div>
  );
}
