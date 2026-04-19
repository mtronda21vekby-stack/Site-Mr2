import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { getGlobalSettings } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function Header({ locale }: { locale: Locale }) {
  const settings = getGlobalSettings();
  const nav = [
    ['Home', ''],
    ['Services', '/services'],
    ['Service Areas', '/areas'],
    ['Reviews', '/reviews'],
    ['FAQ', '/faq'],
    ['Contact', '/contact'],
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href={`/${locale}`} className="font-sora text-xl font-extrabold tracking-tight text-text">
          {settings.brandName}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={`/${locale}${href}`} className="text-sm text-muted transition-colors hover:text-text">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Button href={`tel:${settings.phonePrimary}`} className="hidden md:inline-flex">
            Call Now
          </Button>
        </div>
      </div>
    </header>
  );
}
