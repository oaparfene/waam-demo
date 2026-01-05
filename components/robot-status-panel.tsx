"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  toggleSimulation,
  resetSimulation,
  resetRobot,
  RobotStatus,
} from "@/lib/store";
import { useRobotSimulation } from "@/hooks/use-robot-simulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Status badge colors
const STATUS_CONFIG: Record<
  RobotStatus,
  { bg: string; text: string; label: string }
> = {
  idle: { bg: "bg-green-500/20", text: "text-green-400", label: "Idle" },
  printing: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Printing" },
  paused: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Paused" },
  error: { bg: "bg-red-500/20", text: "text-red-400", label: "Error" },
};

export function RobotStatusPanel() {
  const dispatch = useAppDispatch();
  const robot = useAppSelector((state) => state.robot);
  const isRunning = useAppSelector((state) => state.simulation.isRunning);

  // Activate simulation hook
  useRobotSimulation();

  const statusConfig = STATUS_CONFIG[robot.status];

  const handleReset = () => {
    dispatch(resetSimulation());
    dispatch(resetRobot());
  };

  return (
    <Card className="w-[600px] bg-black/80 backdrop-blur-sm border-neutral-800 text-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          {/* Job Name */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-400 uppercase tracking-wider">
              Current Job
            </label>
            <div className="bg-neutral-900 rounded px-3 py-1.5 text-sm truncate">
              {robot.jobName}
            </div>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${statusConfig.bg} ${statusConfig.text}`}
          >
            {statusConfig.label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* First row: Position and Temperature */}
        <div className="grid grid-cols-1 gap-4">
          {/* Position */}
          <div className="space-y-1">
            <label className="text-xs text-neutral-400 uppercase tracking-wider">
              Position
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-sm">
              <div className="bg-neutral-900 rounded px-2 py-1.5">
                <span className="text-neutral-500">X</span>{" "}
                <span className="text-cyan-400">
                  {robot.position.x.toFixed(2)}
                </span>
              </div>
              <div className="bg-neutral-900 rounded px-2 py-1.5">
                <span className="text-neutral-500">Y</span>{" "}
                <span className="text-cyan-400">
                  {robot.position.y.toFixed(2)}
                </span>
              </div>
              <div className="bg-neutral-900 rounded px-2 py-1.5">
                <span className="text-neutral-500">Z</span>{" "}
                <span className="text-cyan-400">
                  {robot.position.z.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Second row: Amperage and Voltage */}
        <div className="grid grid-cols-3 gap-4">
          {/* Amperage */}
          <div className="space-y-1">
            <label className="text-xs text-neutral-400 uppercase tracking-wider">
              Amperage
            </label>
            <div className="bg-neutral-900 rounded px-3 py-1.5 font-mono text-sm">
              <span className="text-yellow-400">{robot.amperage}A</span>
            </div>
          </div>

          {/* Voltage */}
          <div className="space-y-1">
            <label className="text-xs text-neutral-400 uppercase tracking-wider">
              Voltage
            </label>
            <div className="bg-neutral-900 rounded px-3 py-1.5 font-mono text-sm">
              <span className="text-purple-400">{robot.voltage}V</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-1">
            <label className="text-xs text-neutral-400 uppercase tracking-wider">
              Temperature
            </label>
            <div className="bg-neutral-900 rounded px-3 py-1.5 font-mono text-sm">
              <span className="text-orange-400">{robot.temperature}°C</span>
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => dispatch(toggleSimulation())}
            variant={isRunning ? "destructive" : "default"}
            className="flex-1"
          >
            {isRunning ? "Stop Simulation" : "Start Simulation"}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 text-black"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
