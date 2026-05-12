import { TravelInfo } from '@/types/map'

interface TravelPanelProps {
  province: string
  data: TravelInfo | undefined
}

export default function TravelPanel({ province, data }: TravelPanelProps) {
  if (!data) {
    return (
      <div className="w-[360px] bg-zinc-900 text-white p-6 flex flex-col h-screen border-l border-zinc-800">
        <h2 className="text-2xl font-bold mb-4">{province}</h2>
        <p className="text-zinc-400">暂无该省份的详细攻略，敬请期待！</p>
      </div>
    )
  }

  return (
    <div className="w-[360px] bg-zinc-900 text-white p-6 flex flex-col h-screen overflow-y-auto border-l border-zinc-800">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">{data.title}</h2>
      <div className="w-16 h-1 bg-cyan-500 mb-6 rounded"></div>

      <p className="text-zinc-300 leading-7 mb-6 text-sm">{data.desc}</p>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-amber-400 flex items-center gap-2">
          <span>🍜</span> 必吃美食
        </h3>
        <ul className="space-y-2">
          {data.foods?.map((item: string) => (
            <li
              key={item}
              className="bg-zinc-800 p-3 rounded-lg text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-emerald-400 flex items-center gap-2">
          <span>🏞️</span> 推荐景点
        </h3>
        <ul className="space-y-2">
          {data.places?.map((item: string) => (
            <li
              key={item}
              className="bg-zinc-800 p-3 rounded-lg text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6 text-xs text-zinc-500 text-center">
        点击地图其他省份查看攻略
      </div>
    </div>
  )
}
