import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#123A73]">404</p>
        <h1 className="mb-4 text-4xl font-black tracking-[-0.045em] text-[#0B1F4D] md:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-[#42526E]">
          The page you opened does not exist or the route has changed. Go back to the main service entry point and continue from there.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/en"
            className="rounded-full bg-[#0B1F4D] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#123A73]"
          >
            Go to English home
          </Link>
          <Link
            href="/es"
            className="rounded-full border border-[#0B1F4D]/16 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0B1F4D] transition hover:bg-[#F3F7FF]"
          >
            Español
          </Link>
        </div>
      </div>
    </main>
  )
}