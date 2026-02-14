"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// ── Data ────────────────────────────────────────────────────────────────────
interface ProjectQuality {
  name: string
  grade: "A" | "B" | "C"
  // Box-plot five-number summary (quality scores 0-100)
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers?: number[]
  color: string
}

const projects: ProjectQuality[] = [
  { name: "智能客服", grade: "C", min: 32, q1: 40, median: 46, q3: 52, max: 58, outliers: [28], color: "#1a2366" },
  { name: "数据平台", grade: "C", min: 35, q1: 42, median: 48, q3: 55, max: 62, outliers: [], color: "#2b2d7e" },
  { name: "云存储", grade: "C", min: 38, q1: 45, median: 50, q3: 56, max: 64, outliers: [72], color: "#433197" },
  { name: "移动支付", grade: "B", min: 42, q1: 50, median: 56, q3: 63, max: 70, outliers: [], color: "#5c34a8" },
  { name: "物联网", grade: "B", min: 45, q1: 53, median: 58, q3: 65, max: 72, outliers: [38], color: "#7a3aac" },
  { name: "人脸识别", grade: "B", min: 48, q1: 55, median: 62, q3: 68, max: 75, outliers: [], color: "#9e3fa5" },
  { name: "推荐系统", grade: "B", min: 50, q1: 58, median: 65, q3: 72, max: 78, outliers: [42], color: "#c4476e" },
  { name: "区块链", grade: "A", min: 55, q1: 64, median: 70, q3: 76, max: 84, outliers: [], color: "#e05a3a" },
  { name: "自动驾驶", grade: "A", min: 60, q1: 68, median: 74, q3: 80, max: 88, outliers: [52], color: "#ee7c30" },
  { name: "语音助手", grade: "A", min: 62, q1: 70, median: 78, q3: 85, max: 92, outliers: [56], color: "#f5a623" },
  { name: "AI 大模型", grade: "A", min: 68, q1: 75, median: 82, q3: 88, max: 95, outliers: [], color: "#f0c830" },
]

// ── Grade badge ─────────────────────────────────────────────────────────────
const gradeBadgeColor: Record<string, { bg: string; text: string }> = {
  A: { bg: "#10b981", text: "#ffffff" },
  B: { bg: "#f59e0b", text: "#ffffff" },
  C: { bg: "#ef4444", text: "#ffffff" },
}

// ── Chart config ────────────────────────────────────────────────────────────
const CHART = {
  width: 820,
  height: 300,
  padLeft: 60,
  padRight: 30,
  padTop: 20,
  padBottom: 60,
  yMin: 20,
  yMax: 100,
  yStep: 10,
  boxWidth: 32,
}

function yScale(v: number): number {
  const { padTop, padBottom, height, yMin, yMax } = CHART
  const plotH = height - padTop - padBottom
  return padTop + plotH - ((v - yMin) / (yMax - yMin)) * plotH
}

// ── Component ───────────────────────────────────────────────────────────────
export default function QualityGradeChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [animProgress, setAnimProgress] = useState(0)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  // Entrance animation
  useEffect(() => {
    let start: number | null = null
    let frame: number
    const duration = 900
    const step = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      const t = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3)
      setAnimProgress(ease)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [])

  const plotW = CHART.width - CHART.padLeft - CHART.padRight
  const gap = plotW / projects.length

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const scaleX = CHART.width / rect.width
    const scaleY = CHART.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY

    let found: number | null = null
    projects.forEach((_, i) => {
      const cx = CHART.padLeft + gap * i + gap / 2
      if (Math.abs(mx - cx) < gap / 2) found = i
    })
    setHoveredIdx(found)
    if (found !== null) {
      setTooltipPos({ x: e.clientX - svgRef.current!.getBoundingClientRect().left, y: my })
    }
  }, [gap])

  // Y-axis ticks
  const yTicks: number[] = []
  for (let v = CHART.yMin; v <= CHART.yMax; v += CHART.yStep) yTicks.push(v)

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              质量等级分布
            </h2>
            <p className="text-sm text-muted-foreground">
              项目质量评分箱线图 (A/B/C 等级)
            </p>
          </div>
          <div className="flex gap-2">
            {(["A", "B", "C"] as const).map((g) => (
              <span
                key={g}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: gradeBadgeColor[g].bg,
                  color: gradeBadgeColor[g].text,
                }}
              >
                {g} 级
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-3 h-px w-full" style={{ background: "linear-gradient(90deg, #1a2366, #5c34a8, #c4476e, #ee7c30, #f0c830)" }} />

        {/* Chart */}
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setHoveredIdx(null); setTooltipPos(null) }}
          >
            {/* Grid lines */}
            {yTicks.map((v) => (
              <g key={v}>
                <line
                  x1={CHART.padLeft}
                  x2={CHART.width - CHART.padRight}
                  y1={yScale(v)}
                  y2={yScale(v)}
                  stroke="hsl(0 0% 88%)"
                  strokeWidth={0.8}
                  strokeDasharray={v === CHART.yMin ? "0" : "4 3"}
                />
                <text
                  x={CHART.padLeft - 12}
                  y={yScale(v) + 4}
                  textAnchor="end"
                  fontSize={12}
                  fill="hsl(0 0% 45%)"
                >
                  {v}
                </text>
              </g>
            ))}

            {/* Y axis label */}
            <text
              x={16}
              y={CHART.height / 2 - 30}
              textAnchor="middle"
              fontSize={13}
              fill="hsl(0 0% 35%)"
              transform={`rotate(-90, 16, ${CHART.height / 2 - 30})`}
            >
              质量评分
            </text>

            {/* Box plots */}
            {projects.map((p, i) => {
              const cx = CHART.padLeft + gap * i + gap / 2
              const halfBox = CHART.boxWidth / 2
              const isHovered = hoveredIdx === i
              const scale = isHovered ? 1.08 : 1

              // Animated values (grow from median)
              const medY = yScale(p.median)
              const q1Y = medY + (yScale(p.q1) - medY) * animProgress
              const q3Y = medY + (yScale(p.q3) - medY) * animProgress
              const minY = medY + (yScale(p.min) - medY) * animProgress
              const maxY = medY + (yScale(p.max) - medY) * animProgress

              // stagger delay
              const stagger = Math.min(1, Math.max(0, (animProgress - i * 0.04) / (1 - i * 0.04)))

              return (
                <g
                  key={p.name}
                  style={{
                    opacity: stagger,
                    transform: `scale(${scale})`,
                    transformOrigin: `${cx}px ${medY}px`,
                    transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
                  }}
                >
                  {/* Whisker line (vertical) */}
                  <line
                    x1={cx}
                    x2={cx}
                    y1={maxY}
                    y2={minY}
                    stroke={p.color}
                    strokeWidth={2}
                  />
                  {/* Top whisker cap */}
                  <line
                    x1={cx - halfBox * 0.5}
                    x2={cx + halfBox * 0.5}
                    y1={maxY}
                    y2={maxY}
                    stroke={p.color}
                    strokeWidth={2}
                  />
                  {/* Bottom whisker cap */}
                  <line
                    x1={cx - halfBox * 0.5}
                    x2={cx + halfBox * 0.5}
                    y1={minY}
                    y2={minY}
                    stroke={p.color}
                    strokeWidth={2}
                  />

                  {/* Box (Q1-Q3) */}
                  <rect
                    x={cx - halfBox}
                    y={q3Y}
                    width={CHART.boxWidth}
                    height={Math.max(q1Y - q3Y, 1)}
                    rx={3}
                    fill={p.color}
                    fillOpacity={isHovered ? 0.95 : 0.75}
                    stroke={p.color}
                    strokeWidth={1.5}
                    style={{ transition: "fill-opacity 0.2s" }}
                  />

                  {/* Median line */}
                  <line
                    x1={cx - halfBox}
                    x2={cx + halfBox}
                    y1={medY}
                    y2={medY}
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />

                  {/* Median dot */}
                  <circle
                    cx={cx}
                    cy={medY}
                    r={4}
                    fill="#ffffff"
                    stroke={p.color}
                    strokeWidth={1.5}
                  />

                  {/* Outliers */}
                  {(p.outliers ?? []).map((ov, oi) => {
                    const oy = medY + (yScale(ov) - medY) * animProgress
                    return (
                      <circle
                        key={oi}
                        cx={cx}
                        cy={oy}
                        r={5}
                        fill={p.color}
                        fillOpacity={0.5}
                        stroke={p.color}
                        strokeWidth={1.5}
                      />
                    )
                  })}

                  {/* Hover value label */}
                  {isHovered && (
                    <g>
                      <rect
                        x={cx - 22}
                        y={q3Y - 26}
                        width={44}
                        height={20}
                        rx={4}
                        fill={p.color}
                      />
                      <text
                        x={cx}
                        y={q3Y - 12}
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={600}
                        fill="#ffffff"
                      >
                        {p.median}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* Bottom labels */}
            {projects.map((p, i) => {
              const cx = CHART.padLeft + gap * i + gap / 2
              const labelY = CHART.height - CHART.padBottom + 18
              return (
                <g
                  key={`label-${p.name}`}
                  style={{
                    opacity: animProgress,
                    transition: "opacity 0.4s",
                  }}
                >
                  {/* Color bar */}
                  <rect
                    x={cx - 12}
                    y={labelY}
                    width={24}
                    height={4}
                    rx={2}
                    fill={p.color}
                  />
                  {/* Grade badge */}
                  <rect
                    x={cx - 10}
                    y={labelY + 10}
                    width={20}
                    height={16}
                    rx={4}
                    fill={gradeBadgeColor[p.grade].bg}
                  />
                  <text
                    x={cx}
                    y={labelY + 22}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill="#ffffff"
                  >
                    {p.grade}
                  </text>
                  {/* Project name */}
                  <text
                    x={cx}
                    y={labelY + 42}
                    textAnchor="middle"
                    fontSize={11}
                    fill="hsl(0 0% 40%)"
                  >
                    {p.name}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIdx !== null && tooltipPos && (
            <div
              className="pointer-events-none absolute z-10 rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y - 120,
                transform: "translateX(-50%)",
              }}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: projects[hoveredIdx].color }}
                />
                <span className="text-sm font-semibold text-card-foreground">
                  {projects[hoveredIdx].name}
                </span>
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: gradeBadgeColor[projects[hoveredIdx].grade].bg,
                    color: "#fff",
                  }}
                >
                  {projects[hoveredIdx].grade} 级
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>最高分: <strong className="text-card-foreground">{projects[hoveredIdx].max}</strong></span>
                <span>Q3: <strong className="text-card-foreground">{projects[hoveredIdx].q3}</strong></span>
                <span>中位数: <strong className="text-card-foreground">{projects[hoveredIdx].median}</strong></span>
                <span>Q1: <strong className="text-card-foreground">{projects[hoveredIdx].q1}</strong></span>
                <span>最低分: <strong className="text-card-foreground">{projects[hoveredIdx].min}</strong></span>
                {projects[hoveredIdx].outliers && projects[hoveredIdx].outliers!.length > 0 && (
                  <span>异常值: <strong className="text-card-foreground">{projects[hoveredIdx].outliers!.join(", ")}</strong></span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          {projects.map((p) => (
            <div key={p.name} className="flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-[11px] text-muted-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
