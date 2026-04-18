import type { Service } from '@/lib/site-data';

export default function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section id="services" className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="font-sora text-2xl font-bold text-text">Our Services</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          We specialise exclusively in automotive locksmith work. Explore how we
          can help.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col rounded-lg border border-line bg-surface-2 p-6 shadow-lg shadow-black/20 transition-transform hover:-translate-y-1"
            >
              <h3 className="font-sora text-lg font-semibold text-text">
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-muted">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
