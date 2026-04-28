import Link from 'next/link'

const adminCards = [
  {
    title: 'Photos',
    description: 'Upload gallery, service, before/after, and proof photos.',
    href: '/admin/photos',
    status: 'Ready',
  },
  {
    title: 'Direct Editor',
    description: 'Open the existing direct content editor.',
    href: '/admin/direct',
    status: 'Existing',
  },
]

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-accent-cyan">Planet Locksmiths Admin</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Control center</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            Manage website content, upload field photos, create before/after proof cases, and keep the live site fresh without touching GitHub.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-accent-cyan/35 hover:bg-white/[0.06]"
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="rounded-full border border-accent-cyan/25 bg-accent-cyan/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-accent-cyan">
                  {card.status}
                </span>
                <span className="text-2xl text-white/30 transition group-hover:text-accent-cyan">→</span>
              </div>
              <h2 className="text-2xl font-black text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/55">{card.description}</p>
            </Link>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6">
          <h2 className="text-lg font-black">Before / After naming rule</h2>
          <p className="mt-3 text-sm leading-7 text-white/55">
            For proof sliders, upload paired images with category <strong>before</strong> and <strong>after</strong>, then use title or alt text like <strong>case 1</strong>, <strong>case 2</strong>, etc.
          </p>
        </section>
      </div>
    </main>
  )
}
