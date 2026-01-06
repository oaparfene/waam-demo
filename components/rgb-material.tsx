'use client'

import { useRef } from 'react'
import * as THREE from 'three'

// Custom shader material for RGB vertex color visualization
// Reads from color attribute which contains the RGB data from the PLY

const vertexShader = `
  attribute vec4 color;
  varying vec3 vColor;
  varying vec3 vNormal;
  
  void main() {
    // color contains RGB values - stored as 16-bit, shader receives normalized floats
    vColor = color.rgb;
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying vec3 vNormal;
  
  void main() {
    // Add simple lighting for depth perception
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.3;
    
    vec3 finalColor = vColor * (ambient + diffuse * 0.7);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function RGBMaterial() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  )
}
