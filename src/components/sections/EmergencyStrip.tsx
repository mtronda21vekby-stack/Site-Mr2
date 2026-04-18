import { callHref, callNumber } from '@/lib/site-data';

export default function EmergencyStrip() {
  return (
    <section className="bg-accent-blue py-8 text-center">
      <p className="text-lg font-semibold text-bg">
        Locked out or dealing with an urgent key issue?
      </p>
      <a
        href={callHref}
        className="mt-3 inline-block rounded-full bg-bg px-6 py-3 text-sm font-bold text-accent-blue transition-colors hover:bg-surface"
      >
        Call {callNumber} now
      </a>
    </section>
  );
}
