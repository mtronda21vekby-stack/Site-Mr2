"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales } from "@/lib/i18n";
import type { Locale } from "@/types/common";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function switchPath(targetLocale: Locale) {
    const parts = pathname.split("/");

    if (locales.includes(parts[1] as Locale)) {
      parts[1] = targetLocale;
      return parts.join("/") || `/${targetLocale}`;
    }

    return `/${targetLocale}`;
  }

  return (
    <div className="flex items-center rounded-lg border border-line bg-white/5 p-1">
      {locales.map((targetLocale) => (
        <Link
          key={targetLocale}
          href={switchPath(targetLocale)}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-xs font-bold text-muted transition hover:text-text",
            targetLocale === locale && "bg-white/10 text-text"
          )}
        >
          {localeLabels[targetLocale]}
        </Link>
      ))}
    </div>
  );
}
