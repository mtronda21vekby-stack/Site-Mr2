import Link from 'next/link';
import { getLocaleLabel, locales } from '@/lib/i18n';
import type { Locale } from '@/types/common';

export default function LanguageSwitcher({ locale, path = '' }: { locale: Locale; path?: string }) {
  return (
    <div className="flex items-center gap-2">
      {locales.map((item) => (
        <Link
          key={item}
          href={`/${item}${path}`}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item === locale ? 'bg-white text-bg' : 'text-muted hover:text-text'}`}
        >
          {getLocaleLabel(item)}
        </Link>
      ))}
    </div>
  );
}
