import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-accent-cyan">
          404
        </p>
        <h1 className="mb-4 text-4xl font-heading font-semibold text-text md:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-muted">
          The page you opened does not exist or the route has changed. Go back to the
          main service entry point and continue from there.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/en"
            className="rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Go to English home
          </Link>
          <Link
            href="/es"
            className="rounded-full border border-line px-6 py-3 text-sm text-text transition hover:bg-white/5"
          >
            Ir al inicio en español
          </Link>
          <Link
            href="/ru"
            className="rounded-full border border-line px-6 py-3 text-sm text-text transition hover:bg-white/5"
          >
            Перейти на русский
          </Link>
        </div>
      </div>
    </main>
  )
}
