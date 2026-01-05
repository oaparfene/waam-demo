import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

// Types
export type RobotStatus = 'idle' | 'printing' | 'paused' | 'error'

export interface Position {
  x: number
  y: number
  z: number
}

export interface RobotState {
  position: Position
  status: RobotStatus
  temperature: number
  amperage: number
  voltage: number
  jobName: string
}

export interface SimulationState {
  isRunning: boolean
}

// Initial states
const initialRobotState: RobotState = {
  position: { x: 0, y: 2, z: 0 },  // Start above the mesh
  status: 'idle',
  temperature: 25,
  amperage: 0,
  voltage: 0,
  jobName: 'No active job',
}

const initialSimulationState: SimulationState = {
  isRunning: false,
}

// Robot slice
const robotSlice = createSlice({
  name: 'robot',
  initialState: initialRobotState,
  reducers: {
    updatePosition: (state, action: PayloadAction<Position>) => {
      state.position = action.payload
    },
    setStatus: (state, action: PayloadAction<RobotStatus>) => {
      state.status = action.payload
    },
    setTemperature: (state, action: PayloadAction<number>) => {
      state.temperature = action.payload
    },
    setAmperage: (state, action: PayloadAction<number>) => {
      state.amperage = action.payload
    },
    setVoltage: (state, action: PayloadAction<number>) => {
      state.voltage = action.payload
    },
    setJobName: (state, action: PayloadAction<string>) => {
      state.jobName = action.payload
    },
    updateRobot: (state, action: PayloadAction<Partial<RobotState>>) => {
      return { ...state, ...action.payload }
    },
    resetRobot: () => {
      return initialRobotState
    },
  },
})

// Simulation slice
const simulationSlice = createSlice({
  name: 'simulation',
  initialState: initialSimulationState,
  reducers: {
    toggleSimulation: (state) => {
      state.isRunning = !state.isRunning
    },
    setSimulationRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload
    },
    resetSimulation: (state) => {
      state.isRunning = false
    },
  },
})

// Export actions
export const { updatePosition, setStatus, setTemperature, setAmperage, setVoltage, setJobName, updateRobot, resetRobot } = robotSlice.actions
export const { toggleSimulation, setSimulationRunning, resetSimulation } = simulationSlice.actions

// Create store
export const makeStore = () => {
  return configureStore({
    reducer: {
      robot: robotSlice.reducer,
      simulation: simulationSlice.reducer,
    },
  })
}

// Store types
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

