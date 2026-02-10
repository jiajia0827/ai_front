"use client"

import { Download, Target, ListChecks, Bug, Users } from "lucide-react"

const sprintData = [
  {
    icon: Target,
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#EF4444]",
    value: "68",
    label: "故事点数",
    change: "已完成 42 点",
    changeColor: "text-[#10B981]",
  },
  {
    icon: ListChecks,
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#F59E0B]",
    value: "24",
    label: "总任务数",
    change: "16 已完成, 5 进行中",
    changeColor: "text-[#10B981]",
  },
  {
    icon: Bug,
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#10B981]",
    value: "7",
    label: "待修复缺陷",
    change: "较上个 Sprint -3",
    changeColor: "text-[#10B981]",
  },
  {
    icon: Users,
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#3B82F6]",
    value: "6",
    label: "团队成员",
    change: "100% 可用",
    changeColor: "text-[#10B981]",
  },
]

export function TodaysSales() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-card-foreground">冲刺概览</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted text-card-foreground" type="button">
          <Download className="h-4 w-4" />
          导出
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-5">Sprint 14 数据摘要</p>

      <div className="grid grid-cols-4 gap-4">
        {sprintData.map((item) => (
          <div key={item.label} className="rounded-xl p-4 bg-secondary">
            <div className={`h-10 w-10 rounded-full ${item.iconBg} flex items-center justify-center mb-3`}>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-card-foreground">{item.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
            <p className={`text-xs mt-1 ${item.changeColor}`}>{item.change}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
