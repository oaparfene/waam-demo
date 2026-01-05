'use client'

import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { updatePosition, setStatus, setTemperature, setAmperage, setVoltage, setJobName, RobotStatus } from '@/lib/store'

const JOB_NAMES = [
  'WAAM Layer 1',
  'WAAM Layer 2',
  'WAAM Layer 3',
  'Calibration Routine',
  'Surface Scan',
  'Quality Check',
]

const STATUSES: RobotStatus[] = ['idle', 'printing', 'paused', 'error']

export function useRobotSimulation() {
  const dispatch = useAppDispatch()
  const isRunning = useAppSelector((state) => state.simulation.isRunning)
  const robotStatus = useAppSelector((state) => state.robot.status)
  const currentPosition = useAppSelector((state) => state.robot.position)
  const positionRef = useRef(currentPosition)
  
  // Keep ref in sync
  useEffect(() => {
    positionRef.current = currentPosition
  }, [currentPosition])

  // Handle pause/resume - set robot status based on simulation state
  useEffect(() => {
    if (!isRunning) {
      // When simulation stops, set to paused if it was printing
      if (robotStatus === 'printing') {
        dispatch(setStatus('paused'))
      }
      // Reset electrical values when simulation stops
      dispatch(setAmperage(0))
      dispatch(setVoltage(0))
    } else {
      // When simulation starts/resumes, set to printing if it was paused
      if (robotStatus === 'paused' || robotStatus === 'idle') {
        dispatch(setStatus('printing'))
        dispatch(setJobName(JOB_NAMES[Math.floor(Math.random() * JOB_NAMES.length)]))
      }
    }
  }, [isRunning, robotStatus, dispatch])

  useEffect(() => {
    if (!isRunning) return

    // Position update interval (60fps-ish for smooth animation)
    const positionInterval = setInterval(() => {
      const pos = positionRef.current
      // Small random increments for smooth movement
      const newPosition = {
        x: pos.x + (Math.random() - 0.5) * 0.1,
        y: pos.y + (Math.random() - 0.5) * 0.1,
        z: pos.z + (Math.random() - 0.5) * 0.1,
      }
      // Clamp to reasonable bounds - robot prints from above the mesh
      newPosition.x = Math.max(-2, Math.min(2, newPosition.x))
      newPosition.y = Math.max(1, Math.min(3, newPosition.y))  // Keep above mesh (y: 1-3)
      newPosition.z = Math.max(-2, Math.min(2, newPosition.z))
      
      dispatch(updatePosition(newPosition))
    }, 50)

    // Temperature update interval
    const temperatureInterval = setInterval(() => {
      // Temperature fluctuates between 180-220 during printing
      const baseTemp = 200
      const variation = (Math.random() - 0.5) * 40
      dispatch(setTemperature(Math.round(baseTemp + variation)))
    }, 500)

    // Amperage update interval (typical WAAM: 150-250A)
    const amperageInterval = setInterval(() => {
      const baseAmps = 200
      const variation = (Math.random() - 0.5) * 50
      dispatch(setAmperage(Math.round(baseAmps + variation)))
    }, 300)

    // Voltage update interval (typical WAAM: 18-24V)
    const voltageInterval = setInterval(() => {
      const baseVolts = 21
      const variation = (Math.random() - 0.5) * 3
      dispatch(setVoltage(Math.round((baseVolts + variation) * 10) / 10)) // Round to 1 decimal
    }, 300)

    // Status/job change interval (occasional changes)
    const statusInterval = setInterval(() => {
      const random = Math.random()
      if (random < 0.1) {
        // 10% chance to change status (but not to paused - that's handled by simulation state)
        const newStatus = STATUSES.filter(s => s !== 'paused')[Math.floor(Math.random() * (STATUSES.length - 1))]
        dispatch(setStatus(newStatus))
      }
      if (random < 0.05) {
        // 5% chance to change job
        dispatch(setJobName(JOB_NAMES[Math.floor(Math.random() * JOB_NAMES.length)]))
      }
    }, 2000)

    return () => {
      clearInterval(positionInterval)
      clearInterval(temperatureInterval)
      clearInterval(amperageInterval)
      clearInterval(voltageInterval)
      clearInterval(statusInterval)
    }
  }, [isRunning, dispatch, robotStatus])
}

