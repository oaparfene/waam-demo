'use client'

import { useState } from 'react'
import { ChevronDown, Eye, EyeOff, Palette } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Switch } from '@/components/ui/switch'

export type MaterialMode = 'gray' | 'rgb' | 'deviation'

export interface MeshVisibility {
  targetMesh: boolean
  resultMesh: boolean
}

interface MeshVisibilityPanelProps {
  visibility: MeshVisibility
  onVisibilityChange: (visibility: MeshVisibility) => void
  materialMode: MaterialMode
  onMaterialModeChange: (mode: MaterialMode) => void
}

const MESH_INFO = [
  { key: 'targetMesh' as const, label: 'Target Mesh', description: 'Original target geometry' },
  { key: 'resultMesh' as const, label: 'Result Mesh', description: 'WAAM deposition analysis' },
]

const MATERIAL_MODES: { key: MaterialMode; label: string; color: string }[] = [
  { key: 'gray', label: 'Gray', color: 'bg-neutral-500' },
  { key: 'rgb', label: 'RGB', color: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
  { key: 'deviation', label: 'Deposition', color: 'bg-gradient-to-r from-blue-500 via-green-500 to-red-500' },
]

export function MeshVisibilityPanel({ 
  visibility, 
  onVisibilityChange,
  materialMode,
  onMaterialModeChange,
}: MeshVisibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleMesh = (key: keyof MeshVisibility) => {
    onVisibilityChange({
      ...visibility,
      [key]: !visibility[key],
    })
  }

  const visibleCount = Object.values(visibility).filter(Boolean).length

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="w-72 bg-black/80 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden">
        <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-900/50 transition-colors">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-medium text-white">Meshes</span>
            <span className="text-xs text-neutral-500">({visibleCount}/{MESH_INFO.length})</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t border-neutral-800">
            {MESH_INFO.map((mesh) => (
              <div key={mesh.key}>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                  <div className="flex items-center gap-3">
                    {visibility[mesh.key] ? (
                      <Eye className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-neutral-600" />
                    )}
                    <div>
                      <div className="text-sm text-white">{mesh.label}</div>
                      <div className="text-xs text-neutral-500">{mesh.description}</div>
                    </div>
                  </div>
                  <Switch
                    checked={visibility[mesh.key]}
                    onCheckedChange={() => toggleMesh(mesh.key)}
                  />
                </div>
                
                {/* Material mode selector for Result Mesh */}
                {mesh.key === 'resultMesh' && visibility.resultMesh && (
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-3 h-3 text-neutral-500" />
                      <span className="text-xs text-neutral-500 uppercase tracking-wider">Material</span>
                    </div>
                    <div className="flex gap-1">
                      {MATERIAL_MODES.map((mode) => (
                        <button
                          key={mode.key}
                          onClick={() => onMaterialModeChange(mode.key)}
                          className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                            materialMode === mode.key
                              ? 'bg-neutral-700 text-white ring-1 ring-cyan-500'
                              : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
                          }`}
                        >
                          <div className={`w-full h-1 rounded-sm mb-1 ${mode.color}`} />
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
