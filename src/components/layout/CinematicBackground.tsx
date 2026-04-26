import SafeUnlockScene from '@/components/background/SafeUnlockScene'

export default function CinematicBackground() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02040A]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#02040A_0%,#050812_42%,#02040A_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(77,162,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(77,162,255,0.10)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(circle_at_62%_30%,black_0%,black_38%,transparent_74%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_24%,rgba(77,162,255,0.16),transparent_23rem),radial-gradient(circle_at_72%_38%,rgba(214,168,95,0.10),transparent_20rem),radial-gradient(circle_at_18%_22%,rgba(45,226,230,0.055),transparent_28rem)]" />
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black/52 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[38rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/86 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,transparent_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.74)_100%)]" />
      </div>
      <SafeUnlockScene />
    </>
  )
}
