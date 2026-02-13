"use client"

import { useState } from "react"
import {
  ExternalLink,
  Calendar,
  AlertTriangle,
  OctagonAlert,
  Clock,
  Rocket,
  Shield,
  RefreshCw,
  Users,
  Copy,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { VelocitySparkline } from "@/app/components/velocity-sparkline"
import type { Project } from "@/lib/project-data"

/* ── Status helpers ── */

function getHealthLabel(h: string) {
  return h === "offtrack" ? "脱轨" : h === "at-risk" ? "有风险" : "正常"
}

function getHealthBadge(h: string) {
  return h === "offtrack"
    ? "bg-red-50 text-red-500 border border-red-200"
    : h === "at-risk"
      ? "bg-amber-50 text-amber-600 border border-amber-200"
      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
}

function getProgressColor(h: string) {
  return h === "offtrack"
    ? "bg-red-500"
    : h === "at-risk"
      ? "bg-amber-500"
      : "bg-emerald-500"
}

/* ── Quality: independent blue / purple / gray ── */

function getQualityBadge(q: string) {
  return q === "A"
    ? "bg-blue-600 text-blue-50"
    : q === "B"
      ? "bg-violet-500 text-violet-50"
      : "bg-slate-500 text-slate-50"
}

function getQualityDesc(q: string) {
  return q === "A"
    ? "A = 代码覆盖率 > 90%, Bug率 < 1%"
    : q === "B"
      ? "B = 代码覆盖率 70-90%, Bug率 1-3%"
      : "C = 代码覆盖率 < 70%, Bug率 > 3%"
}

/* ── Issue count color ── */

function getIssueColor(count: number) {
  if (count === 0) return "text-emerald-600"
  if (count <= 5) return "text-amber-600"
  return "text-red-600"
}

/* ── Alert icon ── */

function AlertIcon({ alert }: { alert: string }) {
  if (alert.includes("阻塞"))
    return <OctagonAlert className="h-3 w-3 shrink-0 text-red-600" />
  if (alert.includes("滞后"))
    return <Clock className="h-3 w-3 shrink-0 text-amber-600" />
  return <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600" />
}

/* ── Avatar colors ── */

const avatarColors = [
  "bg-amber-400",
  "bg-blue-400",
  "bg-emerald-400",
  "bg-rose-400",
  "bg-violet-400",
  "bg-cyan-400",
  "bg-orange-400",
  "bg-indigo-400",
]

/* ── Card ── */

export function ProjectCard({ project }: { project: Project }) {
  const [alertsExpanded, setAlertsExpanded] = useState(false)
  const visibleMembers = project.members.slice(0, 3)
  const extraCount = project.members.length - 3

  const velocityTrend =
    project.velocityHistory.length >= 2
      ? project.velocityHistory[project.velocityHistory.length - 1] -
        project.velocityHistory[0]
      : 0

  return (
    <TooltipProvider delayDuration={200}>
      <div className="group flex flex-col rounded-xl bg-card border border-border/50 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-[hsl(var(--primary))]/30 hover:-translate-y-0.5">
        <div className="flex flex-col gap-3.5 p-5">

          {/* ── Row 1: Name + edit + badge  (Image 1 layout) ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-foreground">{project.name}</h3>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              {project.isMyResponsibility && (
                <span className="text-[10px] font-medium text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 px-2 py-0.5 rounded-full">
                  {"我负责"}
                </span>
              )}
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${getHealthBadge(project.health)}`}
              >
                {getHealthLabel(project.health)}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="刷新项目数据"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">刷新项目数据</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ── Row 2: Progress bar with story points ── */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {project.completedStories}/{project.totalStories}{" "}
                <span className="text-xs font-normal text-muted-foreground">故事点</span>
              </span>
              <span className="text-sm font-semibold text-foreground">{project.progress}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor(project.health)}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* ── Row 3: Risk alerts (prominent, before metrics) ── */}
          {project.alerts.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setAlertsExpanded(!alertsExpanded)}
                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors w-fit"
              >
                <AlertTriangle className="h-3 w-3" />
                <span>{project.alerts.length} 个风险</span>
                {alertsExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              <div className="flex flex-wrap gap-1.5">
                {(alertsExpanded ? project.alerts : project.alerts.slice(0, 2)).map(
                  (alert, idx) => (
                    <Popover key={idx}>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md px-2 py-0.5 hover:bg-red-100 transition-colors cursor-pointer">
                          <AlertIcon alert={alert} />
                          {alert}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-3" side="top">
                        <p className="text-xs font-semibold text-foreground mb-1">风险详情</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.includes("阻塞")
                            ? "存在阻塞问题，需要团队协调解决依赖项，建议立即排查。"
                            : alert.includes("滞后")
                              ? `当前迭代进度落后于计划，${alert}，需加快交付节奏或调整范围。`
                              : "存在质量风险，建议增加代码审查和测试覆盖。"}
                        </p>
                      </PopoverContent>
                    </Popover>
                  )
                )}
              </div>
            </div>
          )}

          {/* ── Row 4: Velocity + Sparkline + Quality ── */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Rocket className="h-4 w-4 text-[hsl(var(--primary))] shrink-0" />
              <span className="text-sm font-semibold text-foreground">{project.velocity}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                故事点/迭代
              </span>
              {velocityTrend !== 0 && (
                velocityTrend > 0
                  ? <TrendingUp className="h-3 w-3 text-emerald-600" />
                  : <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <VelocitySparkline data={project.velocityHistory} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">
                    {"近3次迭代速度: "}{project.velocityHistory.join(" / ")} 故事点
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 shrink-0 cursor-help">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${getQualityBadge(project.quality)}`}>
                    {project.quality}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{getQualityDesc(project.quality)}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* ── Row 5: Date + iteration  (Image 1 red calendar style) ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-semibold text-red-500">
                {project.sprintEndDate}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {"第 "}{project.currentSprint}/{project.totalSprints}{" 迭代"}
              {" | "}{project.sprintWeeks}周/迭代
            </span>
          </div>

          {/* ── Row 6: Avatars + issues  (Image 1 bottom row) ── */}
          <div className="flex items-center justify-between">
            {/* Avatars with hover tooltips */}
            <div className="flex items-center">
              {visibleMembers.map((member, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex items-center justify-center h-8 w-8 rounded-full border-2 border-card text-[10px] font-bold text-card ${avatarColors[idx % avatarColors.length]} ${idx > 0 ? "-ml-2" : ""} hover:ring-2 hover:ring-[hsl(var(--primary))]/40 hover:z-10 transition-all cursor-pointer`}
                      aria-label={`${member.name} - ${member.role}`}
                    >
                      {member.initials}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs font-medium">{member.name}</p>
                    <p className="text-[11px] text-muted-foreground">{member.role}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {extraCount > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="-ml-2 flex items-center justify-center h-8 w-8 rounded-full border-2 border-card bg-red-500 text-[10px] font-bold text-card hover:ring-2 hover:ring-[hsl(var(--primary))]/40 hover:z-10 transition-all cursor-pointer">
                      +{extraCount}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3" side="top">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1 mb-2">
                      <Users className="h-3 w-3" />
                      {"全部成员 ("}{project.members.length}{")"}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {project.members.map((m, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-card ${avatarColors[i % avatarColors.length]}`}
                          >
                            {m.initials}
                          </div>
                          <span className="text-xs text-foreground">{m.name}</span>
                          <span className="text-[10px] text-muted-foreground ml-auto">{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Issue count (Image 1 style but colored by severity) */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 text-muted-foreground hover:opacity-80 transition-colors cursor-pointer">
                  <Copy className="h-3.5 w-3.5" />
                  <span className={`text-xs font-medium ${getIssueColor(project.issueCount)}`}>
                    {project.issueCount} issues
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-3" side="top">
                <p className="text-xs font-semibold text-foreground mb-1">问题概览</p>
                <p className="text-xs text-muted-foreground">
                  {"当前共 "}{project.issueCount}{" 个待处理问题"}
                  {project.issueCount > 10
                    ? "，数量偏多，建议优先处理。"
                    : project.issueCount > 0
                      ? "，在可控范围内。"
                      : "，运行正常。"}
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
