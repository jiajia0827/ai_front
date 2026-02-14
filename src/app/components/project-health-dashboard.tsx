"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { ProjectHealth } from "./health-ring-chart"
import { ProjectLegend } from "./project-legend.tsx"
import { HealthTooltip } from "./health-tooltip"

const PROJECT_DATA: ProjectHealth[] = [
  { name: "认证服务", health: 92, color: "#B4E4CE", sprint: "迭代 14", velocity: 42 },
  { name: "支付网关", health: 78, color: "#C5B9E8", sprint: "迭代 12", velocity: 35 },
  { name: "用户门户", health: 65, color: "#F5C6D6", sprint: "迭代 10", velocity: 28 },
  { name: "数据管道", health: 88, color: "#A8D8EA", sprint: "迭代 8", velocity: 38 },
  { name: "移动应用", health: 45, color: "#FFE5B4", sprint: "迭代 6", velocity: 20 },
  { name: "管理后台", health: 95, color: "#B8E6E6", sprint: "迭代 15", velocity: 45 },
  { name: "API 网关", health: 72, color: "#F5D5C8", sprint: "迭代 11", velocity: 30 },
  { name: "机器学习", health: 55, color: "#E0D4F7", sprint: "迭代 9", velocity: 25 },
]

export function ProjectHealthDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [canvasSize, setCanvasSize] = useState(340)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setCanvasSize(Math.min(width - 32, 380))
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    let start: number | null = null
    let frame: number

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / 1400, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimationProgress(eased)
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const size = canvasSize
  const center = size / 2
  const maxRadius = size / 2 - 24
  const minRadius = size * 0.09
  const ringGap = (maxRadius - minRadius) / PROJECT_DATA.length

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, size, size)

    // Draw guide circles
    for (let i = 0; i < PROJECT_DATA.length; i++) {
      const radius = minRadius + ringGap * (i + 0.5)
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(210, 215, 230, 0.35)"
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw reference lines at 25%, 50%, 75%, 100%
    const refAngles = [0.25, 0.5, 0.75, 1.0]
    refAngles.forEach((pct) => {
      const angle = -Math.PI / 2 + Math.PI * 2 * pct
      ctx.beginPath()
      ctx.moveTo(
        center + Math.cos(angle) * (minRadius - 5),
        center + Math.sin(angle) * (minRadius - 5)
      )
      ctx.lineTo(
        center + Math.cos(angle) * (maxRadius + 8),
        center + Math.sin(angle) * (maxRadius + 8)
      )
      ctx.strokeStyle = "rgba(210, 215, 230, 0.2)"
      ctx.lineWidth = 1
      ctx.setLineDash([2, 4])
      ctx.stroke()
      ctx.setLineDash([])

      // Percentage labels
      if (animationProgress > 0.5) {
        const labelRadius = maxRadius + 16
        const labelX = center + Math.cos(angle) * labelRadius
        const labelY = center + Math.sin(angle) * labelRadius
        ctx.font = "9px Inter, sans-serif"
        ctx.fillStyle = "rgba(160, 170, 195, 0.75)"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${pct * 100}%`, labelX, labelY)
      }
    })

    // Draw project arcs
    PROJECT_DATA.forEach((project, i) => {
      const radius = minRadius + ringGap * (i + 0.5)
      const startAngle = -Math.PI / 2
      const healthFraction = (project.health / 100) * animationProgress
      const endAngle = startAngle + Math.PI * 2 * healthFraction
      const lineWidth = Math.max(ringGap * 0.5, 3.5)

      // Glow on hover
      if (hoveredIndex === i) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(center, center, radius, startAngle, endAngle)
        ctx.strokeStyle = project.color + "30"
        ctx.lineWidth = lineWidth + 10
        ctx.lineCap = "round"
        ctx.stroke()
        ctx.restore()
      }

      // Background track
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.strokeStyle = project.color + "0D"
      ctx.lineWidth = lineWidth
      ctx.stroke()

      // Main arc
      ctx.beginPath()
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.strokeStyle = project.color
      ctx.lineWidth = hoveredIndex === i ? lineWidth + 2 : lineWidth
      ctx.lineCap = "round"
      ctx.globalAlpha = hoveredIndex !== null && hoveredIndex !== i ? 0.2 : 1
      ctx.stroke()
      ctx.globalAlpha = 1

      // End dot
      if (animationProgress > 0.05) {
        const dotX = center + Math.cos(endAngle) * radius
        const dotY = center + Math.sin(endAngle) * radius
        ctx.beginPath()
        ctx.arc(dotX, dotY, hoveredIndex === i ? 4.5 : 3, 0, Math.PI * 2)
        ctx.fillStyle = project.color
        ctx.globalAlpha = hoveredIndex !== null && hoveredIndex !== i ? 0.2 : 1
        ctx.fill()
        ctx.globalAlpha = 1
      }
    })

    // Center info
    const avgHealth = Math.round(
      PROJECT_DATA.reduce((acc, p) => acc + p.health, 0) / PROJECT_DATA.length
    )

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw center circle bg
    ctx.beginPath()
    ctx.arc(center, center, minRadius - 2, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255,255,255,0.92)"
    ctx.fill()

    ctx.font = "bold 20px Inter, sans-serif"
    ctx.fillStyle = "#3B3F5C"
    ctx.fillText(`${Math.round(avgHealth * animationProgress)}%`, center, center - 6)

    ctx.font = "10px Inter, sans-serif"
    ctx.fillStyle = "#9BA3BF"
    ctx.fillText("平均健康度", center, center + 10)
  }, [size, center, maxRadius, minRadius, ringGap, hoveredIndex, animationProgress])

  useEffect(() => {
    drawChart()
  }, [drawChart])

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = size / rect.width
    const scaleY = size / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const dx = x - center
    const dy = y - center
    const dist = Math.sqrt(dx * dx + dy * dy)

    let found = -1
    for (let i = 0; i < PROJECT_DATA.length; i++) {
      const radius = minRadius + ringGap * (i + 0.5)
      const tolerance = ringGap * 0.45
      if (Math.abs(dist - radius) < tolerance) {
        let angle = Math.atan2(dy, dx)
        const startAngle = -Math.PI / 2
        if (angle < startAngle) angle += Math.PI * 2
        const healthAngle = startAngle + Math.PI * 2 * (PROJECT_DATA[i].health / 100)
        if (angle >= startAngle && angle <= healthAngle) {
          found = i
          break
        }
      }
    }
    setHoveredIndex(found >= 0 ? found : null)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] mx-auto rounded-3xl bg-card shadow-[0_8px_60px_rgba(120,130,180,0.08)] border border-border/30 overflow-hidden"
    >
      {/* Top gradient accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#B4E4CE] via-[#C5B9E8] to-[#F5C6D6]" />

      <div className="px-6 pt-6 pb-2">
        <h2 className="text-base font-bold text-foreground tracking-tight text-balance">
          项目健康度分布
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {PROJECT_DATA.length} 个活跃项目 - 全部迭代周期
        </p>
      </div>

      {/* Tooltip */}
      <HealthTooltip
        project={hoveredIndex !== null ? PROJECT_DATA[hoveredIndex] : null}
      />

      {/* Chart Area */}
      <div className="flex items-center justify-center py-4 px-4">
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="cursor-pointer"
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      </div>

      {/* Legend */}
      <div className="px-5 pb-6">
        <ProjectLegend
          projects={PROJECT_DATA}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
        />
      </div>
    </div>
  )
}
