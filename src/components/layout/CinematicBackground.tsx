'use client'

export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(11,31,77,0.038),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.026),transparent_26rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.034)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.026)_1px,transparent_1px)] bg-[size:96px_96px] opacity-10 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_76%)]" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/24 via-white/8 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[8rem] bg-gradient-to-t from-white/28 via-white/8 to-transparent" />
    </div>
  )
}
