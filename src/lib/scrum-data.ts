// ==================== Types ====================
export type ViewMode = "daily" | "planning" | "retro"

export interface TeamMember {
  id: string
  name: string
  initials: string
  avatar?: string
}

export interface TaskStatus {
  day: string
  completed: number
  inProgress: number
  blocked: number
  todo: number
}

export interface MemberLoad {
  member: string
  storyPoints: number
  tasksCompleted: number
  tasksTotal: number
  blockedHours: number
}

export interface SprintHistory {
  sprint: string
  burndownRate: number
  totalPoints: number
  completedPoints: number
  velocity: number
}

export interface MemberSprintHistory {
  sprint: string
  [member: string]: number | string
}

export interface P0Trend {
  sprint: string
  completionRate: number
  blockRate: number
  avgResolutionDays: number
}

export interface MemberBalance {
  member: string
  loadScore: number
  blockedHours: number
  avgPointsPerSprint: number
}

// ==================== Team Members ====================
export const teamMembers: TeamMember[] = [
  { id: "1", name: "张伟", initials: "ZW" },
  { id: "2", name: "李娜", initials: "LN" },
  { id: "3", name: "王磊", initials: "WL" },
  { id: "4", name: "赵敏", initials: "ZM" },
  { id: "5", name: "陈刚", initials: "CG" },
]

// ==================== Daily Standup Data ====================
export const dailyTaskStatus: TaskStatus[] = [
  { day: "周一", completed: 5, inProgress: 8, blocked: 2, todo: 12 },
  { day: "周二", completed: 8, inProgress: 7, blocked: 3, todo: 9 },
  { day: "周三", completed: 11, inProgress: 6, blocked: 1, todo: 7 },
  { day: "周四", completed: 14, inProgress: 5, blocked: 2, todo: 4 },
  { day: "周五", completed: 18, inProgress: 3, blocked: 1, todo: 3 },
  { day: "周六", completed: 20, inProgress: 2, blocked: 0, todo: 2 },
  { day: "周日(今日)", completed: 22, inProgress: 2, blocked: 1, todo: 1 },
]

export const dailyMemberLoad: MemberLoad[] = [
  { member: "张伟", storyPoints: 8, tasksCompleted: 4, tasksTotal: 6, blockedHours: 2 },
  { member: "李娜", storyPoints: 10, tasksCompleted: 5, tasksTotal: 7, blockedHours: 0 },
  { member: "王磊", storyPoints: 6, tasksCompleted: 2, tasksTotal: 5, blockedHours: 4 },
  { member: "赵敏", storyPoints: 9, tasksCompleted: 5, tasksTotal: 6, blockedHours: 1 },
  { member: "陈刚", storyPoints: 7, tasksCompleted: 3, tasksTotal: 5, blockedHours: 3 },
]

export const dailyAlerts = {
  topBlockedMember: "王磊",
  topBlockedReason: "等待后端 API 接口完成",
  blockedHours: 4,
  p0UnfinishedMembers: ["王磊", "陈刚"],
  p0UnfinishedTasks: 3,
}

// ==================== Sprint Planning Data ====================
export const sprintHistory: SprintHistory[] = [
  { sprint: "Sprint 18", burndownRate: 82, totalPoints: 45, completedPoints: 37, velocity: 37 },
  { sprint: "Sprint 19", burndownRate: 75, totalPoints: 50, completedPoints: 38, velocity: 38 },
  { sprint: "Sprint 20", burndownRate: 90, totalPoints: 42, completedPoints: 38, velocity: 38 },
  { sprint: "Sprint 21", burndownRate: 68, totalPoints: 55, completedPoints: 37, velocity: 37 },
  { sprint: "Sprint 22", burndownRate: 85, totalPoints: 48, completedPoints: 41, velocity: 41 },
  { sprint: "Sprint 23", burndownRate: 78, totalPoints: 46, completedPoints: 36, velocity: 36 },
]

export const memberSprintHistory: MemberSprintHistory[] = [
  { sprint: "Sprint 18", 张伟: 8, 李娜: 10, 王磊: 7, 赵敏: 6, 陈刚: 6 },
  { sprint: "Sprint 19", 张伟: 9, 李娜: 11, 王磊: 6, 赵敏: 7, 陈刚: 5 },
  { sprint: "Sprint 20", 张伟: 8, 李娜: 9, 王磊: 8, 赵敏: 7, 陈刚: 6 },
  { sprint: "Sprint 21", 张伟: 10, 李娜: 12, 王磊: 5, 赵敏: 6, 陈刚: 4 },
  { sprint: "Sprint 22", 张伟: 9, 李娜: 10, 王磊: 8, 赵敏: 8, 陈刚: 6 },
  { sprint: "Sprint 23", 张伟: 7, 李娜: 9, 王磊: 7, 赵敏: 7, 陈刚: 6 },
]

export const planningRecommendation = {
  suggestedCapacity: 40,
  avgVelocity: 37.8,
  avgBurndownRate: 79.7,
  riskNote: "上一 Sprint 燃尽率偏低 (78%)，建议适当降低容量",
}

// ==================== Sprint Retro Data ====================
export const p0Trends: P0Trend[] = [
  { sprint: "Sprint 18", completionRate: 85, blockRate: 15, avgResolutionDays: 1.5 },
  { sprint: "Sprint 19", completionRate: 78, blockRate: 22, avgResolutionDays: 2.1 },
  { sprint: "Sprint 20", completionRate: 92, blockRate: 8, avgResolutionDays: 0.8 },
  { sprint: "Sprint 21", completionRate: 70, blockRate: 30, avgResolutionDays: 2.8 },
  { sprint: "Sprint 22", completionRate: 88, blockRate: 12, avgResolutionDays: 1.2 },
  { sprint: "Sprint 23", completionRate: 80, blockRate: 20, avgResolutionDays: 1.9 },
]

export const memberBalance: MemberBalance[] = [
  { member: "张伟", loadScore: 85, blockedHours: 6, avgPointsPerSprint: 8.5 },
  { member: "李娜", loadScore: 95, blockedHours: 3, avgPointsPerSprint: 10.2 },
  { member: "王磊", loadScore: 65, blockedHours: 14, avgPointsPerSprint: 6.8 },
  { member: "赵敏", loadScore: 78, blockedHours: 8, avgPointsPerSprint: 6.8 },
  { member: "陈刚", loadScore: 60, blockedHours: 12, avgPointsPerSprint: 5.5 },
]

export const retroConclusions = [
  { reason: "需求不清晰", percentage: 45, color: "hsl(var(--chart-4))" },
  { reason: "技术依赖阻塞", percentage: 25, color: "hsl(var(--chart-2))" },
  { reason: "测试环境不稳定", percentage: 18, color: "hsl(var(--chart-1))" },
  { reason: "其他原因", percentage: 12, color: "hsl(var(--chart-5))" },
]

// ==================== Per-member daily sparkline data ====================
export interface MemberDailyTrend {
  member: string
  totalPoints: number
  trend: { day: string; completed: number; load: number }[]
}

export const memberDailyTrends: MemberDailyTrend[] = [
  {
    member: "张伟",
    totalPoints: 8,
    trend: [
      { day: "周一", completed: 0, load: 5 },
      { day: "周二", completed: 1, load: 6 },
      { day: "周三", completed: 2, load: 7 },
      { day: "周四", completed: 3, load: 8 },
      { day: "周五", completed: 4, load: 8 },
      { day: "周六", completed: 4, load: 8 },
      { day: "今日", completed: 4, load: 8 },
    ],
  },
  {
    member: "李娜",
    totalPoints: 10,
    trend: [
      { day: "周一", completed: 1, load: 7 },
      { day: "周二", completed: 2, load: 8 },
      { day: "周三", completed: 3, load: 9 },
      { day: "周四", completed: 4, load: 9 },
      { day: "周五", completed: 5, load: 10 },
      { day: "周六", completed: 5, load: 10 },
      { day: "今日", completed: 5, load: 10 },
    ],
  },
  {
    member: "王磊",
    totalPoints: 6,
    trend: [
      { day: "周一", completed: 0, load: 4 },
      { day: "周二", completed: 0, load: 4 },
      { day: "周三", completed: 1, load: 5 },
      { day: "周四", completed: 1, load: 5 },
      { day: "周五", completed: 2, load: 6 },
      { day: "周六", completed: 2, load: 6 },
      { day: "今日", completed: 2, load: 6 },
    ],
  },
  {
    member: "赵敏",
    totalPoints: 9,
    trend: [
      { day: "周一", completed: 1, load: 6 },
      { day: "周二", completed: 2, load: 7 },
      { day: "周三", completed: 3, load: 8 },
      { day: "周四", completed: 4, load: 8 },
      { day: "周五", completed: 5, load: 9 },
      { day: "周六", completed: 5, load: 9 },
      { day: "今日", completed: 5, load: 9 },
    ],
  },
  {
    member: "陈刚",
    totalPoints: 7,
    trend: [
      { day: "周一", completed: 0, load: 3 },
      { day: "周二", completed: 1, load: 4 },
      { day: "周三", completed: 1, load: 5 },
      { day: "周四", completed: 2, load: 6 },
      { day: "周五", completed: 3, load: 7 },
      { day: "周六", completed: 3, load: 7 },
      { day: "今日", completed: 3, load: 7 },
    ],
  },
]

// ==================== Radar chart data ====================
export interface MemberRadar {
  subject: string
  [member: string]: number | string
}

export const memberRadarData: MemberRadar[] = [
  { subject: "产出", 张伟: 80, 李娜: 95, 王磊: 60, 赵敏: 75, 陈刚: 55 },
  { subject: "质量", 张伟: 85, 李娜: 90, 王磊: 70, 赵敏: 80, 陈刚: 65 },
  { subject: "响应", 张伟: 75, 李娜: 88, 王磊: 55, 赵敏: 82, 陈刚: 60 },
  { subject: "协作", 张伟: 90, 李娜: 85, 王磊: 72, 赵敏: 78, 陈刚: 68 },
  { subject: "稳定性", 张伟: 82, 李娜: 92, 王磊: 58, 赵敏: 76, 陈刚: 50 },
]

// ==================== Task distribution pie data ====================
export const taskDistribution = [
  { name: "已完成", value: 22, color: "hsl(var(--chart-3))" },
  { name: "进行中", value: 2, color: "hsl(var(--chart-1))" },
  { name: "已阻塞", value: 1, color: "hsl(var(--chart-4))" },
  { name: "待处理", value: 1, color: "hsl(var(--chart-5))" },
]

// ==================== Member sprint sparkline data (for planning) ====================
export interface MemberSprintTrend {
  member: string
  avgPoints: number
  trend: { sprint: string; points: number; velocity: number }[]
}

export const memberSprintTrends: MemberSprintTrend[] = [
  {
    member: "张伟",
    avgPoints: 8.5,
    trend: [
      { sprint: "S18", points: 8, velocity: 7 },
      { sprint: "S19", points: 9, velocity: 8 },
      { sprint: "S20", points: 8, velocity: 8 },
      { sprint: "S21", points: 10, velocity: 9 },
      { sprint: "S22", points: 9, velocity: 9 },
      { sprint: "S23", points: 7, velocity: 7 },
    ],
  },
  {
    member: "李娜",
    avgPoints: 10.2,
    trend: [
      { sprint: "S18", points: 10, velocity: 10 },
      { sprint: "S19", points: 11, velocity: 10 },
      { sprint: "S20", points: 9, velocity: 9 },
      { sprint: "S21", points: 12, velocity: 11 },
      { sprint: "S22", points: 10, velocity: 10 },
      { sprint: "S23", points: 9, velocity: 9 },
    ],
  },
  {
    member: "王磊",
    avgPoints: 6.8,
    trend: [
      { sprint: "S18", points: 7, velocity: 5 },
      { sprint: "S19", points: 6, velocity: 5 },
      { sprint: "S20", points: 8, velocity: 7 },
      { sprint: "S21", points: 5, velocity: 4 },
      { sprint: "S22", points: 8, velocity: 7 },
      { sprint: "S23", points: 7, velocity: 6 },
    ],
  },
  {
    member: "赵敏",
    avgPoints: 6.8,
    trend: [
      { sprint: "S18", points: 6, velocity: 6 },
      { sprint: "S19", points: 7, velocity: 6 },
      { sprint: "S20", points: 7, velocity: 7 },
      { sprint: "S21", points: 6, velocity: 5 },
      { sprint: "S22", points: 8, velocity: 8 },
      { sprint: "S23", points: 7, velocity: 7 },
    ],
  },
  {
    member: "陈刚",
    avgPoints: 5.5,
    trend: [
      { sprint: "S18", points: 6, velocity: 5 },
      { sprint: "S19", points: 5, velocity: 4 },
      { sprint: "S20", points: 6, velocity: 6 },
      { sprint: "S21", points: 4, velocity: 3 },
      { sprint: "S22", points: 6, velocity: 5 },
      { sprint: "S23", points: 6, velocity: 5 },
    ],
  },
]

// ==================== Member retro sparkline data ====================
export interface MemberRetroTrend {
  member: string
  totalBlocked: number
  trend: { sprint: string; blocked: number; quality: number }[]
}

export const memberRetroTrends: MemberRetroTrend[] = [
  {
    member: "张伟",
    totalBlocked: 6,
    trend: [
      { sprint: "S18", blocked: 1, quality: 88 },
      { sprint: "S19", blocked: 0, quality: 92 },
      { sprint: "S20", blocked: 2, quality: 80 },
      { sprint: "S21", blocked: 1, quality: 85 },
      { sprint: "S22", blocked: 1, quality: 87 },
      { sprint: "S23", blocked: 1, quality: 84 },
    ],
  },
  {
    member: "李娜",
    totalBlocked: 3,
    trend: [
      { sprint: "S18", blocked: 0, quality: 95 },
      { sprint: "S19", blocked: 1, quality: 90 },
      { sprint: "S20", blocked: 0, quality: 96 },
      { sprint: "S21", blocked: 1, quality: 88 },
      { sprint: "S22", blocked: 0, quality: 94 },
      { sprint: "S23", blocked: 1, quality: 91 },
    ],
  },
  {
    member: "王磊",
    totalBlocked: 14,
    trend: [
      { sprint: "S18", blocked: 2, quality: 68 },
      { sprint: "S19", blocked: 3, quality: 60 },
      { sprint: "S20", blocked: 1, quality: 75 },
      { sprint: "S21", blocked: 4, quality: 55 },
      { sprint: "S22", blocked: 2, quality: 70 },
      { sprint: "S23", blocked: 2, quality: 65 },
    ],
  },
  {
    member: "赵敏",
    totalBlocked: 8,
    trend: [
      { sprint: "S18", blocked: 1, quality: 80 },
      { sprint: "S19", blocked: 2, quality: 75 },
      { sprint: "S20", blocked: 1, quality: 82 },
      { sprint: "S21", blocked: 2, quality: 72 },
      { sprint: "S22", blocked: 1, quality: 80 },
      { sprint: "S23", blocked: 1, quality: 78 },
    ],
  },
  {
    member: "陈刚",
    totalBlocked: 12,
    trend: [
      { sprint: "S18", blocked: 2, quality: 65 },
      { sprint: "S19", blocked: 2, quality: 62 },
      { sprint: "S20", blocked: 1, quality: 70 },
      { sprint: "S21", blocked: 3, quality: 55 },
      { sprint: "S22", blocked: 2, quality: 64 },
      { sprint: "S23", blocked: 2, quality: 60 },
    ],
  },
]
