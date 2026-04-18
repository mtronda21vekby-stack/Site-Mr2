export default function ReviewsSection() {
  const reviews = [
    {
      name: 'Alex P.',
      content:
        'I locked my keys in the car at midnight and Planetlocksmiths arrived in under 20 minutes. Professional and fast!',
    },
    {
      name: 'Maria G.',
      content:
        'Great service! They cut and programmed a new fob for my SUV on the spot. Highly recommend.',
    },
    {
      name: 'Jamal R.',
      content:
        'Honest pricing and outstanding communication. I hope I never need a locksmith again but if I do, I’ll call them.',
    },
  ];
  return (
    <section className="bg-surface-2 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="font-sora text-2xl font-bold text-text">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-sm text-muted">
          We’re proud of the trust we’ve earned from drivers across
          Philadelphia.
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-lg border border-line bg-surface p-6"
            >
              <div className="mb-3 text-accent-gold">{'★★★★★'}</div>
              <p className="text-sm text-muted">{review.content}</p>
              <span className="mt-4 text-xs font-medium text-text">
                — {review.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
