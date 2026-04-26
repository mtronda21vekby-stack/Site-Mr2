export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02040A]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02040A_0%,#050812_42%,#02040A_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(77,162,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(77,162,255,0.10)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(circle_at_62%_30%,black_0%,black_38%,transparent_74%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_24%,rgba(77,162,255,0.16),transparent_23rem),radial-gradient(circle_at_72%_38%,rgba(214,168,95,0.10),transparent_20rem),radial-gradient(circle_at_18%_22%,rgba(45,226,230,0.055),transparent_28rem)]" />

      <div className="absolute left-1/2 top-[-7rem] h-[42rem] w-[42rem] -translate-x-1/2 opacity-80 sm:top-[-9rem] md:left-[67%] md:top-[-8rem] md:h-[50rem] md:w-[50rem] md:opacity-95">
        <div className="absolute inset-[10%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_42%_34%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_52%_52%,#101827_0%,#060B13_48%,#02040A_72%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-40px_90px_rgba(0,0,0,0.72),0_0_110px_rgba(77,162,255,0.14)]" />
        <div className="absolute inset-[7%] rounded-full border border-accent-blue/18" />
        <div className="absolute inset-[15%] rounded-full border border-accent-gold/18" />
        <div className="absolute inset-[23%] rounded-full border border-white/10" />

        <div className="absolute left-1/2 top-1/2 h-28 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/16 bg-black/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_42px_rgba(77,162,255,0.20)] backdrop-blur-xl">
          <div className="absolute left-1/2 top-5 h-12 w-7 -translate-x-1/2 rounded-full border border-accent-blue/35 bg-accent-blue/10 shadow-[0_0_24px_rgba(77,162,255,0.28)]" />
          <div className="absolute left-1/2 top-14 h-14 w-3 -translate-x-1/2 rounded-full bg-accent-gold/70 shadow-[0_0_18px_rgba(214,168,95,0.28)]" />
        </div>

        <div className="absolute left-1/2 top-[2.5rem] h-44 w-16 -translate-x-1/2 rounded-full">
          <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full border-[5px] border-accent-gold/75 shadow-[0_0_24px_rgba(214,168,95,0.22)]" />
          <div className="absolute left-1/2 top-10 h-28 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent-gold via-[#B87333] to-accent-gold shadow-[0_0_28px_rgba(214,168,95,0.22)]" />
          <div className="absolute left-[calc(50%+0.35rem)] top-[6.5rem] h-3 w-9 rounded-r-sm bg-accent-gold/80" />
          <div className="absolute left-[calc(50%+0.35rem)] top-[8rem] h-3 w-6 rounded-r-sm bg-[#B87333]/90" />
        </div>

        <div className="absolute left-[18%] top-[56%] h-[13rem] w-[30rem] rotate-[-10deg] opacity-70 [background-image:linear-gradient(rgba(45,226,230,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(45,226,230,0.14)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_78%,transparent_100%)]" />
        <div className="absolute left-[30%] top-[66%] h-2 w-2 rounded-full bg-accent-blue shadow-[0_0_18px_rgba(77,162,255,0.8)]" />
        <div className="absolute left-[45%] top-[59%] h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_18px_rgba(45,226,230,0.8)]" />
        <div className="absolute left-[58%] top-[70%] h-2 w-2 rounded-full bg-accent-gold shadow-[0_0_18px_rgba(214,168,95,0.72)]" />
      </div>

      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black/52 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[38rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/86 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,transparent_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.74)_100%)]" />
    </div>
  )
}
