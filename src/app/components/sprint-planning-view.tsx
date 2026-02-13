"use client"

import {
  ComposedChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
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
  sprintHistory,
  memberSprintHistory,
  planningRecommendation,
  teamMembers,
  memberSprintTrends,
  memberRadarData,
} from "@/lib/scrum-data"
import { TrendingUp, Target, Zap, Info } from "lucide-react"

const memberColors = [
  "hsl(210, 40%, 62%)",
  "hsl(16, 52%, 68%)",
  "hsl(155, 32%, 58%)",
  "hsl(350, 45%, 65%)",
  "hsl(260, 28%, 68%)",
]

export function SprintPlanningUpperChart() {
  const data = sprintHistory.map((s) => ({
    ...s,
    remainingRate: 100 - s.burndownRate,
  }))

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-card-foreground">
            Sprint 燃尽率历史对比
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            近 6 个 Sprint 完成率 / 总故事点对比
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground border-transparent hover:bg-primary/90">
            <TrendingUp className="mr-1 h-3 w-3" />
            平均速率 {planningRecommendation.avgVelocity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} barGap={4} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(30, 16%, 88%)" />
              <XAxis dataKey="sprint" tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }}
                label={{
                  value: "故事点",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "hsl(220, 10%, 48%)", fontSize: 11 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }}
                label={{
                  value: "燃尽率 %",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "hsl(220, 10%, 48%)", fontSize: 11 },
                }}
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
              <ReferenceLine
                yAxisId="left"
                y={planningRecommendation.suggestedCapacity}
                stroke="hsl(16, 52%, 68%)"
                strokeDasharray="6 4"
                label={{
                  value: `建议容量: ${planningRecommendation.suggestedCapacity}`,
                  position: "top",
                  fill: "hsl(16, 52%, 68%)",
                  fontSize: 11,
                }}
              />
              <Bar yAxisId="left" dataKey="completedPoints" name="已完成故事点" fill="hsl(210, 40%, 62%)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="totalPoints" name="总故事点" fill="hsl(16, 52%, 68%)" radius={[4, 4, 0, 0]} opacity={0.5} />
              <Line yAxisId="right" type="monotone" dataKey="burndownRate" name="燃尽率 %" stroke="hsl(155, 32%, 58%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(155, 32%, 58%)" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendation Banner */}
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm text-card-foreground mb-1">本次 Sprint 建议容量</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-card-foreground">
                  建议总故事点 = <strong className="text-primary text-lg">{planningRecommendation.suggestedCapacity}</strong>
                </span>
                <span className="text-muted-foreground">平均速率: {planningRecommendation.avgVelocity}</span>
                <span className="text-muted-foreground">平均燃尽率: {planningRecommendation.avgBurndownRate}%</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                <Info className="h-3 w-3" />
                {planningRecommendation.riskNote}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SprintPlanningLowerChart() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-card-foreground">
            成员负载历史对比
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            各成员近 6 Sprint 故事点趋势、速率与产能雷达
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-xs text-muted-foreground">人均故事点参考线</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top: Line Chart + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Line Chart */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-medium text-card-foreground mb-3">成员故事点趋势</h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={memberSprintHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(30, 16%, 88%)" />
                  <XAxis dataKey="sprint" tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 12 }}
                    label={{ value: "故事点", angle: -90, position: "insideLeft", style: { fill: "hsl(220, 10%, 48%)", fontSize: 11 } }}
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
                  <ReferenceLine
                    y={7.6}
                    stroke="hsl(260, 28%, 68%)"
                    strokeDasharray="4 4"
                    label={{ value: "人均 7.6", position: "right", fill: "hsl(260, 28%, 68%)", fontSize: 11 }}
                  />
                  {teamMembers.map((member, i) => (
                    <Line
                      key={member.name}
                      type="monotone"
                      dataKey={member.name}
                      stroke={memberColors[i]}
                      strokeWidth={2}
                      dot={{ r: 3, fill: memberColors[i] }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium text-card-foreground mb-3">产能评估雷达</h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={memberRadarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(30, 16%, 88%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(220, 10%, 48%)", fontSize: 11 }} />
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
        </div>

        {/* Member rows with sparkline area charts */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">成员 Sprint 历史走势</h4>
          <div className="space-y-3">
            {memberSprintTrends.map((m, idx) => (
              <div
                key={m.member}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
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
                  <span className="font-medium text-sm text-card-foreground block">{m.member}</span>
                  <span className="text-xs font-semibold" style={{ color: memberColors[idx] }}>
                    均 {m.avgPoints} 点
                  </span>
                </div>

                {/* Sparkline Area Chart */}
                <div className="flex-1 h-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={m.trend}>
                      <defs>
                        <linearGradient id={`grad-plan-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={memberColors[idx]} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={memberColors[idx]} stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="points"
                        stroke={memberColors[idx]}
                        strokeWidth={2}
                        fill={`url(#grad-plan-${idx})`}
                      />
                      <Area
                        type="monotone"
                        dataKey="velocity"
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
                          name === "points" ? "故事点" : "速率",
                        ]}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Mini stats */}
                <div className="w-20 text-right shrink-0">
                  <div className="text-xs text-muted-foreground">建议分配</div>
                  <div className="text-sm font-bold text-card-foreground">
                    {Math.round(m.avgPoints * (planningRecommendation.suggestedCapacity / 38))} 点
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
