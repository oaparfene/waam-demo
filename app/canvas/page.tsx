"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { StoreProvider } from "@/lib/store-provider";
import { RamlabMeshes } from "@/components/ramlab-meshes";
import { RobotToolHead } from "@/components/robot-tool-head";
import { RobotStatusPanel } from "@/components/robot-status-panel";
import { MeshVisibilityPanel, MeshVisibility } from "@/components/mesh-visibility-panel";

function CanvasScene({ meshVisibility }: { meshVisibility: MeshVisibility }) {
  return (
    <Canvas className="h-full w-full">
      <ambientLight intensity={0.3} />
      <directionalLight color="white" position={[5, 10, 5]} intensity={1} />
      <directionalLight color="white" position={[-5, 5, -5]} intensity={0.5} />

      <RamlabMeshes visibility={meshVisibility} />
      <RobotToolHead />
      <OrbitControls />
      
      {/* Grid helper for spatial reference */}
      <gridHelper args={[10, 10, '#444', '#222']} />
    </Canvas>
  );
}

function CanvasContent() {
  const [meshVisibility, setMeshVisibility] = useState<MeshVisibility>({
    targetMesh: true,
    resultMesh: true,
  });

  return (
    <div id="canvas-container" className="relative h-screen w-screen bg-neutral-950">
      <CanvasScene meshVisibility={meshVisibility} />
      
      {/* UI Overlay - positioned absolute over the canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left: Mesh visibility controls */}
        <div className="absolute top-4 left-4 pointer-events-auto">
          <MeshVisibilityPanel
            visibility={meshVisibility}
            onVisibilityChange={setMeshVisibility}
          />
        </div>

        {/* Bottom-right: Robot status panel */}
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <RobotStatusPanel />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <StoreProvider>
      <CanvasContent />
    </StoreProvider>
  );
}
