"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"

const data = [
  { day: "第1天", ideal: 68, actual: 68 },
  { day: "第2天", ideal: 63, actual: 65 },
  { day: "第3天", ideal: 58, actual: 60 },
  { day: "第4天", ideal: 53, actual: 55 },
  { day: "第5天", ideal: 49, actual: 48 },
  { day: "第6天", ideal: 44, actual: 44 },
  { day: "第7天", ideal: 39, actual: 42 },
  { day: "第8天", ideal: 34, actual: 38 },
  { day: "第9天", ideal: 29 },
  { day: "第10天", ideal: 24 },
  { day: "第11天", ideal: 19 },
  { day: "第12天", ideal: 15 },
  { day: "第13天", ideal: 10 },
  { day: "第14天", ideal: 0 },
]

export function VisitorInsights() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">冲刺燃尽图</h2>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#FEF3C7]">
          <span className="text-xs font-semibold text-[#D97706]">剩余 26 点</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 70]}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [
              `${value} 点`,
              name,
            ]}
          />
          <ReferenceLine y={26} stroke="#F59E0B" strokeDasharray="3 3" strokeWidth={1} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
          />
          <Line
            type="monotone"
            dataKey="ideal"
            name="理想燃尽"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="实际燃尽"
            stroke="#EF4444"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#EF4444", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#EF4444", stroke: "#fff", strokeWidth: 2 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
