"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
  Tooltip as RechartsTooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

const PROJECT_COLORS: Record<string, string> = {
  "前端重构": "#3b82f6",
  "后端API开发": "#10b981",
  "移动端适配": "#f59e0b",
  "数据库迁移": "#ef4444",
  "UI设计系统": "#8b5cf6",
  "自动化测试": "#06b6d4",
  "性能优化": "#ec4899",
  "文档编写": "#f97316",
  "安全审计": "#14b8a6",
  "CI/CD流水线": "#6366f1",
  "用户反馈系统": "#84cc16",
  "数据分析平台": "#a855f7",
  "国际化支持": "#0ea5e9",
  "微服务拆分": "#e11d48",
  "监控告警系统": "#d97706",
  "权限管理模块": "#059669",
}

const projectData = [
  { name: "前端重构", progress: 920 },
  { name: "后端API开发", progress: 1780 },
  { name: "移动端适配", progress: 1950 },
  { name: "数据库迁移", progress: 2050 },
  { name: "UI设计系统", progress: 2100 },
  { name: "自动化测试", progress: 2150 },
  { name: "性能优化", progress: 2500 },
  { name: "文档编写", progress: 2700 },
  { name: "安全审计", progress: 2200 },
  { name: "CI/CD流水线", progress: 2450 },
  { name: "用户反馈系统", progress: 2350 },
  { name: "数据分析平台", progress: 2550 },
  { name: "国际化支持", progress: 2400 },
  { name: "微服务拆分", progress: 2600 },
  { name: "监控告警系统", progress: 2650 },
  { name: "权限管理模块", progress: 2750 },
].sort((a, b) => a.progress - b.progress)

interface DotProps {
  cx?: number
  cy?: number
  payload?: { name: string; progress: number }
}

function CustomDot({ cx, cy, payload }: DotProps) {
  if (!cx || !cy || !payload) return null
  const color = PROJECT_COLORS[payload.name] || "#94a3b8"
  const isMax = payload.progress === Math.max(...projectData.map((d) => d.progress))
  const r = isMax ? 14 : 10

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" }}
      />
      {isMax && (
        <g>
          <rect
            x={cx + 18}
            y={cy - 14}
            width={50}
            height={28}
            rx={6}
            fill={color}
          />
          <text
            x={cx + 43}
            y={cy + 1}
            textAnchor="middle"
            fill="#fff"
            fontSize={13}
            fontWeight={600}
          >
            {payload.progress}
          </text>
        </g>
      )}
    </g>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { name: string; progress: number } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  const color = PROJECT_COLORS[data.name] || "#94a3b8"

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-semibold text-card-foreground">{data.name}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {"进度分值: "}
        <span className="font-medium text-card-foreground">{data.progress}</span>
      </div>
    </div>
  )
}

export default function ProjectProgressChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">项目进度分布</CardTitle>
        <CardDescription>
          多项目进度总览 · 不同颜色区分各项目
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
          {projectData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: PROJECT_COLORS[item.name] || "#94a3b8",
                }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectData}
                layout="vertical"
                margin={{ top: 8, right: 80, left: 16, bottom: 8 }}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  type="number"
                  domain={[0, 3000]}
                  ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 13, fill: "#374151" }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                />
                <Bar
                  dataKey="progress"
                  radius={[0, 4, 4, 0]}
                  barSize={6}
                  background={{ fill: "transparent" }}
                  shape={(props: any) => {
                    const {
                      x,
                      y,
                      width,
                      height,
                      payload,
                    } = props
                    const color = PROJECT_COLORS[payload.name] || "#94a3b8"
                    const dotR = 10
                    const centerY = y + height / 2

                    return (
                      <g>
                        {/* Line */}
                        <rect
                          x={x}
                          y={centerY - 2}
                          width={width}
                          height={4}
                          rx={2}
                          fill={color}
                          opacity={0.35}
                        />
                        {/* Dot */}
                        <circle
                          cx={x + width}
                          cy={centerY}
                          r={dotR}
                          fill={color}
                          stroke="#fff"
                          strokeWidth={2.5}
                          style={{
                            filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.18))",
                          }}
                        />
                      </g>
                    )
                  }}
                >
                  <LabelList
                    dataKey="progress"
                    position="right"
                    offset={18}
                    style={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
