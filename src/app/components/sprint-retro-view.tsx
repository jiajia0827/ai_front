"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import {
  p0Trends,
  memberBalance,
  retroConclusions,
  memberRetroTrends,
  teamMembers,
} from "@/lib/scrum-data"
import { ChartBar, CircleAlert, Download } from "lucide-react"
import { Button } from "@/app/components/ui/button"

const memberColors = [
  "hsl(210, 40%, 62%)",
  "hsl(16, 52%, 68%)",
  "hsl(155, 32%, 58%)",
  "hsl(350, 45%, 65%)",
  "hsl(260, 28%, 68%)",
]

const conclusionColors = [
  "hsl(350, 45%, 65%)",
  "hsl(16, 52%, 68%)",
  "hsl(210, 40%, 62%)",
  "hsl(260, 28%, 68%)",
]

// Radar data for retro - quality dimensions
const retroRadarData = [
  { subject: "完成率", 张伟: 84, 李娜: 91, 王磊: 65, 赵敏: 78, 陈刚: 60 },
  { subject: "准时率", 张伟: 80, 李娜: 88, 王磊: 55, 赵敏: 75, 陈刚: 58 },
  { subject: "质量分", 张伟: 86, 李娜: 93, 王磊: 68, 赵敏: 80, 陈刚: 63 },
  { subject: "协作度", 张伟: 90, 李娜: 85, 王磊: 72, 赵敏: 82, 陈刚: 70 },
  { subject: "改进力", 张伟: 78, 李娜: 82, 王磊: 60, 赵敏: 76, 陈刚: 55 },
]

export function SprintRetroUpperChart() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-card-foreground">
            P0 任务完成率 / 阻塞率趋势
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            近 6 个 Sprint 高优任务执行质量追踪
          </p>
        </div>
        <Badge className="bg-primary text-primary-foreground border-transparent hover:bg-primary/90">
          <ChartBar className="mr-1 h-3 w-3" />
          复盘数据
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={p0Trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(30, 16%, 88%)" />
              <XAxis dataKey="sprint" tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }}
                label={{ value: "百分比 %", angle: -90, position: "insideLeft", style: { fill: "hsl(220, 10%, 48%)", fontSize: 11 } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(40, 20%, 99%)",
                  border: "1px solid hsl(30, 16%, 88%)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="completionRate" name="P0 完成率" stroke="hsl(155, 32%, 58%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(155, 32%, 58%)" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="blockRate" name="阻塞率" stroke="hsl(350, 45%, 65%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(350, 45%, 65%)" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Retro conclusion export block */}
        <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CircleAlert className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-card-foreground">阻塞原因分析</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-7 border-border text-card-foreground hover:bg-muted">
              <Download className="mr-1 h-3 w-3" />
              导出结论
            </Button>
          </div>
          <div className="space-y-2">
            {retroConclusions.map((item, idx) => (
              <div key={item.reason} className="flex items-center gap-3">
                <div className="w-28 text-xs text-muted-foreground shrink-0">{item.reason}</div>
                <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${item.percentage}%`, backgroundColor: conclusionColors[idx] }}
                  >
                    <span className="text-[10px] font-semibold text-[hsl(0,0%,100%)]">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground italic">
            复盘结论：阻塞主要原因是<strong className="text-destructive not-italic">需求不清晰</strong>，占比 45%。建议加强 Sprint 规划阶段的需求评审，增加验收标准检查环节。
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function SprintRetroLowerChart() {
  const sortedByBlocked = [...memberBalance].sort((a, b) => b.blockedHours - a.blockedHours)

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-card-foreground">
            成员负载均衡度 / 阻塞时长排名
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            质量雷达、负载评分、阻塞排名与历史趋势
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top: 3-column - Radar + Bar + Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Radar Chart - Quality Dimensions */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">质量维度雷达</h4>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={retroRadarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(30, 16%, 88%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 9 }} />
                  {teamMembers.map((member, i) => (
                    <Radar
                      key={member.name}
                      name={member.name}
                      dataKey={member.name}
                      stroke={memberColors[i]}
                      fill={memberColors[i]}
                      fillOpacity={0.08}
                      strokeWidth={1.5}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(40, 20%, 99%)",
                      border: "1px solid hsl(30, 16%, 88%)",
                      borderRadius: "8px",
                      fontSize: 11,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Load Balance Chart */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">负载均衡度评分</h4>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberBalance} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(30, 16%, 88%)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }} />
                  <YAxis dataKey="member" type="category" width={50} tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(40, 20%, 99%)",
                      border: "1px solid hsl(30, 16%, 88%)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="loadScore" name="负载评分" radius={[0, 4, 4, 0]}>
                    {memberBalance.map((entry, index) => (
                      <Cell
                        key={`cell-load-${index}`}
                        fill={
                          entry.loadScore >= 80
                            ? "hsl(155, 32%, 58%)"
                            : entry.loadScore >= 65
                            ? "hsl(16, 52%, 68%)"
                            : "hsl(350, 45%, 65%)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Blocked Hours Ranking */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">累计阻塞时长排名</h4>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedByBlocked} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(30, 16%, 88%)" />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }}
                    label={{ value: "小时", position: "insideBottomRight", offset: -5, style: { fill: "hsl(220, 10%, 48%)", fontSize: 11 } }}
                  />
                  <YAxis dataKey="member" type="category" width={50} tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(40, 20%, 99%)",
                      border: "1px solid hsl(30, 16%, 88%)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`${value}h`, "阻塞时长"]}
                  />
                  <Bar dataKey="blockedHours" name="阻塞时长 (h)" radius={[0, 4, 4, 0]}>
                    {sortedByBlocked.map((entry, index) => (
                      <Cell
                        key={`cell-block-${index}`}
                        fill={
                          entry.blockedHours >= 12
                            ? "hsl(350, 45%, 65%)"
                            : entry.blockedHours >= 8
                            ? "hsl(16, 52%, 68%)"
                            : "hsl(210, 40%, 62%)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Member rows with sparkline area charts */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">成员阻塞 / 质量趋势</h4>
          <div className="space-y-3">
            {memberRetroTrends.map((m, idx) => {
              const balance = memberBalance.find((b) => b.member === m.member)
              const isHighBlocked = m.totalBlocked >= 12

              return (
                <div
                  key={m.member}
                  className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
                    isHighBlocked ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{
                        backgroundColor: `${memberColors[idx]}20`,
                        color: memberColors[idx],
                      }}
                    >
                      {m.member.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="w-24 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm text-card-foreground">{m.member}</span>
                      {isHighBlocked && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
                          高阻塞
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: memberColors[idx] }}>
                      累计 {m.totalBlocked}h
                    </span>
                  </div>

                  {/* Sparkline Area Chart - quality + blocked */}
                  <div className="flex-1 h-14">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={m.trend}>
                        <defs>
                          <linearGradient id={`grad-retro-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={memberColors[idx]} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={memberColors[idx]} stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="quality"
                          stroke={memberColors[idx]}
                          strokeWidth={2}
                          fill={`url(#grad-retro-${idx})`}
                        />
                        <Area
                          type="monotone"
                          dataKey="blocked"
                          stroke="hsl(350, 45%, 65%)"
                          strokeWidth={1}
                          strokeDasharray="4 2"
                          fill="none"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(40, 20%, 99%)",
                            border: "1px solid hsl(30, 16%, 88%)",
                            borderRadius: "6px",
                            fontSize: 11,
                            padding: "4px 8px",
                          }}
                          labelStyle={{ fontSize: 10, color: "hsl(220, 10%, 48%)" }}
                          formatter={(value: number, name: string) => [
                            name === "quality" ? `${value}%` : `${value}h`,
                            name === "quality" ? "质量分" : "阻塞",
                          ]}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Score badge */}
                  <div className="w-16 text-right shrink-0">
                    <div className="text-xs text-muted-foreground">均衡度</div>
                    <div
                      className="text-lg font-bold"
                      style={{
                        color:
                          (balance?.loadScore ?? 0) >= 80
                            ? "hsl(155, 32%, 58%)"
                            : (balance?.loadScore ?? 0) >= 65
                            ? "hsl(16, 52%, 68%)"
                            : "hsl(350, 45%, 65%)",
                      }}
                    >
                      {balance?.loadScore ?? 0}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Balance Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          {memberBalance.map((m) => (
            <div
              key={m.member}
              className={`rounded-lg border p-3 text-center ${
                m.loadScore < 65 ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"
              }`}
            >
              <div className="text-sm font-medium text-card-foreground">{m.member}</div>
              <div
                className="text-lg font-bold mt-1"
                style={{
                  color:
                    m.loadScore >= 80
                      ? "hsl(155, 32%, 58%)"
                      : m.loadScore >= 65
                      ? "hsl(16, 52%, 68%)"
                      : "hsl(350, 45%, 65%)",
                }}
              >
                {m.loadScore}
              </div>
              <div className="text-[10px] text-muted-foreground">均 {m.avgPointsPerSprint} 点/Sprint</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
