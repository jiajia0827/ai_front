"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { sprint: "S10", features: 8, bugs: 3 },
  { sprint: "S11", features: 10, bugs: 5 },
  { sprint: "S12", features: 7, bugs: 4 },
  { sprint: "S13", features: 12, bugs: 2 },
  { sprint: "S14", features: 9, bugs: 7 },
]

const totalFeatures = data.reduce((s, d) => s + d.features, 0)
const totalBugs = data.reduce((s, d) => s + d.bugs, 0)
const bugRate = Math.round((totalBugs / (totalFeatures + totalBugs)) * 100)

export function VolumeServiceLevel() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">需求 vs 缺陷</h2>
        <div className="px-2 py-1 rounded-md bg-[#FEE2E2]">
          <span className="text-xs font-semibold text-[#DC2626]">缺陷率 {bugRate}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data} barGap={4} barSize={18}>
          <XAxis dataKey="sprint" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [`${value} 个`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "4px" }}
          />
          <Bar dataKey="features" name="需求" fill="#06B6D4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="bugs" name="缺陷" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-1">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#06B6D4]" />
          <span className="text-xs text-muted-foreground">需求总数</span>
          <span className="text-sm font-bold text-card-foreground">{totalFeatures}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-muted-foreground">缺陷总数</span>
          <span className="text-sm font-bold text-card-foreground">{totalBugs}</span>
        </div>
      </div>
    </div>
  )
}
