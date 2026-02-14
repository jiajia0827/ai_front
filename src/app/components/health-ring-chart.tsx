"use client"

import { useEffect, useRef, useState } from "react"

export interface ProjectHealth {
  name: string
  health: number // 0-100
  color: string
  sprint: string
  velocity: number
}

interface HealthRingChartProps {
  projects: ProjectHealth[]
  size?: number
}

export function HealthRingChart({ projects, size = 340 }: HealthRingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  const center = size / 2
  const maxRadius = size / 2 - 20
  const minRadius = 30
  const ringGap = (maxRadius - minRadius) / projects.length

  useEffect(() => {
    let start: number | null = null
    let frame: number

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / 1200, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimationProgress(eased)
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, size, size)

    // Draw guide circles (very light)
    for (let i = 0; i < projects.length; i++) {
      const radius = minRadius + ringGap * (i + 0.5)
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(200, 210, 230, 0.35)"
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw 25%, 50%, 75%, 100% reference lines
    const refAngles = [0.25, 0.5, 0.75, 1.0]
    refAngles.forEach((pct) => {
      const angle = -Math.PI / 2 + Math.PI * 2 * pct
      ctx.beginPath()
      ctx.moveTo(
        center + Math.cos(angle) * minRadius,
        center + Math.sin(angle) * minRadius
      )
      ctx.lineTo(
        center + Math.cos(angle) * (maxRadius + 5),
        center + Math.sin(angle) * (maxRadius + 5)
      )
      ctx.strokeStyle = "rgba(200, 210, 230, 0.2)"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 4])
      ctx.stroke()
      ctx.setLineDash([])
    })

    // Draw project arcs
    projects.forEach((project, i) => {
      const radius = minRadius + ringGap * (i + 0.5)
      const startAngle = -Math.PI / 2
      const healthFraction = (project.health / 100) * animationProgress
      const endAngle = startAngle + Math.PI * 2 * healthFraction
      const lineWidth = Math.max(ringGap * 0.55, 4)

      // Arc glow
      if (hoveredIndex === i) {
        ctx.beginPath()
        ctx.arc(center, center, radius, startAngle, endAngle)
        ctx.strokeStyle = project.color + "30"
        ctx.lineWidth = lineWidth + 8
        ctx.lineCap = "round"
        ctx.stroke()
      }

      // Main arc
      ctx.beginPath()
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.strokeStyle = project.color
      ctx.lineWidth = hoveredIndex === i ? lineWidth + 2 : lineWidth
      ctx.lineCap = "round"
      ctx.globalAlpha = hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1
      ctx.stroke()
      ctx.globalAlpha = 1

      // End dot
      if (animationProgress > 0.1) {
        const dotX = center + Math.cos(endAngle) * radius
        const dotY = center + Math.sin(endAngle) * radius
        ctx.beginPath()
        ctx.arc(dotX, dotY, hoveredIndex === i ? 4 : 3, 0, Math.PI * 2)
        ctx.fillStyle = project.color
        ctx.fill()
      }
    })

    // Center text
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#2d3654"
    ctx.font = "bold 22px Inter, sans-serif"
    const avgHealth = Math.round(
      projects.reduce((acc, p) => acc + p.health, 0) / projects.length
    )
    ctx.fillText(
      `${Math.round(avgHealth * animationProgress)}%`,
      center,
      center - 8
    )
    ctx.font = "11px Inter, sans-serif"
    ctx.fillStyle = "#8892a8"
    ctx.fillText("Avg Health", center, center + 12)
  }, [projects, size, hoveredIndex, animationProgress, center, maxRadius, minRadius, ringGap])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const dx = x - center
    const dy = y - center
    const dist = Math.sqrt(dx * dx + dy * dy)

    let found = -1
    for (let i = 0; i < projects.length; i++) {
      const radius = minRadius + ringGap * (i + 0.5)
      const tolerance = ringGap * 0.4
      if (Math.abs(dist - radius) < tolerance) {
        // Check if within the arc angle
        let angle = Math.atan2(dy, dx)
        if (angle < -Math.PI / 2) angle += Math.PI * 2
        const healthAngle = -Math.PI / 2 + Math.PI * 2 * (projects[i].health / 100)
        const normalizedAngle = angle < -Math.PI / 2 ? angle + Math.PI * 2 : angle
        const normalizedStart = -Math.PI / 2
        if (normalizedAngle >= normalizedStart && normalizedAngle <= healthAngle) {
          found = i
          break
        }
      }
    }
    setHoveredIndex(found >= 0 ? found : null)
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
    />
  )
}
