export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.055),transparent_34rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.04),transparent_28rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.07)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.055)_1px,transparent_1px)] bg-[size:96px_96px] opacity-16 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white via-white/78 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-white via-white/82 to-transparent" />
    </div>
  )
}
