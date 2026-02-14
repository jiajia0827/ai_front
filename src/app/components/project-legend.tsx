"use client"

import type { ProjectHealth } from "./health-ring-chart"
import {
  Activity,
  Zap,
  Shield,
  Target,
  Rocket,
  Flame,
  Star,
  TrendingUp,
} from "lucide-react"

const icons = [Activity, Zap, Shield, Target, Rocket, Flame, Star, TrendingUp]

interface ProjectLegendProps {
  projects: ProjectHealth[]
  hoveredIndex: number | null
  onHover: (index: number | null) => void
}

export function ProjectLegend({
  projects,
  hoveredIndex,
  onHover,
}: ProjectLegendProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 w-full">
      {projects.map((project, i) => {
        const Icon = icons[i % icons.length]
        const isHovered = hoveredIndex === i
        const isDimmed = hoveredIndex !== null && hoveredIndex !== i
        return (
          <div
            key={project.name}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: isHovered ? project.color + "14" : "hsl(240 20% 97%)",
              border: isHovered
                ? `1.5px solid ${project.color}35`
                : "1.5px solid transparent",
              transform: isHovered ? "scale(1.03)" : "scale(1)",
              opacity: isDimmed ? 0.4 : 1,
            }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
          >
            <div
              className="flex items-center justify-center rounded-lg w-7 h-7 shrink-0"
              style={{ backgroundColor: project.color + "18" }}
            >
              <Icon size={14} style={{ color: project.color }} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate leading-tight">
                {project.name}
              </span>
              <span
                className="text-[10px] font-medium leading-tight"
                style={{ color: project.color }}
              >
                {project.health}% 健康度
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
