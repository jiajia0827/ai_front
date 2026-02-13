"use client"

interface VelocitySparklineProps {
  data: number[]
  color?: string
}

export function VelocitySparkline({ data, color = "#3b82f6" }: VelocitySparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data) * 0.8
  const max = Math.max(...data) * 1.1
  const range = max - min || 1

  const width = 56
  const height = 22
  const padding = 2

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((val - min) / range) * (height - padding * 2)
    return { x, y }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")

  const trend = data[data.length - 1] - data[0]
  const trendColor = trend > 0 ? "#22c55e" : trend < 0 ? "#ef4444" : color

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block"
      aria-label={`速度趋势: ${data.join(", ")}`}
    >
      <path
        d={pathD}
        fill="none"
        stroke={trendColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.5} fill={trendColor} />
      ))}
    </svg>
  )
}
