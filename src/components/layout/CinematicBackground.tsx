export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(77,162,255,0.18),transparent_36rem),radial-gradient(circle_at_88%_22%,rgba(214,168,95,0.11),transparent_30rem),linear-gradient(180deg,#02040A_0%,#05070B_48%,#02040A_100%)]" />

      <div className="absolute left-1/2 top-[-24rem] h-[58rem] w-[58rem] -translate-x-1/2 rounded-full border border-accent-blue/15 opacity-80 shadow-[0_0_120px_rgba(77,162,255,0.16)]" />
      <div className="absolute left-1/2 top-[-18rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full border border-accent-cyan/10" />
      <div className="absolute left-1/2 top-[-11rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,0.2),transparent_10%),radial-gradient(circle_at_65%_70%,rgba(45,226,230,0.22),transparent_18%),linear-gradient(145deg,rgba(12,24,49,0.72),rgba(2,4,10,0.94))] shadow-[inset_-44px_-60px_120px_rgba(0,0,0,0.72),0_0_130px_rgba(77,162,255,0.24)]" />

      <div className="absolute left-1/2 top-[5rem] h-[16rem] w-[72rem] -translate-x-1/2 rounded-full border border-accent-blue/20 opacity-70 [transform:rotateX(70deg)_rotateZ(-10deg)]" />
      <div className="absolute left-1/2 top-[7rem] h-[12rem] w-[64rem] -translate-x-1/2 rounded-full border border-accent-gold/20 opacity-60 [transform:rotateX(72deg)_rotateZ(14deg)]" />

      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(circle_at_50%_15%,black,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(77,162,255,0.08)_42%,transparent_58%),linear-gradient(245deg,transparent_0%,rgba(214,168,95,0.07)_44%,transparent_62%)]" />

      <div className="absolute left-[8%] top-[18%] hidden h-28 w-28 rounded-full border border-accent-blue/15 md:block" />
      <div className="absolute right-[9%] top-[34%] hidden h-20 w-20 rounded-full border border-accent-gold/20 md:block" />
      <div className="absolute bottom-[10%] left-[14%] hidden h-24 w-24 rounded-full border border-accent-cyan/10 md:block" />

      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:100%_4px]" />
    </div>
  )
}
