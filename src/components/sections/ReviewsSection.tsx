import { Section } from "@/components/ui/Section";
import type { ReviewItem } from "@/types/content";

type ReviewsSectionProps = {
  title: string;
  items: ReviewItem[];
};

export function ReviewsSection({ title, items }: ReviewsSectionProps) {
  return (
    <Section title={title} id="reviews" className="bg-surface/35">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((review) => (
          <article key={`${review.name}-${review.city}`} className="rounded-lg border border-line bg-bg/70 p-5">
            <div className="flex gap-1 text-accent-gold" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: review.rating }).map((_, index) => (
                <span key={index}>*</span>
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-7 text-text">"{review.quote}"</blockquote>
            <p className="mt-5 text-sm font-bold text-muted">
              {review.name}
              {review.city ? ` · ${review.city}` : ""}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
