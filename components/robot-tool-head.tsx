'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAppSelector } from '@/lib/hooks'
import type { RobotStatus } from '@/lib/store'
import type { Group } from 'three'
import { MathUtils } from 'three'

// Status to color mapping
const STATUS_COLORS: Record<RobotStatus, string> = {
  idle: '#22c55e',     // green
  printing: '#3b82f6', // blue
  paused: '#eab308',   // yellow
  error: '#ef4444',    // red
}

export function RobotToolHead() {
  const groupRef = useRef<Group>(null)
  const targetPosition = useAppSelector((state) => state.robot.position)
  const status = useAppSelector((state) => state.robot.status)
  const isActive = status === 'printing'

  // Smooth position interpolation using useFrame
  useFrame(() => {
    if (!groupRef.current) return

    // Lerp to target position for smooth animation
    groupRef.current.position.x = MathUtils.lerp(
      groupRef.current.position.x,
      targetPosition.x,
      0.1
    )
    groupRef.current.position.y = MathUtils.lerp(
      groupRef.current.position.y,
      targetPosition.y,
      0.1
    )
    groupRef.current.position.z = MathUtils.lerp(
      groupRef.current.position.z,
      targetPosition.z,
      0.1
    )
  })

  const color = STATUS_COLORS[status]

  return (
    <group ref={groupRef}>
      {/* Main tool head body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.5, 16]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      {/* Nozzle tip */}
      <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.15, 16]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Status glow ring */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.02, 8, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Light source at nozzle tip - only active when printing */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={isActive ? 2 : 0}
        distance={3}
        decay={2}
        color="#ffaa00"
      />
    </group>
  )
}
