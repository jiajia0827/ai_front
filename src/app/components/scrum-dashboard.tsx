"use client"

import { useState } from "react"
import type { ViewMode } from "@/lib/scrum-data"
import { DailyStandupUpperChart, DailyStandupLowerChart } from "@/app/components/daily-standup-view"
import { SprintPlanningUpperChart, SprintPlanningLowerChart } from "@/app/components/sprint-planning-view"
import { SprintRetroUpperChart, SprintRetroLowerChart } from "@/app/components/sprint-retro-view"
import { CalendarDays, GitCompare, RotateCcw, LayoutDashboard, ArrowLeft } from "lucide-react"

const views: { key: ViewMode; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: "daily",
    label: "当日视图",
    desc: "每日站会",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    key: "planning",
    label: "历史对比",
    desc: "Sprint 规划",
    icon: <GitCompare className="h-4 w-4" />,
  },
  {
    key: "retro",
    label: "复盘视图",
    desc: "Sprint 复盘",
    icon: <RotateCcw className="h-4 w-4" />,
  },
]

export function ScrumDashboard({ onBack }: { onBack?: () => void }) {
  const [activeView, setActiveView] = useState<ViewMode>("daily")

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                  title="返回"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-[hsl(var(--primary-foreground))]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-card-foreground leading-tight">
                  Scrum 敏捷看板
                </h1>
                <p className="text-xs text-muted-foreground">Sprint 24 - 2026/02/09 ~ 02/20</p>
              </div>
            </div>

            {/* View Switcher */}
            <nav className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {views.map((view) => (
                <button
                  key={view.key}
                  onClick={() => setActiveView(view.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeView === view.key
                      ? "bg-card text-card-foreground shadow-sm"
                      : "text-muted-foreground hover:text-card-foreground"
                  }`}
                >
                  {view.icon}
                  <span className="hidden sm:inline">{view.label}</span>
                  <span className="hidden lg:inline text-[10px] opacity-60">
                    ({view.desc})
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor:
                  activeView === "daily"
                    ? "hsl(var(--chart-3))"
                    : activeView === "planning"
                    ? "hsl(var(--chart-1))"
                    : "hsl(var(--chart-2))",
              }}
            />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {activeView === "daily" && "每日站会 / Daily Standup"}
              {activeView === "planning" && "Sprint 规划 / Sprint Planning"}
              {activeView === "retro" && "Sprint 复盘 / Sprint Retrospective"}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {activeView === "daily" &&
              "聚焦当天任务状态与成员负载，标注阻塞与 P0 未完成情况"}
            {activeView === "planning" &&
              "对比往期 Sprint 数据，智能推荐本次 Sprint 容量"}
            {activeView === "retro" &&
              "回顾 P0 完成率趋势、阻塞原因与成员均衡度，输出复盘结论"}
          </p>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Upper Chart */}
          {activeView === "daily" && <DailyStandupUpperChart />}
          {activeView === "planning" && <SprintPlanningUpperChart />}
          {activeView === "retro" && <SprintRetroUpperChart />}

          {/* Lower Chart */}
          {activeView === "daily" && <DailyStandupLowerChart />}
          {activeView === "planning" && <SprintPlanningLowerChart />}
          {activeView === "retro" && <SprintRetroLowerChart />}
        </div>
        </div>
      </main>
    </div>
  )
}
