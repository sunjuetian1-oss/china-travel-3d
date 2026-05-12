import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '中国3D旅行地图',
  description: '探索中国34个省级行政区的旅游攻略',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
