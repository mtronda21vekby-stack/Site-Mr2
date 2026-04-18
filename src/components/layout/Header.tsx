import Link from 'next/link';
import { callHref } from '@/lib/site-data';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-surface/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link
          href="/"
          className="font-sora text-lg font-semibold tracking-wide text-accent-blue"
        >
          Planetlocksmiths
        </Link>
        <nav className="hidden space-x-6 md:flex">
          <a
            href="#services"
            className="text-sm font-medium text-muted transition-colors hover:text-text"
          >
            Services
          </a>
          <a
            href="#why"
            className="text-sm font-medium text-muted transition-colors hover:text-text"
          >
            Why Us
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted transition-colors hover:text-text"
          >
            FAQ
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-muted transition-colors hover:text-text"
          >
            Contact
          </a>
        </nav>
        <div className="hidden space-x-3 md:flex">
          <a
            href={callHref}
            className="rounded-full bg-accent-blue px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-blue/80"
          >
            Call Now
          </a>
          <a
            href="#contact"
            className="rounded-full border border-accent-blue px-4 py-2 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue hover:text-bg"
          >
            Request Service
          </a>
        </div>
      </div>
    </header>
  );
}
