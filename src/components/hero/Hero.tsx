"use client";
import { callHref } from '@/lib/site-data';
import PlanetScene from './PlanetScene';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg pt-24 pb-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-4 md:flex-row md:px-8">
        <div className="max-w-xl">
          <h1 className="font-sora text-3xl font-extrabold text-text sm:text-4xl md:text-5xl">
            Automotive Locksmith Service Across Philadelphia — 24/7
          </h1>
          <p className="mt-6 text-base text-muted sm:text-lg">
            Locked out, dealing with a lost key, or need a replacement programmed?
            Planetlocksmiths provides mobile automotive locksmith service across
            Philadelphia with urgent and same‑day availability.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row">
            <a
              href={callHref}
              className="rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-blue/80"
            >
              Call Now
            </a>
            <a
              href="#contact"
              className="rounded-full border border-accent-blue px-6 py-3 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue hover:text-bg"
            >
              Request Service
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
              24/7 Mobile Service
            </span>
            <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
              Philadelphia Coverage
            </span>
            <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
              Car Keys & Programming
            </span>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <PlanetScene />
        </div>
      </div>
    </section>
  );
}
