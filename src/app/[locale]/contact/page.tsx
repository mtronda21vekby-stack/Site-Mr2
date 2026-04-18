import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Planetlocksmiths',
  description: 'Get in touch with Planetlocksmiths'
}

type Params = {
  locale: string
}

export default function ContactPage({ params }: { params: Params }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-bg text-white">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-heading mb-4">Contact Us</h1>
        <p className="text-muted">
          For immediate assistance, call us 24/7 at{' '}
          <a href="tel:+12155555555" className="text-accent-blue underline">
            +1 (215) 555‑5555
          </a>
          . We serve the greater Philadelphia area.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            // No real submission in this static demo
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full rounded-md bg-surface text-white placeholder-muted px-4 py-2"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full rounded-md bg-surface text-white placeholder-muted px-4 py-2"
          />
          <textarea
            name="message"
            placeholder="How can we help you?"
            className="w-full rounded-md bg-surface text-white placeholder-muted px-4 py-2 h-32"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-accent-blue text-black py-3 font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  )
}