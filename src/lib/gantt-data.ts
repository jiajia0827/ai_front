export type ProjectStatus = "on-track" | "at-risk" | "off-track"
export type TaskType = "design" | "development" | "testing" | "marketing" | "planning" | "review"

export interface SubTask {
  id: string
  name: string
  assignee: string
  assigneeInitials: string
  progress: number
  type: TaskType
  startDate: string
  endDate: string
}

export interface Project {
  id: string
  name: string
  icon: string
  iconColor: string
  status: ProjectStatus
  assignee: string
  assigneeInitials: string
  progress: number
  risk: "low" | "medium" | "high"
  startDate: string
  endDate: string
  deadline: string
  storyPoints: number
  issues: number
  iteration: string
  iterationDate: string
  subtasks: SubTask[]
}

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  design: "#8B5CF6",
  development: "#3B82F6",
  testing: "#06B6D4",
  marketing: "#F59E0B",
  planning: "#10B981",
  review: "#EC4899",
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  design: "设计",
  development: "开发",
  testing: "测试",
  marketing: "营销",
  planning: "规划",
  review: "评审",
}

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  "on-track": "#10B981",
  "at-risk": "#F59E0B",
  "off-track": "#EF4444",
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  "on-track": "正常",
  "at-risk": "有风险",
  "off-track": "已脱轨",
}

export const RISK_LABELS: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
}

export const projects: Project[] = [
  {
    id: "p1",
    name: "聊天应用开发",
    icon: "聊",
    iconColor: "#6366F1",
    status: "on-track",
    assignee: "陈晓明",
    assigneeInitials: "陈",
    progress: 72,
    risk: "low",
    startDate: "2026-01-05",
    endDate: "2026-03-15",
    deadline: "2026-03-20",
    storyPoints: 89,
    issues: 3,
    iteration: "迭代 6",
    iterationDate: "2026-02-28",
    subtasks: [
      { id: "s1-1", name: "UI 设计与原型", assignee: "李梅", assigneeInitials: "李", progress: 100, type: "design", startDate: "2026-01-05", endDate: "2026-01-25" },
      { id: "s1-2", name: "后端 API 开发", assignee: "张大为", assigneeInitials: "张", progress: 85, type: "development", startDate: "2026-01-15", endDate: "2026-02-28" },
      { id: "s1-3", name: "实时消息功能", assignee: "孙凯", assigneeInitials: "孙", progress: 60, type: "development", startDate: "2026-02-01", endDate: "2026-03-05" },
      { id: "s1-4", name: "集成测试", assignee: "汤博", assigneeInitials: "汤", progress: 30, type: "testing", startDate: "2026-02-15", endDate: "2026-03-15" },
    ],
  },
  {
    id: "p2",
    name: "城市广告投放",
    icon: "广",
    iconColor: "#F59E0B",
    status: "at-risk",
    assignee: "王婷婷",
    assigneeInitials: "王",
    progress: 45,
    risk: "medium",
    startDate: "2026-01-10",
    endDate: "2026-03-30",
    deadline: "2026-03-25",
    storyPoints: 55,
    issues: 7,
    iteration: "第 3 阶段",
    iterationDate: "2026-03-01",
    subtasks: [
      { id: "s2-1", name: "数据分析与任务设置", assignee: "刘敏", assigneeInitials: "刘", progress: 80, type: "planning", startDate: "2026-01-10", endDate: "2026-01-30" },
      { id: "s2-2", name: "精准广告投放", assignee: "赵瑞", assigneeInitials: "赵", progress: 65, type: "marketing", startDate: "2026-01-20", endDate: "2026-02-20" },
      { id: "s2-3", name: "开发与测试", assignee: "陈鹏", assigneeInitials: "陈", progress: 40, type: "development", startDate: "2026-02-10", endDate: "2026-03-05" },
      { id: "s2-4", name: "客户审批", assignee: "王婷", assigneeInitials: "王", progress: 10, type: "review", startDate: "2026-02-25", endDate: "2026-03-10" },
      { id: "s2-5", name: "项目上线", assignee: "马帅", assigneeInitials: "马", progress: 0, type: "marketing", startDate: "2026-03-10", endDate: "2026-03-25" },
      { id: "s2-6", name: "结算与回款", assignee: "安婷", assigneeInitials: "安", progress: 0, type: "review", startDate: "2026-03-20", endDate: "2026-03-30" },
    ],
  },
  {
    id: "p3",
    name: "文件传输应用",
    icon: "传",
    iconColor: "#3B82F6",
    status: "on-track",
    assignee: "林瑞",
    assigneeInitials: "林",
    progress: 58,
    risk: "low",
    startDate: "2026-01-15",
    endDate: "2026-03-20",
    deadline: "2026-03-25",
    storyPoints: 67,
    issues: 2,
    iteration: "迭代 4",
    iterationDate: "2026-02-15",
    subtasks: [
      { id: "s3-1", name: "文件上传模块", assignee: "康磊", assigneeInitials: "康", progress: 90, type: "development", startDate: "2026-01-15", endDate: "2026-02-10" },
      { id: "s3-2", name: "云存储集成", assignee: "宁蕊", assigneeInitials: "宁", progress: 55, type: "development", startDate: "2026-02-01", endDate: "2026-03-01" },
      { id: "s3-3", name: "安全与加密", assignee: "欧文", assigneeInitials: "欧", progress: 30, type: "testing", startDate: "2026-02-15", endDate: "2026-03-20" },
    ],
  },
  {
    id: "p4",
    name: "横幅广告开发",
    icon: "横",
    iconColor: "#10B981",
    status: "on-track",
    assignee: "苏菲",
    assigneeInitials: "苏",
    progress: 82,
    risk: "low",
    startDate: "2026-01-20",
    endDate: "2026-03-25",
    deadline: "2026-03-30",
    storyPoints: 34,
    issues: 1,
    iteration: "迭代 5",
    iterationDate: "2026-02-20",
    subtasks: [
      { id: "s4-1", name: "创意设计", assignee: "黄安妮", assigneeInitials: "黄", progress: 100, type: "design", startDate: "2026-01-20", endDate: "2026-02-05" },
      { id: "s4-2", name: "动效开发", assignee: "贝晨", assigneeInitials: "贝", progress: 75, type: "development", startDate: "2026-02-01", endDate: "2026-03-10" },
    ],
  },
  {
    id: "p5",
    name: "数据仪表盘开发",
    icon: "仪",
    iconColor: "#8B5CF6",
    status: "at-risk",
    assignee: "姜明",
    assigneeInitials: "姜",
    progress: 35,
    risk: "high",
    startDate: "2026-01-25",
    endDate: "2026-04-05",
    deadline: "2026-03-30",
    storyPoints: 120,
    issues: 12,
    iteration: "迭代 3",
    iterationDate: "2026-02-10",
    subtasks: [
      { id: "s5-1", name: "仪表盘布局", assignee: "朱芳", assigneeInitials: "朱", progress: 70, type: "design", startDate: "2026-01-25", endDate: "2026-02-15" },
      { id: "s5-2", name: "数据可视化", assignee: "高伊", assigneeInitials: "高", progress: 40, type: "development", startDate: "2026-02-05", endDate: "2026-03-15" },
      { id: "s5-3", name: "API 集成", assignee: "姜明", assigneeInitials: "姜", progress: 15, type: "development", startDate: "2026-02-20", endDate: "2026-03-30" },
      { id: "s5-4", name: "性能测试", assignee: "莉安", assigneeInitials: "莉", progress: 0, type: "testing", startDate: "2026-03-15", endDate: "2026-04-05" },
    ],
  },
  {
    id: "p6",
    name: "银行安卓应用",
    icon: "银",
    iconColor: "#10B981",
    status: "off-track",
    assignee: "邓晨",
    assigneeInitials: "邓",
    progress: 22,
    risk: "high",
    startDate: "2026-01-12",
    endDate: "2026-04-15",
    deadline: "2026-03-30",
    storyPoints: 145,
    issues: 18,
    iteration: "迭代 2",
    iterationDate: "2026-02-05",
    subtasks: [
      { id: "s6-1", name: "认证模块", assignee: "彭伟", assigneeInitials: "彭", progress: 60, type: "development", startDate: "2026-01-12", endDate: "2026-02-20" },
      { id: "s6-2", name: "交易引擎", assignee: "任娜", assigneeInitials: "任", progress: 25, type: "development", startDate: "2026-02-01", endDate: "2026-03-20" },
      { id: "s6-3", name: "UI/UX 设计", assignee: "沈琪", assigneeInitials: "沈", progress: 50, type: "design", startDate: "2026-01-20", endDate: "2026-02-28" },
      { id: "s6-4", name: "安全审计", assignee: "唐恩", assigneeInitials: "唐", progress: 0, type: "testing", startDate: "2026-03-01", endDate: "2026-04-01" },
      { id: "s6-5", name: "应用商店发布", assignee: "邓晨", assigneeInitials: "邓", progress: 0, type: "review", startDate: "2026-04-01", endDate: "2026-04-15" },
    ],
  },
  {
    id: "p7",
    name: "官网开发",
    icon: "官",
    iconColor: "#EF4444",
    status: "on-track",
    assignee: "卢斌",
    assigneeInitials: "卢",
    progress: 65,
    risk: "low",
    startDate: "2026-01-18",
    endDate: "2026-03-10",
    deadline: "2026-03-15",
    storyPoints: 78,
    issues: 4,
    iteration: "迭代 5",
    iterationDate: "2026-02-20",
    subtasks: [
      { id: "s7-1", name: "前端开发", assignee: "郭辉", assigneeInitials: "郭", progress: 80, type: "development", startDate: "2026-01-18", endDate: "2026-02-25" },
      { id: "s7-2", name: "CMS 集成", assignee: "何杰", assigneeInitials: "何", progress: 50, type: "development", startDate: "2026-02-10", endDate: "2026-03-10" },
    ],
  },
  {
    id: "p8",
    name: "电商平台",
    icon: "电",
    iconColor: "#EC4899",
    status: "at-risk",
    assignee: "张敏",
    assigneeInitials: "张",
    progress: 40,
    risk: "medium",
    startDate: "2026-02-01",
    endDate: "2026-04-20",
    deadline: "2026-04-15",
    storyPoints: 200,
    issues: 9,
    iteration: "迭代 2",
    iterationDate: "2026-02-25",
    subtasks: [
      { id: "s8-1", name: "商品目录", assignee: "诺拉", assigneeInitials: "诺", progress: 70, type: "development", startDate: "2026-02-01", endDate: "2026-03-01" },
      { id: "s8-2", name: "购物车", assignee: "欧磊", assigneeInitials: "欧", progress: 45, type: "development", startDate: "2026-02-15", endDate: "2026-03-20" },
      { id: "s8-3", name: "支付网关", assignee: "张敏", assigneeInitials: "张", progress: 20, type: "development", startDate: "2026-03-01", endDate: "2026-04-05" },
      { id: "s8-4", name: "订单管理", assignee: "秦瑞", assigneeInitials: "秦", progress: 0, type: "development", startDate: "2026-03-20", endDate: "2026-04-20" },
    ],
  },
]
