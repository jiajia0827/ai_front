"use client"

import { ChevronDown, ChevronRight, AlertTriangle, AlertCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project, ProjectStatus } from "../../lib/gantt-data"
import { STATUS_COLORS, STATUS_LABELS, TASK_TYPE_COLORS } from "../../lib/gantt-data"

interface ProjectListProps {
  projects: Project[]
  expandedProjects: Set<string>
  selectedId: string | null
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
  rowHeight: number
}

function RiskIcon({ risk }: { risk: "low" | "medium" | "high" }) {
  if (risk === "high") return <AlertCircle className="h-3.5 w-3.5 text-[#EF4444]" />
  if (risk === "medium") return <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
  return <Shield className="h-3.5 w-3.5 text-[#10B981]" />
}

function StatusDot({ status }: { status: ProjectStatus }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: STATUS_COLORS[status] }}
      title={STATUS_LABELS[status]}
    />
  )
}

export function ProjectList({
  projects,
  expandedProjects,
  selectedId,
  onToggleExpand,
  onSelect,
  rowHeight,
}: ProjectListProps) {
  return (
    <div className="flex flex-col">
      {projects.map((project) => {
        const isExpanded = expandedProjects.has(project.id)
        const isSelected = selectedId === project.id

        return (
          <div key={project.id}>
            {/* Project Row */}
            <div
              className={cn(
                "flex items-center gap-2 px-4 border-b border-border cursor-pointer transition-colors hover:bg-accent/50",
                isSelected && "bg-primary/5"
              )}
              style={{ height: rowHeight }}
              onClick={() => onSelect(project.id)}
            >
              {/* Expand Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand(project.id)
                }}
                className="flex-shrink-0 p-0.5 rounded hover:bg-accent transition-colors text-muted-foreground"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Project Icon */}
              <div
                className="flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: project.iconColor + "20",
                  color: project.iconColor,
                }}
              >
                {project.icon}
              </div>

              {/* Project Name */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {project.name}
                </span>
                <StatusDot status={project.status} />
              </div>

              {/* Avatar */}
              <div
                className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                style={{
                  backgroundColor: project.iconColor + "25",
                  color: project.iconColor,
                }}
                title={project.assignee}
              >
                {project.assigneeInitials}
              </div>

              {/* Progress */}
              <div className="flex-shrink-0 w-10 text-right">
                <span className="text-xs text-muted-foreground font-medium">
                  {project.progress}%
                </span>
              </div>

              {/* Risk Icon */}
              <div className="flex-shrink-0">
                <RiskIcon risk={project.risk} />
              </div>
            </div>

            {/* Subtask Rows */}
            {isExpanded &&
              project.subtasks.map((subtask, idx) => {
                const isSubSelected = selectedId === subtask.id
                return (
                  <div
                    key={subtask.id}
                    className={cn(
                      "flex items-center gap-2 pl-12 pr-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-accent/30",
                      isSubSelected && "bg-primary/5"
                    )}
                    style={{ height: rowHeight }}
                    onClick={() => onSelect(subtask.id)}
                  >
                    {/* Number Badge */}
                    <div
                      className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: TASK_TYPE_COLORS[subtask.type],
                        color: "#fff",
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* Subtask Name */}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground truncate block">
                        {subtask.name}
                      </span>
                    </div>

                    {/* Assignee */}
                    <div
                      className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-semibold bg-muted text-muted-foreground"
                      title={subtask.assignee}
                    >
                      {subtask.assigneeInitials}
                    </div>

                    {/* Progress */}
                    <div className="flex-shrink-0 w-10 text-right">
                      <span className="text-[11px] text-muted-foreground">
                        {subtask.progress}%
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
