'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import * as THREE from 'three'

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function eased(value: number) {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}

function getScrollProgress() {
  if (typeof window === 'undefined') return 0
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  return clamp01(window.scrollY / max)
}

function MechanicalCore({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const inner = useRef<THREE.Group>(null!)
  const leftShell = useRef<THREE.Mesh>(null!)
  const rightShell = useRef<THREE.Mesh>(null!)

  useFrame(({ mouse, clock }) => {
    const t = clock.getElapsedTime()
    const turn = eased((progressRef.current - 0.28) / 0.48)
    const open = eased((progressRef.current - 0.52) / 0.34)
    if (group.current) {
      group.current.rotation.y = mouse.x * 0.28 + Math.sin(t * 0.18) * 0.04 + turn * 0.38
      group.current.rotation.x = -mouse.y * 0.18 + Math.sin(t * 0.14) * 0.025
      group.current.scale.setScalar(1 + open * 0.035)
    }
    if (inner.current) inner.current.rotation.z = t * 0.08 + turn * 1.35
    if (leftShell.current) leftShell.current.position.x = -open * 0.2
    if (rightShell.current) rightShell.current.position.x = open * 0.2
  })

  const blue = useMemo(() => new THREE.Color('#4da2ff'), [])
  const brass = useMemo(() => new THREE.Color('#d6a85f'), [])

  return (
    <group ref={group} position={[1.65, 0.15, -1]} rotation={[0.12, -0.28, 0]}>
      <mesh ref={leftShell}>
        <sphereGeometry args={[1.92, 128, 128, 0, Math.PI]} />
        <meshStandardMaterial color="#07101b" metalness={0.92} roughness={0.28} envMapIntensity={1.8} />
      </mesh>
      <mesh ref={rightShell} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[1.92, 128, 128, 0, Math.PI]} />
        <meshStandardMaterial color="#07101b" metalness={0.92} roughness={0.28} envMapIntensity={1.8} />
      </mesh>

      <group ref={inner}>
        {[2.18, 2.55, 2.92].map((radius, index) => (
          <mesh key={radius} rotation={[Math.PI / 2, 0, index * 0.55]}>
            <torusGeometry args={[radius, 0.012 + index * 0.004, 24, 192]} />
            <meshStandardMaterial color={index === 1 ? brass : blue} metalness={0.95} roughness={0.18} emissive={index === 1 ? '#3b2406' : '#061d3b'} emissiveIntensity={0.25 + index * 0.08} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0, 1.94]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 96]} />
        <meshStandardMaterial color="#05070b" metalness={0.96} roughness={0.2} envMapIntensity={2.2} />
      </mesh>
      <mesh position={[0, 0.05, 2.01]}>
        <boxGeometry args={[0.16, 0.76, 0.08]} />
        <meshStandardMaterial color="#d6a85f" metalness={1} roughness={0.16} emissive="#2b1602" emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[0, 0.44, 2.04]}>
        <torusGeometry args={[0.18, 0.025, 18, 64]} />
        <meshStandardMaterial color="#4da2ff" metalness={0.7} roughness={0.25} emissive="#143b68" emissiveIntensity={0.75} />
      </mesh>
    </group>
  )
}

function PremiumKey({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!)

  useFrame(({ mouse, clock }) => {
    const t = clock.getElapsedTime()
    const insert = eased(progressRef.current / 0.52)
    if (!group.current) return
    group.current.position.set(1.65, 2.65 - insert * 1.28 + Math.sin(t * 0.75) * 0.035 * (1 - insert), 1.25 - insert * 0.9)
    group.current.rotation.y = mouse.x * 0.35 + Math.sin(t * 0.28) * 0.08 * (1 - insert)
    group.current.rotation.x = -0.28 + mouse.y * 0.18 + insert * 0.26
    group.current.rotation.z = 0.12 - insert * 0.12
    group.current.scale.setScalar(1 - insert * 0.08)
  })

  return (
    <group ref={group} position={[1.65, 2.65, 1.25]} rotation={[-0.28, 0, 0.12]}>
      <mesh>
        <torusGeometry args={[0.28, 0.055, 28, 96]} />
        <meshStandardMaterial color="#d6a85f" metalness={1} roughness={0.14} envMapIntensity={2.4} />
      </mesh>
      <mesh position={[0, -0.52, 0]}>
        <boxGeometry args={[0.12, 0.9, 0.11]} />
        <meshStandardMaterial color="#c48a3a" metalness={1} roughness={0.16} envMapIntensity={2.2} />
      </mesh>
      <mesh position={[0.18, -0.95, 0]}>
        <boxGeometry args={[0.38, 0.12, 0.11]} />
        <meshStandardMaterial color="#d6a85f" metalness={1} roughness={0.16} />
      </mesh>
      <mesh position={[0.12, -1.16, 0]}>
        <boxGeometry args={[0.26, 0.12, 0.11]} />
        <meshStandardMaterial color="#b87333" metalness={1} roughness={0.18} />
      </mesh>
      <pointLight position={[0, -0.2, 0.6]} color="#d6a85f" intensity={1.8} distance={3} />
    </group>
  )
}

function CityGrid({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!)

  useFrame(({ mouse, clock }) => {
    const reveal = eased((progressRef.current - 0.48) / 0.34)
    if (!group.current) return
    group.current.position.x = mouse.x * 0.18
    group.current.position.y = -1.9 + reveal * 0.28 + mouse.y * 0.08 + Math.sin(clock.getElapsedTime() * 0.3) * 0.02
    group.current.scale.setScalar(0.92 + reveal * 0.12)
    group.current.visible = reveal > 0.02
  })

  return (
    <group ref={group} position={[0.55, -1.9, -1.9]} rotation={[-1.25, 0, -0.16]}>
      <gridHelper args={[7, 28, '#2de2e6', '#123b55']} />
      {[-1.6, -0.4, 0.9, 1.9].map((x, index) => (
        <mesh key={x} position={[x, 0.02, index % 2 ? 0.7 : -0.55]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial color={index === 2 ? '#d6a85f' : '#4da2ff'} emissive={index === 2 ? '#6b3f0a' : '#174f8c'} emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  )
}

function UnlockPulse({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null!)
  const material = useRef<THREE.MeshBasicMaterial>(null!)

  useFrame(() => {
    const p = eased((progressRef.current - 0.42) / 0.25)
    const fade = Math.sin(p * Math.PI)
    if (ref.current) ref.current.scale.setScalar(0.7 + p * 2.4)
    if (material.current) material.current.opacity = fade * 0.38
  })

  return (
    <mesh ref={ref} position={[1.65, 0.15, 1.08]}>
      <torusGeometry args={[0.82, 0.018, 24, 160]} />
      <meshBasicMaterial ref={material} color="#4da2ff" transparent opacity={0} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

function Scene() {
  const rig = useRef<THREE.Group>(null!)
  const progressRef = useRef(0)

  useFrame(({ mouse, clock, camera }) => {
    progressRef.current = getScrollProgress()
    const p = progressRef.current
    if (rig.current) {
      rig.current.rotation.y = mouse.x * 0.08 - p * 0.04
      rig.current.rotation.x = -mouse.y * 0.04
      rig.current.position.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.06
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.28 - p * 0.18, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.15 + mouse.y * 0.12 + p * 0.12, 0.04)
    camera.lookAt(1.05, 0.05, -0.5)
  })

  return (
    <group ref={rig}>
      <Float speed={1.05} rotationIntensity={0.08} floatIntensity={0.18}>
        <MechanicalCore progressRef={progressRef} />
      </Float>
      <PremiumKey progressRef={progressRef} />
      <UnlockPulse progressRef={progressRef} />
      <CityGrid progressRef={progressRef} />
    </group>
  )
}

export default function Background3DEngine() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#02040A]">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.15, 6.2], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}>
        <color attach="background" args={['#02040A']} />
        <fog attach="fog" args={['#02040A', 6, 12]} />
        <ambientLight intensity={0.22} />
        <directionalLight position={[4, 5, 5]} intensity={1.6} color="#cfe8ff" />
        <pointLight position={[2.8, 1.8, 2.5]} intensity={3.2} color="#4da2ff" distance={7} />
        <pointLight position={[0.6, 2.6, 2.8]} intensity={2.4} color="#d6a85f" distance={5} />
        <Environment preset="city" />
        <Scene />
      </Canvas>
    </div>
  )
}
