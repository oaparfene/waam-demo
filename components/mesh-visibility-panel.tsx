'use client'

import { useState } from 'react'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Switch } from '@/components/ui/switch'

export interface MeshVisibility {
  targetMesh: boolean
  resultMesh: boolean
}

interface MeshVisibilityPanelProps {
  visibility: MeshVisibility
  onVisibilityChange: (visibility: MeshVisibility) => void
}

const MESH_INFO = [
  { key: 'targetMesh' as const, label: 'Target Mesh', description: 'Original target geometry' },
  { key: 'resultMesh' as const, label: 'Result Mesh', description: 'WAAM deposition analysis' },
]

export function MeshVisibilityPanel({ visibility, onVisibilityChange }: MeshVisibilityPanelProps) {
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
      <div className="w-64 bg-black/80 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden">
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
              <div
                key={mesh.key}
                className="px-4 py-3 flex items-center justify-between hover:bg-neutral-900/30 transition-colors"
              >
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
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

