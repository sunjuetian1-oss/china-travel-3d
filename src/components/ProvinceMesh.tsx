'use client'

import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { geoMercator } from 'd3-geo'

interface ProvinceMeshProps {
  feature: any
  isActive: boolean
  isHovered: boolean
  onClick: (name: string) => void
  onHover: (name: string | null) => void
}

function extractPolygons(geometry: any): number[][][][] {
  const type = geometry.type
  const coords = geometry.coordinates

  if (type === 'Polygon') {
    return [coords]
  } else if (type === 'MultiPolygon') {
    return coords
  }
  return []
}

export default function ProvinceMesh({
  feature,
  isActive,
  isHovered,
  onClick,
  onHover,
}: ProvinceMeshProps) {
  const [hovered, setHovered] = useState(false)

  const shapes = useMemo(() => {
    const projection = geoMercator()
      .center([104, 37.5])
      .scale(80)
      .translate([0, 0])

    const polygons = extractPolygons(feature.geometry)
    const result: THREE.Shape[] = []

    polygons.forEach((polygon) => {
      const projectedRings = polygon
        .map((ring: any) =>
          ring
            .map((point: any) => projection(point))
            .filter((p: any) => p !== null)
        )
        .filter((ring: any) => ring.length > 0)

      if (!projectedRings[0]) return

      const shape = new THREE.Shape()
      const outerRing = projectedRings[0]

      outerRing.forEach(([x, y]: [number, number], i: number) => {
        if (i === 0) shape.moveTo(x, -y)
        else shape.lineTo(x, -y)
      })

      for (let i = 1; i < projectedRings.length; i++) {
        const hole = new THREE.Path()
        const holeRing = projectedRings[i]
        if (!holeRing) continue
        holeRing.forEach(([x, y]: [number, number], j: number) => {
          if (j === 0) hole.moveTo(x, -y)
          else hole.lineTo(x, -y)
        })
        shape.holes.push(hole)
      }

      result.push(shape)
    })

    return result
  }, [feature])

  const color = isActive
    ? '#00bfff'
    : isHovered || hovered
      ? '#4fc3f7'
      : '#1565c0'

  const depth = isActive ? 2.5 : isHovered || hovered ? 1.8 : 1
  const name = feature.properties.name

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onClick(name)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(name)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover(null)
        document.body.style.cursor = 'auto'
      }}
    >
      {shapes.map((shape, idx) => (
        <mesh key={idx} position={[0, 0, 0]}>
          <extrudeGeometry
            args={[
              shape,
              {
                depth,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 1,
              },
            ]}
          />
          <meshStandardMaterial
            color={color}
            emissive={isActive ? '#004466' : '#000000'}
            emissiveIntensity={isActive ? 0.5 : 0}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
