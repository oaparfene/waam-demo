'use client'

import { useRef } from 'react'
import * as THREE from 'three'

// Custom shader material for deviation visualization
// Uses the actual _dx, _dy, _dz vertex attributes from the GLB
// Computes magnitude and maps to blue→cyan→green→yellow→red color ramp

const vertexShader = `
  attribute float _dx;
  attribute float _dy;
  attribute float _dz;
  
  varying float vMagnitude;
  varying vec3 vNormal;
  
  void main() {
    // Compute the magnitude of the deviation vector
    vec3 deviation = vec3(_dx, _dy, _dz);
    vMagnitude = length(deviation);
    
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float minMagnitude;
  uniform float maxMagnitude;
  
  varying float vMagnitude;
  varying vec3 vNormal;
  
  // Color ramp function: blue → cyan → green → yellow → red
  // Red only appears in the top ~10% of values (outliers)
  vec3 colorRamp(float t) {
    t = clamp(t, 0.0, 1.0);
    
    vec3 blue = vec3(0.0, 0.0, 1.0);
    vec3 cyan = vec3(0.0, 1.0, 1.0);
    vec3 green = vec3(0.0, 1.0, 0.0);
    vec3 yellow = vec3(1.0, 1.0, 0.0);
    vec3 red = vec3(1.0, 0.0, 0.0);
    
    // Adjusted distribution: red only in top 10% (0.9-1.0)
    if (t < 0.1) {
      return mix(blue, cyan, t / 0.1);
    } else if (t < 0.5) {
      return mix(cyan, green, (t - 0.1) / 0.5);
    } else if (t < 0.9) {
      return mix(green, yellow, (t - 0.5) / 0.4);
    } else {
      return mix(yellow, red, (t - 0.9) / 0.1);
    }
  }
  
  void main() {
    // Normalize magnitude to 0-1 range for color mapping
    float normalizedMag = (vMagnitude - minMagnitude) / (maxMagnitude - minMagnitude);
    normalizedMag = clamp(normalizedMag, 0.0, 1.0);
    
    // Get color from ramp
    vec3 color = colorRamp(normalizedMag);
    
    // Add simple lighting for depth
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.3;
    
    vec3 finalColor = color * (ambient + diffuse * 0.7);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

interface DeviationMaterialProps {
  minMagnitude?: number
  maxMagnitude?: number
}

export function DeviationMaterial({ 
  // Highest magnitude values are around 21
  // Set max to ~18-20 so only outliers (>18) show red
  minMagnitude = 0.0, 
  maxMagnitude = 18.0
}: DeviationMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        minMagnitude: { value: minMagnitude },
        maxMagnitude: { value: maxMagnitude },
      }}
    />
  )
}
