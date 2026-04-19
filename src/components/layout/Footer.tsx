import Link from 'next/link';
import type { Locale } from './Header';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface-2 py-8 text-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm">© {year} Planetlocksmiths. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href={`/${locale}/privacy`} className="text-sm hover:text-text">
              Privacy Policy
            </Link>
            <Link href={`/${locale}/terms`} className="text-sm hover:text-text">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}