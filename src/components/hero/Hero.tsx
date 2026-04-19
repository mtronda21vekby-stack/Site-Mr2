import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle: string;
  badges: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

/**
 * Hero component displaying a headline, supporting text, a list of badges and two
 * call‑to‑action buttons. The right side of the hero shows a decorative
 * pseudo‑3D planet composed of gradient layers and subtle spinning rings.
 */
export default function Hero({
  title,
  subtitle,
  badges,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-bg">
      <div className="mx-auto max-w-7xl flex flex-col-reverse items-center gap-16 px-4 sm:px-6 md:flex-row lg:px-8">
        {/* Left column: content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-text">
            {title}
          </h1>
          <p className="mt-4 max-w-prose text-base sm:text-lg text-muted">
            {subtitle}
          </p>
          {/* Badges */}
          {badges.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-block rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted border border-line"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <a
              href={primaryCtaHref}
              className="inline-block rounded-full bg-accent-blue px-6 py-3 text-sm font-medium text-black shadow transition-colors hover:brightness-110"
            >
              {primaryCtaLabel}
            </a>
            <Link
              href={secondaryCtaHref}
              className="inline-block rounded-full border border-line px-6 py-3 text-sm font-medium text-text transition-colors hover:border-line/70 hover:bg-white/5"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        {/* Right column: pseudo‑3D planet */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96">
            {/* Background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-gold opacity-20 blur-2xl" />
            {/* Front ring */}
            <div className="absolute inset-4 rounded-full border-2 border-accent-blue/40 opacity-60 animate-spin [animation-duration:20s]" />
            {/* Back ring */}
            <div className="absolute inset-10 rounded-full border-2 border-accent-cyan/30 opacity-40 animate-spin [animation-direction:reverse] [animation-duration:30s]" />
            {/* Planet body */}
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-surface-2 via-surface to-bg shadow-inner" />
          </div>
        </div>
      </div>
    </section>
  );
}