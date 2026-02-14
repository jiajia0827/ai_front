"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface DataPoint {
  month: string
  project: string
  value: number
}

const PROJECTS = [
  { name: "智能客服", color: "#E8952F" },
  { name: "数据平台", color: "#1A9A6F" },
  { name: "移动商城", color: "#D4573B" },
  { name: "内部工具", color: "#C77DBA" },
  { name: "AI助手", color: "#1B4F9B" },
]

const MONTHS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
]

const DATA: DataPoint[] = [
  { month: "1月", project: "智能客服", value: 45 },
  { month: "2月", project: "智能客服", value: 88 },
  { month: "3月", project: "数据平台", value: 92 },
  { month: "3月", project: "智能客服", value: 55 },
  { month: "4月", project: "数据平台", value: 130 },
  { month: "4月", project: "移动商城", value: 95 },
  { month: "5月", project: "数据平台", value: 87 },
  { month: "5月", project: "移动商城", value: 104 },
  { month: "6月", project: "移动商城", value: 93 },
  { month: "6月", project: "智能客服", value: 130 },
  { month: "7月", project: "移动商城", value: 140 },
  { month: "7月", project: "内部工具", value: 118 },
  { month: "8月", project: "内部工具", value: 132 },
  { month: "8月", project: "移动商城", value: 100 },
  { month: "9月", project: "内部工具", value: 135 },
  { month: "9月", project: "AI助手", value: 90 },
  { month: "10月", project: "AI助手", value: 108 },
  { month: "10月", project: "内部工具", value: 143 },
  { month: "11月", project: "AI助手", value: 130 },
  { month: "11月", project: "数据平台", value: 145 },
  { month: "12月", project: "AI助手", value: 148 },
  { month: "12月", project: "数据平台", value: 128 },
]

// Easing
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function easeOutBack(t: number) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

export default function IterationSpeedChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    data: DataPoint
    color: string
  } | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const animProgress = useRef(0)
  const animStartTime = useRef<number | null>(null)
  const rafId = useRef(0)
  const isVisible = useRef(false)
  const dotPulsePhase = useRef(0)

  // Layout constants
  const PADDING = { top: 40, right: 30, bottom: 70, left: 55 }
  const Y_MAX = 160
  const Y_STEP = 25
  const DOT_RADIUS = 7
  const ANIM_DURATION = 1200

  const getProjectColor = useCallback((projectName: string) => {
    return PROJECTS.find((p) => p.name === projectName)?.color ?? "#999"
  }, [])

  const getLayout = useCallback(
    (width: number, height: number) => {
      const chartW = width - PADDING.left - PADDING.right
      const chartH = height - PADDING.top - PADDING.bottom
      return { chartW, chartH }
    },
    [PADDING]
  )

  const getDataPointPos = useCallback(
    (d: DataPoint, i: number, width: number, height: number) => {
      const { chartW, chartH } = getLayout(width, height)
      const monthIdx = MONTHS.indexOf(d.month)
      const pointsInMonth = DATA.filter((p) => p.month === d.month)
      const subIdx = pointsInMonth.indexOf(d)
      const subCount = pointsInMonth.length
      const colW = chartW / MONTHS.length
      const subOffset =
        subCount > 1 ? (subIdx - (subCount - 1) / 2) * 18 : 0
      const x = PADDING.left + colW * monthIdx + colW / 2 + subOffset
      const y = PADDING.top + chartH - (d.value / Y_MAX) * chartH
      return { x, y }
    },
    [getLayout]
  )

  // Draw
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      ctx.clearRect(0, 0, width * dpr, height * dpr)
      ctx.save()
      ctx.scale(dpr, dpr)

      const { chartW, chartH } = getLayout(width, height)
      const progress = animProgress.current
      const pulse = dotPulsePhase.current

      // Background
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.roundRect(0, 0, width, height, 16)
      ctx.fill()

      // Grid lines + Y labels
      ctx.strokeStyle = "#f0f0f0"
      ctx.lineWidth = 1
      ctx.fillStyle = "#94a3b8"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"

      for (let v = 0; v <= Y_MAX; v += Y_STEP) {
        const y = PADDING.top + chartH - (v / Y_MAX) * chartH
        ctx.beginPath()
        ctx.moveTo(PADDING.left, y)
        ctx.lineTo(PADDING.left + chartW, y)
        ctx.stroke()
        ctx.fillText(String(v), PADDING.left - 10, y)
      }

      // X labels
      ctx.fillStyle = "#94a3b8"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      const colW = chartW / MONTHS.length
      MONTHS.forEach((m, i) => {
        const x = PADDING.left + colW * i + colW / 2
        ctx.fillText(m, x, PADDING.top + chartH + 10)
      })

      // Y axis label
      ctx.save()
      ctx.fillStyle = "#64748b"
      ctx.font = "13px sans-serif"
      ctx.textAlign = "center"
      ctx.translate(16, PADDING.top + chartH / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText("迭代速度 (次/月)", 0, 0)
      ctx.restore()

      // Data points: stems + dots
      const visibleCount = Math.floor(progress * DATA.length)
      DATA.forEach((d, i) => {
        if (i > visibleCount) return
        const { x, y } = getDataPointPos(d, i, width, height)
        const baseY = PADDING.top + chartH
        const color = getProjectColor(d.project)

        // Individual progress for staggered animation
        const itemDelay = i / DATA.length
        const itemProgress = Math.max(
          0,
          Math.min(1, (progress - itemDelay * 0.5) / 0.5)
        )
        const easedStem = easeOutCubic(itemProgress)
        const easedDot = easeOutBack(Math.max(0, (itemProgress - 0.3) / 0.7))

        const currentY = baseY - (baseY - y) * easedStem

        // Stem line
        ctx.strokeStyle = "#cbd5e1"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, baseY)
        ctx.lineTo(x, currentY)
        ctx.stroke()

        // Stem colored cap (top 4px)
        if (easedStem > 0.1) {
          ctx.strokeStyle = color
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(x, currentY + 4)
          ctx.lineTo(x, currentY)
          ctx.stroke()
        }

        // Dot
        if (easedDot > 0) {
          const dotScale = easedDot
          const isHovered = hoveredIndex === i
          const pulseScale = isHovered
            ? 1.3
            : 1 + Math.sin(pulse + i * 0.5) * 0.06
          const r = DOT_RADIUS * dotScale * pulseScale

          // Glow
          if (isHovered) {
            const grad = ctx.createRadialGradient(
              x,
              currentY,
              r * 0.5,
              x,
              currentY,
              r * 2.5
            )
            grad.addColorStop(0, color + "40")
            grad.addColorStop(1, color + "00")
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(x, currentY, r * 2.5, 0, Math.PI * 2)
            ctx.fill()
          }

          // Shadow
          ctx.fillStyle = "rgba(0,0,0,0.1)"
          ctx.beginPath()
          ctx.arc(x + 1, currentY + 2, r, 0, Math.PI * 2)
          ctx.fill()

          // Main dot
          const dotGrad = ctx.createRadialGradient(
            x - r * 0.3,
            currentY - r * 0.3,
            r * 0.1,
            x,
            currentY,
            r
          )
          dotGrad.addColorStop(0, lightenColor(color, 40))
          dotGrad.addColorStop(0.7, color)
          dotGrad.addColorStop(1, darkenColor(color, 20))
          ctx.fillStyle = dotGrad
          ctx.beginPath()
          ctx.arc(x, currentY, r, 0, Math.PI * 2)
          ctx.fill()

          // Highlight
          ctx.fillStyle = "rgba(255,255,255,0.45)"
          ctx.beginPath()
          ctx.arc(
            x - r * 0.25,
            currentY - r * 0.25,
            r * 0.35,
            0,
            Math.PI * 2
          )
          ctx.fill()

          // Value label (show when mostly animated in, or hovered)
          if ((easedDot > 0.8 && progress > 0.7) || isHovered) {
            ctx.fillStyle = "#334155"
            ctx.font = `${isHovered ? "bold " : ""}11px sans-serif`
            ctx.textAlign = "center"
            ctx.textBaseline = "bottom"
            ctx.fillText(String(d.value), x, currentY - r - 4)
          }
        }
      })

      ctx.restore()
    },
    [getLayout, getDataPointPos, getProjectColor, hoveredIndex]
  )

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    const w = rect.width
    const h = 420
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + "px"
    canvas.style.height = h + "px"

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible.current) {
          isVisible.current = true
          animStartTime.current = performance.now()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(canvas)

    let running = true
    const loop = (now: number) => {
      if (!running) return

      if (animStartTime.current !== null) {
        const elapsed = now - animStartTime.current
        animProgress.current = Math.min(1, elapsed / ANIM_DURATION)
      }

      dotPulsePhase.current = now * 0.003
      draw(ctx, w, h)
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(rafId.current)
      observer.disconnect()
    }
  }, [draw])

  // Mouse events
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const w = rect.width
      const h = rect.height

      let found = false
      for (let i = DATA.length - 1; i >= 0; i--) {
        const d = DATA[i]
        const { x, y } = getDataPointPos(d, i, w, h)
        const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2)
        if (dist < DOT_RADIUS + 6) {
          setHoveredIndex(i)
          setTooltip({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            data: d,
            color: getProjectColor(d.project),
          })
          found = true
          break
        }
      }
      if (!found) {
        setHoveredIndex(null)
        setTooltip(null)
      }
    },
    [getDataPointPos, getProjectColor]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
    setTooltip(null)
  }, [])

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            迭代速度趋势
          </h2>
          <p className="text-sm text-muted-foreground">
            各项目每月迭代次数分布
          </p>
        </div>

        <div ref={containerRef} className="relative">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full cursor-crosshair"
          />

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 rounded-lg border border-border bg-popover px-3 py-2 shadow-lg"
              style={{
                left: tooltip.x + 12,
                top: tooltip.y - 10,
                transform: "translateY(-100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tooltip.color }}
                />
                <span className="text-sm font-medium text-popover-foreground">
                  {tooltip.data.project}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {tooltip.data.month} /{" "}
                <span className="font-semibold text-popover-foreground">
                  {tooltip.data.value} 次/月
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {PROJECTS.map((p) => (
            <div key={p.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-xs text-muted-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Color helpers
function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `rgb(${r},${g},${b})`
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.max(0, ((num >> 16) & 0xff) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `rgb(${r},${g},${b})`
}
