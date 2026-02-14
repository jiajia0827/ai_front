"use client"

import type { ProjectHealth } from "./health-ring-chart"

interface HealthTooltipProps {
  project: ProjectHealth | null
}

export function HealthTooltip({ project }: HealthTooltipProps) {
  if (!project) return null

  const getHealthLabel = (health: number) => {
    if (health >= 80) return "优秀"
    if (health >= 60) return "良好"
    if (health >= 40) return "有风险"
    return "危险"
  }

  return (
    <div
      className="absolute top-4 right-4 rounded-2xl px-4 py-3 shadow-[0_4px_24px_rgba(120,130,180,0.12)] border border-border/30 backdrop-blur-sm z-10 min-w-[180px]"
      style={{
        backgroundColor: "hsla(0, 0%, 100%, 0.96)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <span className="text-sm font-bold text-foreground">{project.name}</span>
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>健康度</span>
          <span className="font-semibold" style={{ color: project.color }}>
            {project.health}% - {getHealthLabel(project.health)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>迭代</span>
          <span className="font-medium text-foreground">{project.sprint}</span>
        </div>
        <div className="flex justify-between">
          <span>速率</span>
          <span className="font-medium text-foreground">{project.velocity} 点</span>
        </div>
      </div>
    </div>
  )
}
