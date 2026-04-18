import { callHref } from '@/lib/site-data';

export default function MobileStickyCall() {
  return (
    <a
      href={callHref}
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-bg shadow-lg shadow-black/30 transition-colors hover:bg-accent-blue/80 md:hidden"
    >
      Call Now
    </a>
  );
}
