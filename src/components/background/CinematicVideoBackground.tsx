'use client'

export default function CinematicVideoBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#02040A]">
      <video
        className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.03] object-cover opacity-72 saturate-[1.08] contrast-[1.08] brightness-[0.72]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/media/Premium_Automotive_Locksmith_Website_Background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_32%,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.32)_46%,rgba(0,0,0,0.88)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-[#02040A] via-[#02040A]/82 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#02040A]/78 via-[#02040A]/24 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[32rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/72 to-transparent" />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-screen [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0.55px,transparent_0.9px)] [background-size:4px_4px]" />
    </div>
  )
}
