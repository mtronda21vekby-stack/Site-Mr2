export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02040A]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02040A_0%,#050812_46%,#02040A_100%)]" />

      <div className="absolute left-1/2 top-[-34rem] h-[72rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(77,162,255,0.22)_0%,rgba(77,162,255,0.12)_22%,rgba(8,16,31,0.72)_42%,rgba(2,4,10,0)_70%)] blur-[1px]" />
      <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-white/[0.035] bg-[radial-gradient(circle_at_36%_26%,rgba(255,255,255,0.12),transparent_14%),linear-gradient(145deg,rgba(11,23,48,0.52),rgba(2,4,10,0.08))] shadow-[inset_-70px_-90px_150px_rgba(0,0,0,0.78),0_0_110px_rgba(77,162,255,0.12)]" />

      <div className="absolute left-1/2 top-[7rem] h-[12rem] w-[82rem] -translate-x-1/2 rounded-full border border-accent-blue/[0.11] opacity-70 [transform:rotateX(74deg)_rotateZ(-8deg)]" />
      <div className="absolute left-1/2 top-[9rem] h-[8rem] w-[64rem] -translate-x-1/2 rounded-full border border-accent-gold/[0.10] opacity-60 [transform:rotateX(76deg)_rotateZ(13deg)]" />

      <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:108px_108px] [mask-image:linear-gradient(180deg,transparent_0%,black_18%,black_68%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(45,226,230,0.055),transparent_30rem),radial-gradient(circle_at_84%_24%,rgba(214,168,95,0.055),transparent_26rem)]" />
      <div className="absolute left-[-18rem] top-1/3 h-[34rem] w-[34rem] rounded-full bg-accent-cyan/[0.035] blur-3xl" />
      <div className="absolute right-[-16rem] top-[18%] h-[32rem] w-[32rem] rounded-full bg-accent-gold/[0.04] blur-3xl" />

      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[32rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/78 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.18)_62%,rgba(0,0,0,0.58)_100%)]" />
    </div>
  )
}
