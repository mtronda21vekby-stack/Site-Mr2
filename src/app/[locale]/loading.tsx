export default function LocaleLoading() {
  return (
    <main className="min-h-screen bg-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-10 h-14 w-48 rounded-full bg-surface" />
        <div className="mb-6 h-6 w-40 rounded-full bg-surface-2" />
        <div className="mb-4 h-14 w-full max-w-3xl rounded-2xl bg-surface" />
        <div className="mb-3 h-5 w-full max-w-2xl rounded-full bg-surface-2" />
        <div className="mb-12 h-5 w-full max-w-xl rounded-full bg-surface-2" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-40 rounded-2xl bg-surface" />
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-52 rounded-2xl bg-surface" />
          ))}
        </div>
      </div>
    </main>
  )
}
