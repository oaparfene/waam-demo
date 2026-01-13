'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VertexData } from './meshes'
import type { MaterialMode } from './mesh-visibility-panel'

interface VertexInfoPanelProps {
  vertexData: VertexData | null
  mode: MaterialMode
}

export function VertexInfoPanel({ vertexData, mode }: VertexInfoPanelProps) {
  // Don't show panel in gray mode or when no data
  if (mode === 'gray' || !vertexData) {
    return null
  }

  return (
    <Card className="w-90 bg-black/80 backdrop-blur-sm border-neutral-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Vertex Data</span>
          <span className="text-xs text-neutral-500 font-mono">#{vertexData.index}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Position */}
        <div className="space-y-1">
          <label className="text-xs text-neutral-400 uppercase tracking-wider">Position</label>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="bg-neutral-900 rounded px-2 py-1.5">
              <span className="text-neutral-500">X</span>{' '}
              <span className="text-cyan-400">{vertexData.position.x.toFixed(2)}</span>
            </div>
            <div className="bg-neutral-900 rounded px-2 py-1.5">
              <span className="text-neutral-500">Y</span>{' '}
              <span className="text-cyan-400">{vertexData.position.y.toFixed(2)}</span>
            </div>
            <div className="bg-neutral-900 rounded px-2 py-1.5">
              <span className="text-neutral-500">Z</span>{' '}
              <span className="text-cyan-400">{vertexData.position.z.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* RGB Data */}
        {mode === 'rgb' && vertexData.rgb && (
          <div className="space-y-1">
            <label className="text-xs text-neutral-400 uppercase tracking-wider">RGB Color</label>
            <div className="flex gap-2 items-center">
              <div className="grid grid-cols-3 gap-2 font-mono text-xs flex-1">
                <div className="bg-neutral-900 rounded px-2 py-1.5">
                  <span className="text-red-400">R</span>{' '}
                  <span className="text-white">{vertexData.rgb.r}</span>
                </div>
                <div className="bg-neutral-900 rounded px-2 py-1.5">
                  <span className="text-green-400">G</span>{' '}
                  <span className="text-white">{vertexData.rgb.g}</span>
                </div>
                <div className="bg-neutral-900 rounded px-2 py-1.5">
                  <span className="text-blue-400">B</span>{' '}
                  <span className="text-white">{vertexData.rgb.b}</span>
                </div>
              </div>
              {/* Color preview */}
              <div 
                className="w-8 h-8 rounded border border-neutral-700"
                style={{ 
                  backgroundColor: `rgb(${vertexData.rgb.r}, ${vertexData.rgb.g}, ${vertexData.rgb.b})` 
                }}
              />
            </div>
          </div>
        )}

        {/* Deposition Data */}
        {mode === 'deviation' && vertexData.deposition && (
          <>
            <div className="space-y-1">
              <label className="text-xs text-neutral-400 uppercase tracking-wider">Deposition (dx, dy, dz)</label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="bg-neutral-900 rounded px-2 py-1.5">
                  <span className="text-neutral-500">dx</span>{' '}
                  <span className="text-orange-400">{vertexData.deposition.dx.toFixed(3)}</span>
                </div>
                <div className="bg-neutral-900 rounded px-2 py-1.5">
                  <span className="text-neutral-500">dy</span>{' '}
                  <span className="text-orange-400">{vertexData.deposition.dy.toFixed(3)}</span>
                </div>
                <div className="bg-neutral-900 rounded px-2 py-1.5">
                  <span className="text-neutral-500">dz</span>{' '}
                  <span className="text-orange-400">{vertexData.deposition.dz.toFixed(3)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-400 uppercase tracking-wider">Magnitude</label>
              <div className="bg-neutral-900 rounded px-3 py-1.5 font-mono text-sm">
                <span className="text-yellow-400">{vertexData.deposition.magnitude.toFixed(4)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

