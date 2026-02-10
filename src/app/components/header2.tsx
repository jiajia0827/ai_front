"use client"

import { Search, Bell, ChevronDown, LayoutDashboard } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-[#4F46E5]" />
        <h1 className="text-2xl font-bold text-foreground">敏捷看板</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索任务、用户故事..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-card text-foreground text-sm w-72 border border-border focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EEF2FF]">
            <span className="text-xs font-semibold text-[#4F46E5]">Sprint 14</span>
            <span className="text-xs text-muted-foreground">第 7/14 天</span>
          </div>

          <button className="relative p-2 rounded-lg hover:bg-muted" type="button">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#EF4444] rounded-full" />
          </button>

          <div className="flex items-center gap-3 cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-semibold text-sm">
              SM
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Scrum Master</p>
              <p className="text-xs text-muted-foreground">产品研发团队</p>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}
