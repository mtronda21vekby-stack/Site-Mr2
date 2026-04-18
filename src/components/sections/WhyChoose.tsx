export default function WhyChoose({ items }: { items: string[] }) {
  return (
    <section id="why" className="bg-surface-2 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="font-sora text-2xl font-bold text-text">Why Choose Us</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          We go beyond basic locksmithing to deliver premium service and peace of
          mind.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start rounded-lg border border-line bg-surface p-5"
            >
              <span className="mr-3 mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full bg-accent-blue"></span>
              <span className="text-sm text-muted">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
