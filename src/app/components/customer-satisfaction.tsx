"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "第1天", todo: 24, inProgress: 0, done: 0 },
  { day: "第2天", todo: 20, inProgress: 3, done: 1 },
  { day: "第3天", todo: 17, inProgress: 4, done: 3 },
  { day: "第4天", todo: 14, inProgress: 4, done: 6 },
  { day: "第5天", todo: 10, inProgress: 5, done: 9 },
  { day: "第6天", todo: 6, inProgress: 5, done: 13 },
  { day: "第7天", todo: 3, inProgress: 5, done: 16 },
]

const total = 24
const donePercent = Math.round((16 / total) * 100)

export function CustomerSatisfaction() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">冲刺进度</h2>
        <div className="px-2 py-1 rounded-md bg-[#D1FAE5]">
          <span className="text-xs font-semibold text-[#059669]">完成率 {donePercent}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTodo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
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
          <Area type="monotone" dataKey="done" name="已完成" stroke="#10B981" strokeWidth={2.5} fill="url(#colorDone)" dot={false} />
          <Area type="monotone" dataKey="inProgress" name="进行中" stroke="#F59E0B" strokeWidth={2} fill="url(#colorInProgress)" dot={false} />
          <Area type="monotone" dataKey="todo" name="待办" stroke="#EF4444" strokeWidth={2} fill="url(#colorTodo)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-5 mt-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-muted-foreground">待办</span>
          <span className="text-sm font-bold text-card-foreground">3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          <span className="text-xs text-muted-foreground">进行中</span>
          <span className="text-sm font-bold text-card-foreground">5</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#10B981]" />
          <span className="text-xs text-muted-foreground">已完成</span>
          <span className="text-sm font-bold text-card-foreground">16</span>
        </div>
      </div>
    </div>
  )
}
