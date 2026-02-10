import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface MeetingDecision {
  id: string;
  text: string;
  type: 'decision' | 'action' | 'note';
}

export interface MeetingUpdate {
  id: string;
  memberId: string;
  time: string;
  yesterdayWork: string;
  todayPlan: string;
  blocker?: string;
  progress: number; // 0-100
  status: 'done' | 'in-progress' | 'blocked';
}

export interface DailyStandup {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  attendees: string[]; // member IDs
  decisions: MeetingDecision[];
  updates: MeetingUpdate[];
  efficiencyScore: number;
  blockerCount: number;
  taskStats: {
    done: number;
    inProgress: number;
    blocked: number;
  };
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: string;
  title: string;
  description?: string;
  speaker?: { name: string; avatar: string };
  progress?: number;
  decision?: string;
  tags?: string[];
}

// Radar chart data
export const radarData = [
  { subject: '进度', A: 120, B: 110, fullMark: 150 },
  { subject: '质量', A: 98, B: 130, fullMark: 150 },
  { subject: '协作', A: 86, B: 130, fullMark: 150 },
  { subject: '沟通', A: 99, B: 100, fullMark: 150 },
  { subject: '风险', A: 85, B: 90, fullMark: 150 },
  { subject: '创新', A: 65, B: 85, fullMark: 150 },
];

// Trend chart data
export const trendData = [
  { name: '周一', value: 65 },
  { name: '周二', value: 75 },
  { name: '周三', value: 60 },
  { name: '周四', value: 85 },
  { name: '周五', value: 90 },
  { name: '周六', value: 40 },
  { name: '周日', value: 30 },
];

export const members: TeamMember[] = [
  { id: '1', name: '陈亚历', role: '前端组长', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop' },
  { id: '2', name: '张莎拉', role: '产品经理', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop' },
  { id: '3', name: '罗斯', role: '后端开发', avatar: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=150&h=150&fit=crop' },
  { id: '4', name: '王艾米', role: '测试工程师', avatar: 'https://images.unsplash.com/photo-1752860872185-78926b52ef77?w=150&h=150&fit=crop' },
  { id: '5', name: '金大卫', role: '全栈开发', avatar: 'https://images.unsplash.com/photo-1724128195190-19cb7082a511?w=150&h=150&fit=crop' },
  { id: '6', name: 'Lisa Pat', role: 'UI设计师', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TASKS_YESTERDAY = ['完成用户登录页面', '修复 API 鉴权 Bug', '设计新的首页 UI', '编写自动化测试脚本', '调研 WebSocket 方案', '优化数据库索引'];
const TASKS_TODAY = ['对接支付接口', '代码 Code Review', '更新设计规范文档', '执行集成测试', '部署预发布环境', '编写 API 文档'];

export function generateMonthData(currentDate: Date): DailyStandup[] {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  return days.map(day => {
    const isWeekend = getDay(day) === 0 || getDay(day) === 6;
    if (isWeekend) return null; // No meetings on weekends

    // Randomize meeting data
    const hasMeeting = Math.random() > 0.1; // 90% chance of meeting
    if (!hasMeeting) return null;

    const duration = getRandomInt(15, 45);
    const updates: MeetingUpdate[] = members.map(m => ({
      id: Math.random().toString(36).substr(2, 9),
      memberId: m.id,
      time: `09:${getRandomInt(0, duration).toString().padStart(2, '0')}`,
      yesterdayWork: TASKS_YESTERDAY[getRandomInt(0, 5)],
      todayPlan: TASKS_TODAY[getRandomInt(0, 5)],
      progress: getRandomInt(20, 100),
      status: Math.random() > 0.8 ? 'blocked' : (Math.random() > 0.5 ? 'done' : 'in-progress'),
      blocker: Math.random() > 0.8 ? '等待后端 API 接口返回 500 错误' : undefined
    }));

    const blockerCount = updates.filter(u => u.status === 'blocked').length;
    const taskStats = {
      done: updates.filter(u => u.status === 'done').length,
      inProgress: updates.filter(u => u.status === 'in-progress').length,
      blocked: blockerCount
    };

    return {
      id: format(day, 'yyyy-MM-dd'),
      date: day,
      startTime: '09:00',
      endTime: `09:${duration}`,
      duration,
      attendees: members.map(m => m.id),
      decisions: [
        { id: '1', text: '周五发布到预发布环境', type: 'decision' },
        { id: '2', text: '更新接口文档', type: 'action' }
      ],
      updates,
      efficiencyScore: getRandomInt(70, 98),
      blockerCount,
      taskStats
    };
  }).filter(Boolean) as DailyStandup[];
}
