import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getReviews } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function ReviewsSection({ locale }: { locale: Locale }) {
  const items = getReviews(locale);
  return (
    <Section id="reviews" eyebrow="reviews" title="Social proof with a clean premium layout" description="Simple review cards keep the page believable and customer-presentable.">
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((review) => (
          <Card key={review.name} className="p-6">
            <p className="text-accent-gold">★★★★★</p>
            <p className="mt-4 text-sm leading-7 text-muted">“{review.quote}”</p>
            <p className="mt-5 font-sora text-base font-bold text-text">{review.name}</p>
            {review.city ? <p className="text-xs uppercase tracking-[0.2em] text-muted">{review.city}</p> : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}
