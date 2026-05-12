'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useState, useEffect } from 'react'

import { travelData } from '@/data/travelData'
import ProvinceMesh from './ProvinceMesh'
import TravelPanel from './TravelPanel'

export default function ChinaMap3D() {
  const [selectedProvince, setSelectedProvince] = useState('北京市')
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data.features || [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-2xl mb-4">🗺️ 正在加载中国地图...</div>
          <div className="text-zinc-400">请稍候，首次加载可能需要几秒</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-2xl mb-4 text-red-400">❌ 地图数据加载失败</div>
          <div className="text-zinc-400">请刷新页面重试</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex bg-black overflow-hidden">
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [0, -60, 120], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            color="#ffffff"
          />
          <directionalLight
            position={[-10, -10, 5]}
            intensity={0.5}
            color="#00bfff"
          />
          <pointLight position={[0, 0, 50]} intensity={1} color="#00bfff" />
          <Stars
            radius={200}
            depth={50}
            count={1000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <group rotation={[-0.4, 0, 0]} position={[0, 10, 0]}>
            {features.map((feature: any, index: number) => {
              const name = feature?.properties?.name
              if (!name) return null
              return (
                <ProvinceMesh
                  key={index}
                  feature={feature}
                  isActive={selectedProvince === name}
                  isHovered={hoveredProvince === name}
                  onClick={setSelectedProvince}
                  onHover={setHoveredProvince}
                />
              )
            })}
          </group>
          <OrbitControls
            enablePan
            enableRotate
            enableZoom
            minDistance={50}
            maxDistance={300}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
        <div className="absolute top-4 left-4 text-white pointer-events-none">
          <h1 className="text-2xl font-bold text-cyan-400 drop-shadow-lg">
            🇨🇳 中国3D旅行地图
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            点击省份查看旅游攻略 · 滚轮缩放 · 拖拽旋转
          </p>
        </div>
        {hoveredProvince && hoveredProvince !== selectedProvince && (
          <div className="absolute bottom-4 left-4 bg-zinc-900/90 text-white px-4 py-2 rounded-lg border border-zinc-700 pointer-events-none">
            {hoveredProvince}
          </div>
        )}
      </div>
      <TravelPanel
        province={selectedProvince}
        data={travelData[selectedProvince]}
      />
    </div>
  )
}
