import Link from 'next/link';
import { getGlobalSettings } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function Footer({ locale }: { locale: Locale }) {
  const settings = getGlobalSettings();
  return (
    <footer className="border-t border-line bg-surface/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-sora text-lg font-bold text-text">{settings.brandName}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">Premium mobile automotive locksmith service across Philadelphia with a controlled, professional customer experience.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-cyan">Navigation</p>
          <div className="mt-4 grid gap-2 text-sm text-muted">
            <Link href={`/${locale}/services`}>Services</Link>
            <Link href={`/${locale}/areas`}>Service Areas</Link>
            <Link href={`/${locale}/reviews`}>Reviews</Link>
            <Link href={`/${locale}/contact`}>Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-cyan">Contact</p>
          <div className="mt-4 grid gap-2 text-sm text-muted">
            <a href={`tel:${settings.phonePrimary}`}>{settings.phoneDisplay}</a>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <p>{settings.serviceHours}</p>
            <p>{settings.primaryCity}, {settings.primaryState}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
