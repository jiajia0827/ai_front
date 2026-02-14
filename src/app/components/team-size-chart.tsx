"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

interface ProjectTeam {
  name: string
  size: number
  color: string
  lightColor: string
}

const teamData: ProjectTeam[] = [
  { name: "前端重构", size: 32, color: "#f59e0b", lightColor: "#fde68a" },
  { name: "后端API开发", size: 48, color: "#ef4444", lightColor: "#fca5a5" },
  { name: "移动端适配", size: 25, color: "#8b5cf6", lightColor: "#c4b5fd" },
  { name: "数据库迁移", size: 18, color: "#3b82f6", lightColor: "#93c5fd" },
  { name: "UI设计系统", size: 22, color: "#10b981", lightColor: "#6ee7b7" },
  { name: "自动化测试", size: 15, color: "#f97316", lightColor: "#fdba74" },
  { name: "性能优化", size: 38, color: "#ec4899", lightColor: "#f9a8d4" },
  { name: "文档编写", size: 12, color: "#06b6d4", lightColor: "#67e8f9" },
]

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

interface BubbleInfo {
  data: ProjectTeam
  cx: number
  cy: number
  radius: number
  index: number
}

export default function TeamSizeChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(760)
  const [animProgress, setAnimProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const animRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const [floatingOffsets, setFloatingOffsets] = useState<number[]>(
    teamData.map(() => 0)
  )

  // Responsive container width
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isVisible])

  // Entrance animation
  const animateEntrance = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp
    const elapsed = (timestamp - startRef.current) / 1000
    setAnimProgress(elapsed)
    if (elapsed < 3) {
      animRef.current = requestAnimationFrame(animateEntrance)
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      animRef.current = requestAnimationFrame(animateEntrance)
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isVisible, animateEntrance])

  // Continuous floating animation via requestAnimationFrame
  useEffect(() => {
    if (!isVisible) return
    let frameId: number
    const speeds = teamData.map((_, i) => 0.8 + (i % 3) * 0.35)
    const amplitudes = teamData.map((_, i) => 6 + (i % 3) * 3)
    const phases = teamData.map((_, i) => i * 0.8)

    function tick(timestamp: number) {
      const t = timestamp / 1000
      const newOffsets = teamData.map((_, i) =>
        Math.sin(t * speeds[i] + phases[i]) * amplitudes[i]
      )
      setFloatingOffsets(newOffsets)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isVisible])

  const items = teamData
  const maxSize = Math.max(...items.map((d) => d.size))
  const minSize = Math.min(...items.map((d) => d.size))

  const minRadius = Math.max(30, containerWidth * 0.04)
  const maxRadius = Math.min(78, containerWidth * 0.1)

  function getRadius(size: number) {
    if (maxSize === minSize) return (minRadius + maxRadius) / 2
    const ratio = (size - minSize) / (maxSize - minSize)
    return minRadius + ratio * (maxRadius - minRadius)
  }

  const svgHeight = 100
  const baseY = svgHeight * 0.45

  const padding = maxRadius + 16
  const usableWidth = containerWidth - padding * 2
  const gap = items.length > 1 ? usableWidth / (items.length - 1) : 0

  const bubbles: BubbleInfo[] = useMemo(
    () =>
      items.map((d, i) => {
        const r = getRadius(d.size)
        const cx = padding + gap * i
        const sizeRatio =
          maxSize === minSize ? 0.5 : (d.size - minSize) / (maxSize - minSize)
        const waveOffset = Math.sin(i * 0.85 + 0.5) * 14
        const cy = baseY - sizeRatio * 40 + waveOffset
        return { data: d, cx, cy, radius: r, index: i }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerWidth]
  )

  function easeOutBack(t: number) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }

  const labelY = svgHeight + 6

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-balance">团队规模分布</CardTitle>
        <CardDescription className="text-xs">
          各项目团队人数总览 -- 气泡越大团队规模越大
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div ref={containerRef} className="w-full">
          <svg
            width="100%"
            height={svgHeight + 52}
            viewBox={`0 0 ${containerWidth} ${svgHeight + 52}`}
            className="overflow-visible"
          >
            <defs>
              {bubbles.map((b) => {
                const rgb = hexToRgb(b.data.color)
                const lrgb = hexToRgb(b.data.lightColor)
                return (
                  <g key={`defs-${b.index}`}>
                    <radialGradient
                      id={`grad-${b.index}`}
                      cx="38%"
                      cy="32%"
                      r="68%"
                      fx="38%"
                      fy="32%"
                    >
                      <stop
                        offset="0%"
                        stopColor={`rgba(${lrgb.r},${lrgb.g},${lrgb.b},0.95)`}
                      />
                      <stop
                        offset="45%"
                        stopColor={`rgba(${rgb.r},${rgb.g},${rgb.b},0.82)`}
                      />
                      <stop
                        offset="100%"
                        stopColor={`rgba(${Math.max(0, rgb.r - 40)},${Math.max(0, rgb.g - 40)},${Math.max(0, rgb.b - 40)},0.72)`}
                      />
                    </radialGradient>
                    <radialGradient
                      id={`glow-${b.index}`}
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop
                        offset="0%"
                        stopColor={`rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`}
                      />
                      <stop
                        offset="100%"
                        stopColor={`rgba(${rgb.r},${rgb.g},${rgb.b},0)`}
                      />
                    </radialGradient>
                    <radialGradient
                      id={`hl-${b.index}`}
                      cx="42%"
                      cy="28%"
                      r="38%"
                    >
                      <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                  </g>
                )
              })}
            </defs>

            {/* Light backdrop columns */}
            {bubbles.map((b) => {
              const rgb = hexToRgb(b.data.color)
              const top = b.cy + b.radius * 0.5
              const colOpacity = isVisible ? 1 : 0
              return (
                <rect
                  key={`zone-${b.index}`}
                  x={b.cx - b.radius * 0.55}
                  y={top}
                  width={b.radius * 1.1}
                  height={Math.max(0, svgHeight - top + 4)}
                  rx={4}
                  fill={`rgba(${rgb.r},${rgb.g},${rgb.b},0.07)`}
                  opacity={colOpacity}
                  style={{
                    transition: `opacity 0.6s ease ${b.index * 0.08 + 0.4}s`,
                  }}
                />
              )
            })}

            {/* Bubbles */}
            {bubbles.map((b) => {
              const entranceDelay = b.index * 0.1
              const t = Math.max(
                0,
                Math.min(1, (animProgress - entranceDelay) / 0.55)
              )
              const scaleVal =
                easeOutBack(t) * (hoveredIndex === b.index ? 1.12 : 1)
              const opacity = Math.min(1, t * 2.5)
              const rgb = hexToRgb(b.data.color)
              const floatY = t >= 1 ? floatingOffsets[b.index] : 0

              return (
                <g
                  key={`bubble-${b.index}`}
                  transform={`translate(${b.cx}, ${b.cy + floatY})`}
                  opacity={opacity}
                  onMouseEnter={() => setHoveredIndex(b.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                >
                  <g
                    transform={`scale(${scaleVal})`}
                    style={{
                      transition:
                        hoveredIndex === b.index
                          ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          : "transform 0.4s ease-out",
                    }}
                  >
                    {/* Shadow */}
                    <ellipse
                      cx={0}
                      cy={b.radius * 0.82}
                      rx={b.radius * 0.65}
                      ry={b.radius * 0.12}
                      fill={`rgba(${rgb.r},${rgb.g},${rgb.b},${hoveredIndex === b.index ? 0.22 : 0.1})`}
                    />

                    {/* Outer glow */}
                    <circle
                      cx={0}
                      cy={0}
                      r={b.radius * 1.18}
                      fill={`url(#glow-${b.index})`}
                      opacity={hoveredIndex === b.index ? 0.9 : 0.5}
                    />

                    {/* Main body */}
                    <circle
                      cx={0}
                      cy={0}
                      r={b.radius}
                      fill={`url(#grad-${b.index})`}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={1.5}
                    />

                    {/* Top highlight */}
                    <ellipse
                      cx={-b.radius * 0.08}
                      cy={-b.radius * 0.2}
                      rx={b.radius * 0.52}
                      ry={b.radius * 0.38}
                      fill={`url(#hl-${b.index})`}
                    />

                    {/* Specular dot */}
                    <ellipse
                      cx={-b.radius * 0.22}
                      cy={-b.radius * 0.32}
                      rx={b.radius * 0.13}
                      ry={b.radius * 0.09}
                      fill="rgba(255,255,255,0.55)"
                    />

                    {/* Text: team size */}
                    <text
                      x={0}
                      y={2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize={Math.max(13, b.radius * 0.38)}
                      fontWeight={700}
                      style={{
                        textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        pointerEvents: "none",
                      }}
                    >
                      {b.data.size}人
                    </text>
                  </g>
                </g>
              )
            })}

            {/* Bottom labels */}
            {bubbles.map((b) => {
              const lblOpacity = isVisible ? 1 : 0
              return (
                <g
                  key={`lbl-${b.index}`}
                  opacity={lblOpacity}
                  style={{
                    transition: `opacity 0.5s ease ${b.index * 0.08 + 0.7}s`,
                  }}
                >
                  <rect
                    x={b.cx - 14}
                    y={labelY}
                    width={28}
                    height={4}
                    rx={2}
                    fill={b.data.color}
                    opacity={0.9}
                  />
                  <text
                    x={b.cx}
                    y={labelY + 20}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={500}
                    className="fill-muted-foreground"
                  >
                    {b.data.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Summary */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-t border-border pt-3">
          <span>
            {"团队总人数: "}
            <span className="font-semibold text-card-foreground">
              {items.reduce((s, d) => s + d.size, 0)}人
            </span>
          </span>
          <span>
            {"参与项目: "}
            <span className="font-semibold text-card-foreground">
              {items.length}个
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
