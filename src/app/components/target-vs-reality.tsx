"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const data = [
  { sprint: "S8", planned: 55, completed: 48 },
  { sprint: "S9", planned: 60, completed: 52 },
  { sprint: "S10", planned: 65, completed: 60 },
  { sprint: "S11", planned: 58, completed: 55 },
  { sprint: "S12", planned: 70, completed: 62 },
  { sprint: "S13", planned: 68, completed: 65 },
  { sprint: "S14", planned: 68, completed: 42 },
]

const avgPlanned = Math.round(data.reduce((s, d) => s + d.planned, 0) / data.length)
const avgCompleted = Math.round(data.reduce((s, d) => s + d.completed, 0) / data.length)
const completionRate = Math.round((avgCompleted / avgPlanned) * 100)

export function TargetVsReality() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">计划 vs 实际</h2>
        <div className="px-2 py-1 rounded-md bg-[#EDE9FE]">
          <span className="text-xs font-semibold text-[#7C3AED]">达成率 {completionRate}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} barGap={2} barSize={9}>
          <XAxis dataKey="sprint" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [`${value} 点`, name]}
          />
          <Bar dataKey="planned" name="计划点数" radius={[3, 3, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`planned-${index}`} fill="#818CF8" />
            ))}
          </Bar>
          <Bar dataKey="completed" name="完成点数" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`completed-${index}`} fill={entry.completed >= entry.planned * 0.9 ? "#34D399" : "#FB923C"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#818CF8]" />
          <span className="text-xs text-muted-foreground">计划</span>
          <span className="text-xs font-bold text-card-foreground ml-auto">平均</span>
          <span className="text-sm font-bold text-[#818CF8]">{avgPlanned} 点</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#34D399]" />
          <span className="text-xs text-muted-foreground">完成</span>
          <span className="text-xs font-bold text-card-foreground ml-auto">平均</span>
          <span className="text-sm font-bold text-[#34D399]">{avgCompleted} 点</span>
        </div>
      </div>
    </div>
  )
}
