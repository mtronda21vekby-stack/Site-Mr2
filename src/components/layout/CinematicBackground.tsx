export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#0757D8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.24),transparent_34rem),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.14),transparent_28rem),linear-gradient(180deg,#0B6CFF_0%,#0757D8_48%,#063B9F_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.20)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:96px_96px] opacity-20 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#063B9F]/45 via-[#0757D8]/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-[#063B9F] via-[#0757D8]/66 to-transparent" />
    </div>
  )
}
