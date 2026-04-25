import PlanetKeyMark from '@/components/brand/PlanetKeyMark'

export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02040A]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02040A_0%,#050812_46%,#02040A_100%)]" />
      <PlanetKeyMark />
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:112px_112px] [mask-image:linear-gradient(180deg,transparent_0%,black_18%,black_68%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(45,226,230,0.045),transparent_28rem),radial-gradient(circle_at_88%_28%,rgba(214,168,95,0.045),transparent_26rem)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-black/45 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/82 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,transparent_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.62)_100%)]" />
    </div>
  )
}
