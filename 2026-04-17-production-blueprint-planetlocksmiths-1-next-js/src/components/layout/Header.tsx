"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { GlobalSettings, HomeContent } from "@/types/content";
import type { Locale } from "@/types/common";
import { localizedPath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeaderProps = {
  locale: Locale;
  settings: GlobalSettings;
  nav: HomeContent["nav"];
};

export function Header({ locale, settings, nav }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: nav.home, href: localizedPath(locale) },
    { label: nav.services, href: localizedPath(locale, "/services") },
    { label: nav.areas, href: localizedPath(locale, "/areas") },
    { label: nav.reviews, href: localizedPath(locale, "/reviews") },
    { label: nav.faq, href: localizedPath(locale, "/faq") },
    { label: nav.contact, href: localizedPath(locale, "/contact") }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/82 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href={localizedPath(locale)} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 text-lg font-black text-accent-cyan">
            P
          </span>
          <span className="font-heading text-base font-semibold text-text">
            {settings.brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted transition hover:text-text">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`tel:${settings.phonePrimary}`}
            className="rounded-lg bg-accent-cyan px-4 py-2.5 text-sm font-bold text-bg transition hover:bg-accent-blue"
          >
            {nav.callNow}
          </Link>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg border border-line text-text lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="flex flex-col gap-1.5">
            <span className={cn("h-0.5 w-5 bg-current transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 w-5 bg-current transition", open && "opacity-0")} />
            <span className={cn("h-0.5 w-5 bg-current transition", open && "-translate-y-2 -rotate-45")} />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-5 py-5 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-text hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <LanguageSwitcher locale={locale} />
              <Link
                href={`tel:${settings.phonePrimary}`}
                className="rounded-lg bg-accent-cyan px-4 py-2.5 text-sm font-bold text-bg"
              >
                {settings.phoneDisplay}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
