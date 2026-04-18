import Link from "next/link";
import type { GlobalSettings, HomeContent } from "@/types/content";
import type { Locale } from "@/types/common";
import { localizedPath } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
  settings: GlobalSettings;
  nav: HomeContent["nav"];
};

export function Footer({ locale, settings, nav }: FooterProps) {
  const links = [
    { label: nav.services, href: localizedPath(locale, "/services") },
    { label: nav.areas, href: localizedPath(locale, "/areas") },
    { label: nav.reviews, href: localizedPath(locale, "/reviews") },
    { label: nav.faq, href: localizedPath(locale, "/faq") },
    { label: nav.contact, href: localizedPath(locale, "/contact") }
  ];

  return (
    <footer className="border-t border-line bg-bg pb-24 pt-12 lg:pb-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <Link href={localizedPath(locale)} className="font-heading text-xl font-semibold text-text">
            {settings.brandName}
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            Mobile automotive locksmith service in {settings.primaryCity}, {settings.primaryState}. {settings.serviceHours}.
          </p>
          <p className="mt-4 text-sm font-semibold text-text">{settings.phoneDisplay}</p>
        </div>
        <nav className="grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-text">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
