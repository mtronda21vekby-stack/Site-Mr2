import type { ReactNode } from 'react';

export function Section({ id, eyebrow, title, description, children }: { id?: string; eyebrow?: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 max-w-3xl">
          {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent-cyan">{eyebrow}</p> : null}
          <h2 className="font-sora text-3xl font-extrabold tracking-tight text-text md:text-5xl">{title}</h2>
          {description ? <p className="mt-4 text-base leading-7 text-muted md:text-lg">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
