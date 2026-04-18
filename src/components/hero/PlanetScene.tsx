"use client";
import OrbitRing from './OrbitRing';

export default function PlanetScene() {
  return (
    <div className="relative h-80 w-80">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-gold opacity-40 blur-3xl"></div>
      {/* Planet */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-gradient-to-br from-surface to-surface-2 shadow-inner shadow-black/40"></div>
      </div>
      {/* Orbits */}
      <OrbitRing
        radius="20rem"
        text="Premium Automotive Locksmith • Urgent & Mobile • "
        speed={40}
      />
      <OrbitRing
        radius="16rem"
        text="Philadelphia Coverage • 24/7 Service • "
        speed={-30}
      />
    </div>
  );
}
