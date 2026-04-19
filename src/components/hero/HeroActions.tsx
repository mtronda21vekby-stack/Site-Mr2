import { Button } from '@/components/ui/Button';

export default function HeroActions({ locale, callHref, secondaryLabel, primaryLabel }: { locale: string; callHref: string; secondaryLabel: string; primaryLabel: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button href={callHref}>{primaryLabel}</Button>
      <Button href={`/${locale}/contact`} variant="secondary">{secondaryLabel}</Button>
    </div>
  );
}
