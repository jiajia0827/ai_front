"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { Plus, ArrowLeft } from "lucide-react"
import { projects as initialProjects } from "@/lib/gantt-data"
import type { Project, ProjectStatus } from "@/lib/gantt-data"
import { ProjectList } from "@/app/components/project-list"
import { Timeline } from "@/app/components/timeline2"
import { FilterBar } from "@/app/components/filter-bar"
import { cn } from "@/lib/utils"

const ROW_HEIGHT = 44
const DAY_WIDTH = 14
const LEFT_PANEL_WIDTH = 320

interface GanttChartProps {
  onBack?: () => void
}

export function GanttChart({ onBack }: GanttChartProps) {
  const [projectData, setProjectData] = useState<Project[]>(initialProjects)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("Schedule")
  const [statusFilter, setStatusFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [scrollLeft, setScrollLeft] = useState(0)

  const timelineScrollRef = useRef<HTMLDivElement>(null)
  const listScrollRef = useRef<HTMLDivElement>(null)

  // Filter and sort
  const filteredProjects = useMemo(() => {
    let result = [...projectData]

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }
    if (assigneeFilter !== "all") {
      result = result.filter((p) => p.assignee === assigneeFilter)
    }

    switch (sortBy) {
      case "deadline":
        result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        break
      case "progress":
        result.sort((a, b) => b.progress - a.progress)
        break
      case "status":
        const statusOrder: Record<ProjectStatus, number> = { "off-track": 0, "at-risk": 1, "on-track": 2 }
        result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
        break
      default:
        result.sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [projectData, statusFilter, assigneeFilter, sortBy])

  // Calculate timeline range
  const timelineRange = useMemo(() => {
    const allDates = projectData.flatMap((p) => [
      new Date(p.startDate),
      new Date(p.endDate),
      new Date(p.deadline),
      ...p.subtasks.flatMap((s) => [new Date(s.startDate), new Date(s.endDate)]),
    ])
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))
    // Add padding
    minDate.setDate(minDate.getDate() - 14)
    maxDate.setDate(maxDate.getDate() + 14)
    // Snap to month start
    minDate.setDate(1)
    return { start: minDate, end: maxDate }
  }, [projectData])

  const toggleExpand = useCallback((id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const handleDragUpdate = useCallback((id: string, newStart: string, newEnd: string) => {
    setProjectData((prev) =>
      prev.map((p) => {
        if (p.id === id) return { ...p, startDate: newStart, endDate: newEnd }
        const updatedSubtasks = p.subtasks.map((s) => {
          if (s.id === id) return { ...s, startDate: newStart, endDate: newEnd }
          return s
        })
        return { ...p, subtasks: updatedSubtasks }
      })
    )
  }, [])

  // Sync scrolling between list and timeline
  const handleTimelineScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollLeft(target.scrollLeft)
    if (listScrollRef.current) {
      listScrollRef.current.scrollTop = target.scrollTop
    }
  }, [])

  const handleListScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollTop = e.currentTarget.scrollTop
    }
  }, [])

  // Scroll to today on mount
  useEffect(() => {
    if (timelineScrollRef.current) {
      const today = new Date()
      const daysBetween = Math.round(
        (today.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24)
      )
      const todayPosition = daysBetween * DAY_WIDTH
      timelineScrollRef.current.scrollLeft = Math.max(0, todayPosition - 300)
    }
  }, [timelineRange.start])

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回</span>
            </button>
          )}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">月份和年份</span>
        </div>
        <FilterBar
          projects={projectData}
          statusFilter={statusFilter}
          assigneeFilter={assigneeFilter}
          sortBy={sortBy}
          onStatusFilter={setStatusFilter}
          onAssigneeFilter={setAssigneeFilter}
          onSortBy={setSortBy}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Project List */}
        <div
          className="flex-shrink-0 border-r border-border bg-card flex flex-col"
          style={{ width: LEFT_PANEL_WIDTH }}
        >
          {/* List header */}
          <div className="flex items-center px-4 border-b border-border bg-card" style={{ height: 64 }}>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">项目</span>
          </div>

          {/* Scrollable list */}
          <div
            ref={listScrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
            onScroll={handleListScroll}
          >
            <ProjectList
              projects={filteredProjects}
              expandedProjects={expandedProjects}
              selectedId={selectedId}
              onToggleExpand={toggleExpand}
              onSelect={handleSelect}
              rowHeight={ROW_HEIGHT}
            />
          </div>
        </div>

        {/* Right Panel: Timeline */}
        <div
          ref={timelineScrollRef}
          className="flex-1 overflow-auto"
          onScroll={handleTimelineScroll}
        >
          <Timeline
            projects={filteredProjects}
            expandedProjects={expandedProjects}
            selectedId={selectedId}
            onSelect={handleSelect}
            timelineStart={timelineRange.start}
            timelineEnd={timelineRange.end}
            dayWidth={DAY_WIDTH}
            rowHeight={ROW_HEIGHT}
            onDragUpdate={handleDragUpdate}
            scrollLeft={scrollLeft}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-2 bg-card border-t border-border">
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#10B981]" />
            <span>正常</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span>有风险</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#EF4444]" />
            <span>已脱轨</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-[#EF4444]" />
            <span>今天</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#F97316]" />
            <span>截止日期</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0 border-t-2 border-dashed border-muted-foreground/40" />
            <span>迭代</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-[#8B5CF6]" />
            <span>设计</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-[#3B82F6]" />
            <span>开发</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-[#06B6D4]" />
            <span>测试</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-[#F59E0B]" />
            <span>营销</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-[#10B981]" />
            <span>规划</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm bg-[#EC4899]" />
            <span>评审</span>
          </div>
        </div>
      </div>
    </div>
  )
}
