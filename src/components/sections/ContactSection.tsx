"use client";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-surface-2 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="font-sora text-2xl font-bold text-text">Get in Touch</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Ready to request a service or have a question? Fill out the form
          below, and we’ll reach out shortly. For emergencies, please call us.
        </p>
        <form className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-text"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-md border border-line bg-surface p-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-text"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full rounded-md border border-line bg-surface p-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
              placeholder="(123) 456‑7890"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="service"
              className="mb-2 block text-sm font-medium text-text"
            >
              Service Needed
            </label>
            <input
              id="service"
              type="text"
              className="w-full rounded-md border border-line bg-surface p-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
              placeholder="e.g., Car Lockout"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="vehicle"
              className="mb-2 block text-sm font-medium text-text"
            >
              Vehicle Make / Model
            </label>
            <input
              id="vehicle"
              type="text"
              className="w-full rounded-md border border-line bg-surface p-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
              placeholder="Year / Make / Model"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-text"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              className="w-full rounded-md border border-line bg-surface p-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
              placeholder="Philadelphia, PA"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-text"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-md border border-line bg-surface p-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
              placeholder="Tell us how we can help"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-blue/80"
            >
              Request Service
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
