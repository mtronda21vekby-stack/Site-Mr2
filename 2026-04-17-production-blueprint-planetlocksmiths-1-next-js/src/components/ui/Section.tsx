import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
};

export function Section({ eyebrow, title, intro, children, className, ...props }: SectionProps) {
  return (
    <section className={cn("border-t border-line py-20 sm:py-24", className)} {...props}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        {(eyebrow || title || intro) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-bold uppercase text-accent-gold">{eyebrow}</p>
            )}
            {title && (
              <h2 className="font-heading text-3xl font-semibold tracking-normal text-text sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && <p className="mt-4 text-base leading-7 text-muted">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
