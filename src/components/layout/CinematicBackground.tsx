export default function CinematicBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#02040A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(77,162,255,0.10),transparent_34rem),radial-gradient(circle_at_86%_12%,rgba(45,226,230,0.07),transparent_28rem),linear-gradient(180deg,#02040A_0%,#03050B_45%,#02040A_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:96px_96px] opacity-30 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#02040A] via-[#02040A]/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/82 to-transparent" />
    </div>
  )
}
