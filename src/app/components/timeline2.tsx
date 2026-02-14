"use client"

import { useRef, useCallback, useState } from "react"
import type { Project, SubTask } from "@/lib/gantt-data"
import { STATUS_COLORS, TASK_TYPE_COLORS, TASK_TYPE_LABELS, RISK_LABELS } from "@/lib/gantt-data"
import { cn } from "@/lib/utils"

interface TimelineProps {
  projects: Project[]
  expandedProjects: Set<string>
  selectedId: string | null
  onSelect: (id: string) => void
  timelineStart: Date
  timelineEnd: Date
  dayWidth: number
  rowHeight: number
  onDragUpdate: (id: string, newStart: string, newEnd: string) => void
  scrollLeft: number
}

interface TooltipData {
  x: number
  y: number
  project?: Project
  subtask?: SubTask
  parentProject?: Project
}

function formatDate(d: string) {
  const date = new Date(d)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function toDateString(d: Date) {
  return d.toISOString().split("T")[0]
}

export function Timeline({
  projects,
  expandedProjects,
  selectedId,
  onSelect,
  timelineStart,
  timelineEnd,
  dayWidth,
  rowHeight,
  onDragUpdate,
  scrollLeft,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [dragging, setDragging] = useState<{
    id: string
    edge: "start" | "end" | "move"
    startX: number
    originalStart: string
    originalEnd: string
  } | null>(null)

  const totalDays = daysBetween(timelineStart, timelineEnd)
  const totalWidth = totalDays * dayWidth
  const today = new Date()
  const todayOffset = daysBetween(timelineStart, today) * dayWidth

  // Generate month headers
  const months: { label: string; startOffset: number; width: number }[] = []
  const currentMonth = new Date(timelineStart.getFullYear(), timelineStart.getMonth(), 1)
  while (currentMonth <= timelineEnd) {
    const monthStart = new Date(Math.max(currentMonth.getTime(), timelineStart.getTime()))
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    const monthEnd = new Date(Math.min(nextMonth.getTime(), timelineEnd.getTime()))
    const offset = daysBetween(timelineStart, monthStart) * dayWidth
    const width = daysBetween(monthStart, monthEnd) * dayWidth
    months.push({
      label: `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`,
      startOffset: offset,
      width,
    })
    currentMonth.setMonth(currentMonth.getMonth() + 1)
  }

  // Generate week headers
  const weeks: { label: string; startOffset: number; width: number }[] = []
  const weekStart = new Date(timelineStart)
  const dayOfWeek = weekStart.getDay()
  if (dayOfWeek !== 1) {
    weekStart.setDate(weekStart.getDate() + ((8 - dayOfWeek) % 7))
  }
  let weekCount = 1
  let lastMonth = weekStart.getMonth()
  while (weekStart <= timelineEnd) {
    if (weekStart.getMonth() !== lastMonth) {
      weekCount = 1
      lastMonth = weekStart.getMonth()
    }
    const offset = daysBetween(timelineStart, weekStart) * dayWidth
    weeks.push({
      label: `${weekCount}周`,
      startOffset: offset,
      width: 7 * dayWidth,
    })
    weekCount++
    weekStart.setDate(weekStart.getDate() + 7)
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, id: string, edge: "start" | "end" | "move", startDate: string, endDate: string) => {
      e.stopPropagation()
      e.preventDefault()
      setDragging({
        id,
        edge,
        startX: e.clientX,
        originalStart: startDate,
        originalEnd: endDate,
      })
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return
      const dx = e.clientX - dragging.startX
      const daysDelta = Math.round(dx / dayWidth)
      if (daysDelta === 0) return

      const origStart = new Date(dragging.originalStart)
      const origEnd = new Date(dragging.originalEnd)

      let newStart = origStart
      let newEnd = origEnd

      if (dragging.edge === "move") {
        newStart = new Date(origStart.getTime() + daysDelta * 86400000)
        newEnd = new Date(origEnd.getTime() + daysDelta * 86400000)
      } else if (dragging.edge === "start") {
        newStart = new Date(origStart.getTime() + daysDelta * 86400000)
        if (newStart >= origEnd) return
      } else {
        newEnd = new Date(origEnd.getTime() + daysDelta * 86400000)
        if (newEnd <= origStart) return
      }

      onDragUpdate(dragging.id, toDateString(newStart), toDateString(newEnd))
    },
    [dragging, dayWidth, onDragUpdate]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const renderBar = (
    id: string,
    startDate: string,
    endDate: string,
    color: string,
    progress: number,
    label?: string,
    isSubtask?: boolean
  ) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const left = daysBetween(timelineStart, start) * dayWidth
    const width = Math.max(daysBetween(start, end) * dayWidth, 20)
    const barHeight = isSubtask ? 12 : 16
    const isSelected = selectedId === id

    return (
      <div
        key={id}
        className={cn(
          "absolute rounded-full cursor-pointer transition-shadow group/bar",
          isSelected && "ring-2 ring-ring ring-offset-1"
        )}
        style={{
          left,
          width,
          height: barHeight,
          top: `calc(50% - ${barHeight / 2}px)`,
          backgroundColor: `${color}30`,
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(id)
        }}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const containerRect = containerRef.current?.getBoundingClientRect()
          if (containerRect) {
            let proj: Project | undefined
            let sub: SubTask | undefined
            for (const p of projects) {
              if (p.id === id) { proj = p; break }
              for (const s of p.subtasks) {
                if (s.id === id) { sub = s; proj = p; break }
              }
              if (sub) break
            }
            setTooltip({
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top - 8,
              project: sub ? undefined : proj,
              subtask: sub,
              parentProject: sub ? proj : undefined,
            })
          }
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Progress fill */}
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />

        {/* Drag handles */}
        <div
          className="absolute left-0 top-0 w-2 h-full cursor-w-resize opacity-0 group-hover/bar:opacity-100"
          onMouseDown={(e) => handleMouseDown(e, id, "start", startDate, endDate)}
        />
        <div
          className="absolute right-0 top-0 w-2 h-full cursor-e-resize opacity-0 group-hover/bar:opacity-100"
          onMouseDown={(e) => handleMouseDown(e, id, "end", startDate, endDate)}
        />
        {/* Center drag area */}
        <div
          className="absolute inset-x-2 top-0 h-full cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleMouseDown(e, id, "move", startDate, endDate)}
        />

        {/* Label for subtasks */}
        {label && (
          <span
            className="absolute left-full ml-1.5 top-1/2 -translate-y-1/2 text-[9px] font-semibold whitespace-nowrap pointer-events-none"
            style={{ color }}
          >
            {label}
          </span>
        )}
      </div>
    )
  }

  // Collect all rows
  const rows: React.ReactNode[] = []
  projects.forEach((project) => {
    const isExpanded = expandedProjects.has(project.id)
    const color = STATUS_COLORS[project.status]

    // Project bar
    rows.push(
      <div
        key={project.id}
        className="relative border-b border-border"
        style={{ height: rowHeight }}
      >
        {renderBar(project.id, project.startDate, project.endDate, color, project.progress)}

        {/* Deadline marker (orange dot) */}
        {(() => {
          const deadlineOffset = daysBetween(timelineStart, new Date(project.deadline)) * dayWidth
          return (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card z-10"
              style={{
                left: deadlineOffset - 6,
                backgroundColor: "#F97316",
              }}
              title={`截止日: ${formatDate(project.deadline)}`}
            />
          )
        })()}

        {/* Iteration node (dashed line) */}
        {(() => {
          const iterOffset = daysBetween(timelineStart, new Date(project.iterationDate)) * dayWidth
          return (
            <div
              className="absolute top-0 h-full border-l-2 border-dashed border-muted-foreground/30 z-[5]"
              style={{ left: iterOffset }}
              title={`${project.iteration}: ${formatDate(project.iterationDate)}`}
            />
          )
        })()}
      </div>
    )

    // Subtask bars
    if (isExpanded) {
      project.subtasks.forEach((subtask) => {
        const stColor = TASK_TYPE_COLORS[subtask.type]
        rows.push(
          <div
            key={subtask.id}
            className="relative border-b border-border/50"
            style={{ height: rowHeight }}
          >
            {renderBar(
              subtask.id,
              subtask.startDate,
              subtask.endDate,
              stColor,
              subtask.progress,
              subtask.assigneeInitials,
              true
            )}
          </div>
        )
      })
    }
  })

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ width: totalWidth, minHeight: "100%" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Month headers */}
      <div className="sticky top-0 z-20 relative border-b border-border bg-card" style={{ height: 36, width: totalWidth }}>
        {months.map((m, i) => (
          <div
            key={i}
            className="absolute flex items-center px-3 text-xs font-semibold text-foreground border-r border-border bg-card top-0 h-full"
            style={{ width: m.width, left: m.startOffset }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Week headers */}
      <div className="sticky top-[36px] z-20 relative border-b border-border bg-card" style={{ height: 28, width: totalWidth }}>
        {weeks.map((w, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center text-[11px] text-muted-foreground border-r border-border/50 top-0 h-full"
            style={{ width: w.width, left: w.startOffset }}
          >
            {w.label}
          </div>
        ))}
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0" style={{ top: 64 }}>
        {weeks.map((w, i) => (
          <div
            key={i}
            className="absolute top-0 h-full border-r border-border/30"
            style={{ left: w.startOffset }}
          />
        ))}
      </div>

      {/* Today line (red) */}
      {todayOffset > 0 && todayOffset < totalWidth && (
        <div
          className="absolute z-30 w-0.5"
          style={{
            left: todayOffset,
            top: 0,
            height: "100%",
            backgroundColor: "#EF4444",
          }}
        >
          <div className="absolute -top-0 -left-2 w-4 h-4 rounded-full bg-[#EF4444] border-2 border-card" style={{ top: 56 }} />
        </div>
      )}

      {/* Rows */}
      <div style={{ paddingTop: 64 }}>{rows}</div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none bg-card border border-border rounded-lg shadow-lg px-3 py-2 min-w-[200px]"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.project && (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">{tooltip.project.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(tooltip.project.startDate)} - {formatDate(tooltip.project.endDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">故事点: <span className="text-foreground font-medium">{tooltip.project.storyPoints}</span></span>
                <span className="text-muted-foreground">问题数: <span className="text-foreground font-medium">{tooltip.project.issues}</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">风险:</span>
                <span className={cn(
                  "font-medium",
                  tooltip.project.risk === "high" && "text-[#EF4444]",
                  tooltip.project.risk === "medium" && "text-[#F59E0B]",
                  tooltip.project.risk === "low" && "text-[#10B981]"
                )}>
                  {RISK_LABELS[tooltip.project.risk]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">进度:</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${tooltip.project.progress}%`,
                      backgroundColor: STATUS_COLORS[tooltip.project.status],
                    }}
                  />
                </div>
                <span className="text-foreground font-medium">{tooltip.project.progress}%</span>
              </div>
            </div>
          )}
          {tooltip.subtask && tooltip.parentProject && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">{tooltip.parentProject.name}</p>
              <p className="text-sm font-semibold text-foreground">{tooltip.subtask.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(tooltip.subtask.startDate)} - {formatDate(tooltip.subtask.endDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">负责人:</span>
                <span className="text-foreground font-medium">{tooltip.subtask.assignee}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">类型:</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    backgroundColor: TASK_TYPE_COLORS[tooltip.subtask.type] + "20",
                    color: TASK_TYPE_COLORS[tooltip.subtask.type],
                  }}
                >
                  {TASK_TYPE_LABELS[tooltip.subtask.type]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">进度:</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${tooltip.subtask.progress}%`,
                      backgroundColor: TASK_TYPE_COLORS[tooltip.subtask.type],
                    }}
                  />
                </div>
                <span className="text-foreground font-medium">{tooltip.subtask.progress}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
