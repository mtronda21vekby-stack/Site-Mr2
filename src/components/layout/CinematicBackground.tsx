import Background3DClient from '@/components/background/Background3DClient'

export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Background3DClient />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.6)_70%)]" />
    </div>
  )
}
