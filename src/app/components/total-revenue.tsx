"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"

const data = [
  { sprint: "S8", committed: 55, completed: 48 },
  { sprint: "S9", committed: 60, completed: 52 },
  { sprint: "S10", committed: 65, completed: 60 },
  { sprint: "S11", committed: 58, completed: 55 },
  { sprint: "S12", committed: 70, completed: 62 },
  { sprint: "S13", committed: 68, completed: 65 },
  { sprint: "S14", committed: 68, completed: 42 },
]

const avgVelocity = Math.round(data.reduce((sum, d) => sum + d.completed, 0) / data.length)

export function TotalRevenue() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">团队速率</h2>
        <div className="px-2 py-1 rounded-md bg-[#DBEAFE]">
          <span className="text-xs font-semibold text-[#2563EB]">平均速率: {avgVelocity} 点/冲刺</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis dataKey="sprint" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [`${value} 点`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
          />
          <Bar dataKey="committed" name="承诺点数" fill="#818CF8" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`committed-${index}`} fill={index === data.length - 1 ? "#A78BFA" : "#818CF8"} />
            ))}
          </Bar>
          <Bar dataKey="completed" name="完成点数" fill="#34D399" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`completed-${index}`} fill={entry.completed < entry.committed * 0.8 ? "#F87171" : "#34D399"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
