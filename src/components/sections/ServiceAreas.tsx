export default function ServiceAreas() {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="font-sora text-2xl font-bold text-text">Service Areas</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Planetlocksmiths proudly serves customers across the Philadelphia
          region and the surrounding areas. We bring our fully equipped mobile
          service directly to you, wherever you are within our service zone.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            'Center City',
            'North Philadelphia',
            'South Philadelphia',
            'West Philadelphia',
            'Northeast Philadelphia',
            'Surrounding suburbs',
          ].map((area) => (
            <div
              key={area}
              className="rounded-lg border border-line bg-surface-2 p-4 text-sm text-muted"
            >
              {area}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
