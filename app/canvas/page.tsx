"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { StoreProvider } from "@/lib/store-provider";
import { RamlabMeshes, VertexData } from "@/components/meshes";
import { RobotToolHead } from "@/components/robot-tool-head";
import { RobotStatusPanel } from "@/components/robot-status-panel";
import { MeshVisibilityPanel, MeshVisibility, MaterialMode } from "@/components/mesh-visibility-panel";
import { VertexInfoPanel } from "@/components/vertex-info-panel";

interface CanvasSceneProps {
  meshVisibility: MeshVisibility;
  materialMode: MaterialMode;
  onVertexHover: (data: VertexData | null) => void;
}

function CanvasScene({ meshVisibility, materialMode, onVertexHover }: CanvasSceneProps) {
  return (
    <Canvas className="h-full w-full">
      <ambientLight intensity={0.3} />
      <directionalLight color="white" position={[5, 10, 5]} intensity={1} />
      <directionalLight color="white" position={[-5, 5, -5]} intensity={0.5} />

      <RamlabMeshes 
        visibility={meshVisibility} 
        materialMode={materialMode} 
        onVertexHover={onVertexHover}
      />
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
  const [materialMode, setMaterialMode] = useState<MaterialMode>('gray');
  const [vertexData, setVertexData] = useState<VertexData | null>(null);

  return (
    <div id="canvas-container" className="relative h-screen w-screen bg-neutral-950">
      <CanvasScene 
        meshVisibility={meshVisibility} 
        materialMode={materialMode}
        onVertexHover={setVertexData}
      />
      
      {/* UI Overlay - positioned absolute over the canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left: Mesh visibility controls */}
        <div className="absolute top-4 left-4 pointer-events-auto">
          <MeshVisibilityPanel
            visibility={meshVisibility}
            onVisibilityChange={setMeshVisibility}
            materialMode={materialMode}
            onMaterialModeChange={setMaterialMode}
          />
        </div>

        {/* Bottom-left: Vertex info panel */}
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <VertexInfoPanel vertexData={vertexData} mode={materialMode} />
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
