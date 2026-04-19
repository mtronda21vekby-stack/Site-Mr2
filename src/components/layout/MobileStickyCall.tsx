import { getGlobalSettings } from '@/lib/content';

export default function MobileStickyCall() {
  const settings = getGlobalSettings();
  return (
    <a href={`tel:${settings.phonePrimary}`} className="fixed bottom-4 left-4 right-4 z-50 rounded-full bg-accent-blue px-5 py-4 text-center text-sm font-semibold text-bg shadow-glow md:hidden">
      Call Now — {settings.phoneDisplay}
    </a>
  );
}
