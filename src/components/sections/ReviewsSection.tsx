interface ReviewItem {
  name: string;
  rating: number;
  quote: string;
  date?: string;
  city?: string;
}

interface ReviewsSectionProps {
  title: string;
  items: ReviewItem[];
}

/**
 * Displays a collection of customer reviews. Each review card shows the
 * reviewer's name, their star rating and the quote. The star rating is
 * rendered with inline SVG icons. Additional metadata like date or city
 * could be shown if provided.
 */
export default function ReviewsSection({ title, items }: ReviewsSectionProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-heading font-semibold text-text">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((review, idx) => (
            <div
              key={idx}
              className="flex h-full flex-col rounded-lg bg-surface-2 p-6 shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-text">{review.name}</span>
                <span className="flex space-x-0.5">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <svg
                      key={starIdx}
                      className={`h-4 w-4 ${
                        starIdx < review.rating ? 'text-accent-gold' : 'text-line'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.373 2.451a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.373-2.451a1 1 0 00-1.176 0l-3.373 2.451c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.98 9.382c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.949-.69l1.286-3.955z" />
                    </svg>
                  ))}
                </span>
              </div>
              <p className="flex-1 text-sm text-muted">“{review.quote}”</p>
              {review.date && (
                <p className="mt-4 text-xs text-line">{review.date}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}