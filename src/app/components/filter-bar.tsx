"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Project } from "@/lib/gantt-data"

interface FilterBarProps {
  projects: Project[]
  statusFilter: string
  assigneeFilter: string
  sortBy: string
  onStatusFilter: (v: string) => void
  onAssigneeFilter: (v: string) => void
  onSortBy: (v: string) => void
}

export function FilterBar({
  projects,
  statusFilter,
  assigneeFilter,
  sortBy,
  onStatusFilter,
  onAssigneeFilter,
  onSortBy,
}: FilterBarProps) {
  const uniqueAssignees = Array.from(new Set(projects.map((p) => p.assignee))).sort()

  return (
    <div className="flex items-center gap-2">
      <Select value={statusFilter} onValueChange={onStatusFilter}>
        <SelectTrigger className="h-8 w-[130px] text-xs bg-card border-border">
          <SelectValue placeholder="状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="on-track">正常</SelectItem>
          <SelectItem value="at-risk">有风险</SelectItem>
          <SelectItem value="off-track">已脱轨</SelectItem>
        </SelectContent>
      </Select>

      <Select value={assigneeFilter} onValueChange={onAssigneeFilter}>
        <SelectTrigger className="h-8 w-[140px] text-xs bg-card border-border">
          <SelectValue placeholder="负责人" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部负责人</SelectItem>
          {uniqueAssignees.map((a) => (
            <SelectItem key={a} value={a}>{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortBy}>
        <SelectTrigger className="h-8 w-[130px] text-xs bg-card border-border">
          <SelectValue placeholder="排序" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">名称</SelectItem>
          <SelectItem value="deadline">截止日期</SelectItem>
          <SelectItem value="progress">进度</SelectItem>
          <SelectItem value="status">状态</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
