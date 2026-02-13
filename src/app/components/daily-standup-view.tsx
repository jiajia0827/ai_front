"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
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
  dailyTaskStatus,
  dailyMemberLoad,
  dailyAlerts,
  memberDailyTrends,
  memberRadarData,
  taskDistribution,
  teamMembers,
} from "@/lib/scrum-data"
import { TriangleAlert, CircleCheck, Clock, ShieldAlert } from "lucide-react"

const memberColors = [
  "hsl(210, 40%, 62%)",
  "hsl(16, 52%, 68%)",
  "hsl(155, 32%, 58%)",
  "hsl(350, 45%, 65%)",
  "hsl(260, 28%, 68%)",
]

const pieColors = [
  "hsl(155, 32%, 58%)",
  "hsl(210, 40%, 62%)",
  "hsl(350, 45%, 65%)",
  "hsl(260, 28%, 68%)",
]

export function DailyStandupUpperChart() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-card-foreground">
            当日任务状态总览
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Sprint 24 - 本周每日任务进度
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[hsl(155,32%,58%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(155,32%,58%)]/90 border-transparent">
            <CircleCheck className="mr-1 h-3 w-3" />
            已完成 22
          </Badge>
          <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent">
            <TriangleAlert className="mr-1 h-3 w-3" />
            阻塞 1
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTaskStatus} layout="vertical" barGap={2} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(30, 16%, 88%)" />
              <XAxis type="number" tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }} />
              <YAxis
                dataKey="day"
                type="category"
                width={80}
                tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(40, 20%, 99%)",
                  border: "1px solid hsl(30, 16%, 88%)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="completed" name="已完成" stackId="a" fill="hsl(210, 40%, 62%)" />
              <Bar dataKey="inProgress" name="进行中" stackId="a" fill="hsl(16, 52%, 68%)" />
              <Bar dataKey="blocked" name="已阻塞" stackId="a" fill="hsl(350, 45%, 65%)">
                {dailyTaskStatus.map((entry, index) => (
                  <Cell
                    key={`cell-blocked-${index}`}
                    fill={entry.day.includes("今日") ? "hsl(350, 45%, 60%)" : "hsl(350, 45%, 65%)"}
                  />
                ))}
              </Bar>
              <Bar dataKey="todo" name="待处理" stackId="a" fill="hsl(260, 28%, 68%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function DailyStandupLowerChart() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-card-foreground">
            成员负载分析
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            今日各成员工作量、能力雷达与任务分布
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Alert Banners */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <span className="text-card-foreground">
              今日阻塞 Top1：
              <strong className="text-destructive">{dailyAlerts.topBlockedMember}</strong>
              <span className="text-muted-foreground ml-1">（{dailyAlerts.topBlockedReason}，{dailyAlerts.blockedHours}h）</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-2 text-sm">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-card-foreground">
              P0 未完成成员：
              <strong className="text-accent">{dailyAlerts.p0UnfinishedMembers.join("、")}</strong>
              <span className="text-muted-foreground ml-1">（共 {dailyAlerts.p0UnfinishedTasks} 个任务）</span>
            </span>
          </div>
        </div>

        {/* Top row: Radar + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Radar Chart */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium text-card-foreground mb-3">团队能力雷达</h4>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={memberRadarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="hsl(30, 16%, 88%)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 10 }}
                  />
                  {teamMembers.map((member, i) => (
                    <Radar
                      key={member.name}
                      name={member.name}
                      dataKey={member.name}
                      stroke={memberColors[i]}
                      fill={memberColors[i]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(40, 20%, 99%)",
                      border: "1px solid hsl(30, 16%, 88%)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">今日任务分布</h4>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: "hsl(220, 10%, 48%)" }}
                  >
                    {taskDistribution.map((_, index) => (
                      <Cell key={`cell-pie-${index}`} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(40, 20%, 99%)",
                      border: "1px solid hsl(30, 16%, 88%)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Member rows with sparkline area charts */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">成员每日趋势</h4>
          <div className="space-y-3">
            {memberDailyTrends.map((m, idx) => {
              const memberLoad = dailyMemberLoad.find((ml) => ml.member === m.member)
              const isBlocked = memberLoad && memberLoad.blockedHours > 2

              return (
                <div
                  key={m.member}
                  className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
                    isBlocked ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"
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

                  <div className="w-20 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm text-card-foreground">{m.member}</span>
                      {isBlocked && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
                          阻塞
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: memberColors[idx] }}>
                      {m.totalPoints} 故事点
                    </span>
                  </div>

                  {/* Sparkline Area Chart */}
                  <div className="flex-1 h-14">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={m.trend}>
                        <defs>
                          <linearGradient id={`grad-daily-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={memberColors[idx]} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={memberColors[idx]} stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="load"
                          stroke={memberColors[idx]}
                          strokeWidth={2}
                          fill={`url(#grad-daily-${idx})`}
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke={memberColors[idx]}
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
                            value,
                            name === "load" ? "负载" : "已完成",
                          ]}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Mini stats */}
                  <div className="w-16 text-right shrink-0">
                    <div className="text-xs text-muted-foreground">完成率</div>
                    <div className="text-sm font-bold text-card-foreground">
                      {memberLoad
                        ? Math.round((memberLoad.tasksCompleted / memberLoad.tasksTotal) * 100)
                        : 0}
                      %
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
