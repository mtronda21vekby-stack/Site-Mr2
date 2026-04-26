'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Core() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ mouse }) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.002
    ref.current.rotation.x = mouse.y * 0.2
    ref.current.rotation.z = mouse.x * 0.2
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 128, 128]} />
      <meshStandardMaterial
        color="#0a0f1a"
        metalness={0.9}
        roughness={0.25}
        envMapIntensity={2}
      />
    </mesh>
  )
}

function Key() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ mouse }) => {
    if (!ref.current) return
    ref.current.rotation.y = mouse.x * 0.6
    ref.current.rotation.x = mouse.y * 0.4
  })

  return (
    <mesh ref={ref} position={[0, 2.5, 0]}>
      <boxGeometry args={[0.2, 1.2, 0.2]} />
      <meshStandardMaterial
        color="#d6a85f"
        metalness={1}
        roughness={0.2}
      />
    </mesh>
  )
}

export default function Background3DEngine() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Environment preset="city" />

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <Core />
        </Float>

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <Key />
        </Float>
      </Canvas>
    </div>
  )
}
