import svgPaths from "../imports/svg-zewkv04mtb";
const imgEllipse6 = "https://i.pravatar.cc/150?img=1";
const imgEllipse7 = "https://i.pravatar.cc/150?img=5";
const imgEllipse8 = "https://i.pravatar.cc/150?img=12";
const imgEllipse9 = "https://i.pravatar.cc/150?img=33";
const imgEllipse10 = "https://i.pravatar.cc/150?img=47";
import { Search, Bell, CheckCircle2, Clock, AlertCircle, PlayCircle, GitPullRequest, Calendar, ArrowRight, Code, Coffee, Bug, Zap, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";

// Logo Component
function Logo() {
  return (
    <div className="relative shrink-0 size-[49.321px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
        <g>
          <circle cx="24.6606" cy="24.6606" fill="white" r="24.6606" />
          <g>
            <mask fill="white" id="path-2-inside-1_1_1742">
              <path d={svgPaths.p13635700} />
            </mask>
            <path d={svgPaths.p13635700} mask="url(#path-2-inside-1_1_1742)" stroke="#175CD3" strokeWidth="7.58786" />
          </g>
          <g>
            <mask fill="white" id="path-3-inside-2_1_1742">
              <path d={svgPaths.p1ae3cb00} />
            </mask>
            <path d={svgPaths.p1ae3cb00} mask="url(#path-3-inside-2_1_1742)" stroke="#296FEA" strokeWidth="7.58786" />
          </g>
          <g>
            <mask fill="white" id="path-4-inside-3_1_1742">
              <path d={svgPaths.p3c934600} />
            </mask>
            <path d={svgPaths.p3c934600} mask="url(#path-4-inside-3_1_1742)" stroke="#4788ED" strokeWidth="7.58786" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// Statistics Card Component
function StatCard({ title, value, subtitle, subtitleColor, iconColor, iconPath }: {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor: string;
  iconColor: string;
  iconPath: string;
}) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-xl font-medium text-gray-900 mb-1">{value}</p>
          <p className={`text-xs ${subtitleColor}`}>{subtitle}</p>
        </div>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}26` }}
        >
          <svg className="w-5 h-5" fill={iconColor} viewBox="0 0 47 47">
            <path d={iconPath} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Activity Icon Component - 保留原来的图标样式
function ActivityIcon({ 
  type, 
  isWarning = false, 
  size = "sm", 
  onClick 
}: { 
  type: 'done' | 'in-progress' | 'todo' | 'blocked' | 'review' | 'start', 
  isWarning?: boolean,
  size?: "xs" | "sm" | "md",
  onClick?: () => void
}) {
  const getIcon = () => {
    const iconSize = size === "xs" ? "w-2 h-2" : size === "sm" ? "w-3 h-3" : "w-4 h-4";
    switch (type) {
      case 'done':
        return <CheckCircle2 className={iconSize} />;
      case 'in-progress':
        return <PlayCircle className={iconSize} />;
      case 'todo':
        return <Clock className={iconSize} />;
      case 'blocked':
        return <AlertCircle className={iconSize} />;
      case 'review':
        return <GitPullRequest className={iconSize} />;
      case 'start':
        return <Zap className={iconSize} />;
      default:
        return <Clock className={iconSize} />;
    }
  };

  const getColor = () => {
    if (isWarning) return 'bg-red-500 border-red-300 hover:bg-red-600';
    switch (type) {
      case 'done':
        return 'bg-green-500 border-green-300 hover:bg-green-600';
      case 'in-progress':
        return 'bg-yellow-500 border-yellow-300 hover:bg-yellow-600';
      case 'todo':
        return 'bg-blue-500 border-blue-300 hover:bg-blue-600';
      case 'blocked':
        return 'bg-red-500 border-red-300 hover:bg-red-600';
      case 'review':
        return 'bg-purple-500 border-purple-300 hover:bg-purple-600';
      case 'start':
        return 'bg-cyan-500 border-cyan-300 hover:bg-cyan-600';
      default:
        return 'bg-gray-500 border-gray-300 hover:bg-gray-600';
    }
  };

  const iconSize = size === "xs" ? "w-5 h-5" : size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const warningSize = size === "xs" ? "w-2 h-2" : size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <div 
      className={`relative ${iconSize} ${getColor()} rounded-full flex items-center justify-center text-white border shadow-sm cursor-pointer transition-colors`}
      onClick={onClick}
    >
      {getIcon()}
      {isWarning && (
        <div className={`absolute -top-0.5 -right-0.5 ${warningSize} bg-orange-500 rounded-full flex items-center justify-center`}>
          <AlertCircle className="w-1.5 h-1.5 text-white" />
        </div>
      )}
    </div>
  );
}

// Activity Modal Component - 修改为任务详情
function ActivityModal({ 
  isOpen, 
  onClose, 
  activity, 
  member, 
  allActivities 
}: { 
  isOpen: boolean;
  onClose: () => void;
  activity: any;
  member: any;
  allActivities: any[];
}) {
  if (!activity || !member) return null;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'todo':
        return <Clock className="w-4 h-4" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4" />;
      case 'review':
        return <GitPullRequest className="w-4 h-4" />;
      case 'start':
        return <Zap className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string, isWarning: boolean = false) => {
    if (isWarning) return 'text-red-500 bg-red-50';
    switch (type) {
      case 'done':
        return 'text-green-500 bg-green-50';
      case 'in-progress':
        return 'text-yellow-500 bg-yellow-50';
      case 'todo':
        return 'text-blue-500 bg-blue-50';
      case 'blocked':
        return 'text-red-500 bg-red-50';
      case 'review':
        return 'text-purple-500 bg-purple-50';
      case 'start':
        return 'text-cyan-500 bg-cyan-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusLabel = (type: string) => {
    switch (type) {
      case 'done':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'todo':
        return 'To Do';
      case 'blocked':
        return 'Blocked';
      case 'review':
        return 'In Review';
      case 'start':
        return 'Started';
      default:
        return type;
    }
  };

  // Get activities from same day for context
  const dayActivities = allActivities
    .filter(act => act.day === activity.day)
    .sort((a, b) => a.hour - b.hour);

  // Get activities before and after for thread context
  const threadActivities = allActivities
    .sort((a, b) => a.day - b.day || a.hour - b.hour)
    .slice(Math.max(0, allActivities.findIndex(act => act === activity) - 2), 
           allActivities.findIndex(act => act === activity) + 3);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full ring-2 ring-blue-100" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{activity.taskTitle}</span>
                <Badge className={`${getActivityColor(activity.type)} border`}>
                  {getActivityIcon(activity.type)}
                  <span className="ml-1">{getStatusLabel(activity.type)}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-500 font-normal mt-0.5">
                {member.name} • {member.role}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* 任务概览 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600" />
                任务详情
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">任务ID</p>
                  <p className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border border-blue-200 inline-block">
                    {activity.taskId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">描述</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>
                </div>
                {activity.tags && activity.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">标签</p>
                    <div className="flex flex-wrap gap-2">
                      {activity.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 任务指标 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-500">预估工时</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activity.estimatedHours || 0}h</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-gray-500">实际工时</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activity.actualHours || 0}h</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-500">完成度</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold text-gray-900">{activity.completionPercent || 0}%</div>
                  <Progress value={activity.completionPercent || 0} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* 成员信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">负责人信息</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">Sprint: {member.sprint}</p>
                    <p className="text-xs text-gray-600">团队: {member.team}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">任务统计</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">总任务数</span>
                    <span className="font-medium text-gray-900">{member.totalTasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">已完成</span>
                    <span className="font-medium text-green-600">{member.completedTasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">进行中</span>
                    <span className="font-medium text-yellow-600">{member.inProgressTasks}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">完成率</span>
                      <span className="font-bold text-blue-600">{member.completionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Same Day Activities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                当日任务活动
              </h4>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {dayActivities.map((act, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-3 rounded-lg border ${act === activity ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(act.type, act.isWarning)}`}>
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-900">{act.taskTitle}</span>
                          <span className="text-xs text-gray-400">{act.time}</span>
                          {act.isWarning && <AlertCircle className="w-3 h-3 text-orange-500" />}
                        </div>
                        <p className="text-xs text-gray-600">{act.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">by {act.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Activity Timeline */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                活动时间线
              </h4>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {threadActivities.map((act, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 p-3 rounded-lg ${act === activity ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(act.type, act.isWarning)} mt-1`}>
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">{act.taskTitle}</span>
                          <Badge variant="outline" className="text-xs">
                            {getStatusLabel(act.type)}
                          </Badge>
                          <span className="text-xs text-gray-400">Day {act.day + 1}</span>
                          <span className="text-xs text-gray-400">{act.time}</span>
                          {act.isWarning && <AlertCircle className="w-3 h-3 text-orange-500" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{act.description}</p>
                        <p className="text-xs text-gray-400">by {act.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Smart positioning function to prevent overlaps - 保留原来的定位算法
function calculateActivityPositions(activities: any[], dayIndex: number) {
  const dayActivities = activities.filter(activity => activity.day === dayIndex);
  if (dayActivities.length === 0) return [];

  const sortedActivities = dayActivities.sort((a, b) => a.hour - b.hour);
  
  const positionedActivities = sortedActivities.map((activity, index) => {
    const hourPosition = ((activity.hour - 9) / 12) * 100;
    
    let verticalOffset = 0;
    for (let i = 0; i < index; i++) {
      const prevActivity = sortedActivities[i];
      const prevHourPosition = ((prevActivity.hour - 9) / 12) * 100;
      
      if (Math.abs(hourPosition - prevHourPosition) < 10) {
        verticalOffset = Math.max(verticalOffset, (i + 1) * 25);
      }
    }
    
    return {
      ...activity,
      horizontalPosition: hourPosition,
      verticalPosition: Math.min(verticalOffset, 50)
    };
  });

  return positionedActivities;
}

export default function App({ onBack }: { onBack?: () => void }) {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extended timeline - 3 weeks of data
  const generateTimeline = () => {
    const timeline = [];
    const startDate = new Date('2026-02-11');
    
    for (let i = 0; i < 21; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      timeline.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString(),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayIndex: i
      });
    }
    return timeline;
  };

  const timelineDays = generateTimeline();

  // 团队成员和他们的任务活动
  const members = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "前端开发工程师",
      team: "产品研发一组",
      sprint: "Sprint 12",
      avatar: imgEllipse6,
      statusColor: "#00891E",
      totalTasks: 5,
      completedTasks: 3,
      inProgressTasks: 2,
      completionRate: 60,
      activities: [
        { 
          day: 0, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-101', taskTitle: '用户认证模块开发',
          description: '开始开发JWT认证系统，包含登录、注册、token刷新功能', 
          author: 'Sarah Chen',
          estimatedHours: 16, actualHours: 0, completionPercent: 0,
          tags: ['前端', '认证', 'React']
        },
        { 
          day: 0, hour: 15, type: 'in-progress', time: '3:00 PM', 
          taskId: 'TASK-101', taskTitle: '用户认证模块开发',
          description: '完成登录页面UI和表单验证逻辑', 
          author: 'Sarah Chen',
          estimatedHours: 16, actualHours: 6, completionPercent: 35,
          tags: ['前端', '认证', 'React']
        },
        { 
          day: 1, hour: 10, type: 'in-progress', time: '10:00 AM', 
          taskId: 'TASK-101', taskTitle: '用户认证模块开发',
          description: '集成JWT token处理和axios拦截器', 
          author: 'Sarah Chen',
          estimatedHours: 16, actualHours: 10, completionPercent: 60,
          tags: ['前端', '认证', 'React']
        },
        { 
          day: 2, hour: 14, type: 'review', time: '2:00 PM', 
          taskId: 'TASK-101', taskTitle: '用户认证模块开发',
          description: '提交代码审查，等待Tech Lead反馈', 
          author: 'Sarah Chen',
          estimatedHours: 16, actualHours: 14, completionPercent: 90,
          tags: ['前端', '认证', 'React']
        },
        { 
          day: 3, hour: 11, type: 'done', time: '11:00 AM', 
          taskId: 'TASK-101', taskTitle: '用户认证模块开发',
          description: '代码审查通过，合并到主分支，任务完成', 
          author: 'Sarah Chen',
          estimatedHours: 16, actualHours: 15, completionPercent: 100,
          tags: ['前端', '认证', 'React']
        },
        { 
          day: 4, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-102', taskTitle: '仪表盘数据可视化',
          description: '开始开发Dashboard页面，使用Recharts库', 
          author: 'Sarah Chen',
          estimatedHours: 20, actualHours: 0, completionPercent: 0,
          tags: ['前端', '数据可视化', 'Recharts']
        },
        { 
          day: 5, hour: 15, type: 'in-progress', time: '3:00 PM', 
          taskId: 'TASK-102', taskTitle: '仪表盘数据可视化',
          description: '完成图表组件封装和样式调整', 
          author: 'Sarah Chen',
          estimatedHours: 20, actualHours: 12, completionPercent: 50,
          tags: ['前端', '数据可视化', 'Recharts']
        },
        { 
          day: 7, hour: 10, type: 'in-progress', time: '10:00 AM', 
          taskId: 'TASK-102', taskTitle: '仪表盘数据可视化',
          description: '添加实时数据更新和导出功能', 
          author: 'Sarah Chen',
          estimatedHours: 20, actualHours: 16, completionPercent: 75,
          tags: ['前端', '数据可视化', 'Recharts']
        },
      ]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "后端开发工程师",
      team: "产品研发一组",
      sprint: "Sprint 12",
      avatar: imgEllipse8,
      statusColor: "#FF8800",
      totalTasks: 4,
      completedTasks: 2,
      inProgressTasks: 1,
      completionRate: 50,
      activities: [
        { 
          day: 0, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-201', taskTitle: 'API限流系统设计',
          description: '开始实现Redis-based限流中间件', 
          author: 'Michael Rodriguez',
          estimatedHours: 12, actualHours: 0, completionPercent: 0,
          tags: ['后端', 'Redis', '性能优化']
        },
        { 
          day: 1, hour: 11, type: 'in-progress', time: '11:00 AM', 
          taskId: 'TASK-201', taskTitle: 'API限流系统设计',
          description: 'Redis集成完成，测试限流逻辑', 
          author: 'Michael Rodriguez',
          estimatedHours: 12, actualHours: 8, completionPercent: 70,
          tags: ['后端', 'Redis', '性能优化']
        },
        { 
          day: 2, hour: 16, type: 'done', time: '4:00 PM', 
          taskId: 'TASK-201', taskTitle: 'API限流系统设计',
          description: '部署到测试环境，所有测试通过', 
          author: 'Michael Rodriguez',
          estimatedHours: 12, actualHours: 10, completionPercent: 100,
          tags: ['后端', 'Redis', '性能优化']
        },
        { 
          day: 3, hour: 10, type: 'start', time: '10:00 AM', 
          taskId: 'TASK-202', taskTitle: '数据库迁移脚本',
          description: '创建用户偏好表的迁移脚本', 
          author: 'Michael Rodriguez',
          estimatedHours: 6, actualHours: 0, completionPercent: 0,
          tags: ['后端', '数据库', 'Migration']
        },
        { 
          day: 4, hour: 14, type: 'blocked', time: '2:00 PM', 
          taskId: 'TASK-202', taskTitle: '数据库迁移脚本',
          description: '等待DBA批准索引变更，任务阻塞', 
          author: 'Michael Rodriguez',
          estimatedHours: 6, actualHours: 4, completionPercent: 40,
          tags: ['后端', '数据库', 'Migration'],
          isWarning: true
        },
        { 
          day: 6, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-203', taskTitle: 'WebSocket实时通信',
          description: '实现WebSocket服务器和实时通知功能', 
          author: 'Michael Rodriguez',
          estimatedHours: 18, actualHours: 0, completionPercent: 0,
          tags: ['后端', 'WebSocket', '实时通信']
        },
        { 
          day: 8, hour: 15, type: 'in-progress', time: '3:00 PM', 
          taskId: 'TASK-203', taskTitle: 'WebSocket实时通信',
          description: 'Socket.io集成完成，测试消息推送', 
          author: 'Michael Rodriguez',
          estimatedHours: 18, actualHours: 14, completionPercent: 60,
          tags: ['后端', 'WebSocket', '实时通信']
        },
      ]
    },
    {
      id: 3,
      name: "Emily Zhang",
      role: "UI/UX设计师",
      team: "设计团队",
      sprint: "Sprint 12",
      avatar: imgEllipse10,
      statusColor: "#00891E",
      totalTasks: 3,
      completedTasks: 2,
      inProgressTasks: 1,
      completionRate: 67,
      activities: [
        { 
          day: 0, hour: 10, type: 'start', time: '10:00 AM', 
          taskId: 'TASK-301', taskTitle: '设计系统文档编写',
          description: '创建组件库文档和设计规范', 
          author: 'Emily Zhang',
          estimatedHours: 10, actualHours: 0, completionPercent: 0,
          tags: ['设计', '文档', 'Storybook']
        },
        { 
          day: 2, hour: 14, type: 'in-progress', time: '2:00 PM', 
          taskId: 'TASK-301', taskTitle: '设计系统文档编写',
          description: '完成色彩系统和字体规范章节', 
          author: 'Emily Zhang',
          estimatedHours: 10, actualHours: 6, completionPercent: 60,
          tags: ['设计', '文档', 'Storybook']
        },
        { 
          day: 4, hour: 11, type: 'done', time: '11:00 AM', 
          taskId: 'TASK-301', taskTitle: '设计系统文档编写',
          description: '文档发布到Storybook，通知团队', 
          author: 'Emily Zhang',
          estimatedHours: 10, actualHours: 9, completionPercent: 100,
          tags: ['设计', '文档', 'Storybook']
        },
        { 
          day: 5, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-302', taskTitle: '用户引导流程重设计',
          description: '重新设计新用户onboarding体验', 
          author: 'Emily Zhang',
          estimatedHours: 14, actualHours: 0, completionPercent: 0,
          tags: ['设计', 'UX', 'Onboarding']
        },
        { 
          day: 7, hour: 13, type: 'in-progress', time: '1:00 PM', 
          taskId: 'TASK-302', taskTitle: '用户引���流程重设计',
          description: 'Figma原型设计完成，准备用户测试', 
          author: 'Emily Zhang',
          estimatedHours: 14, actualHours: 12, completionPercent: 80,
          tags: ['设计', 'UX', 'Onboarding']
        },
        { 
          day: 9, hour: 16, type: 'review', time: '4:00 PM', 
          taskId: 'TASK-302', taskTitle: '用户引导流程重设计',
          description: '提交设计评审，等待产品经理反馈', 
          author: 'Emily Zhang',
          estimatedHours: 14, actualHours: 14, completionPercent: 95,
          tags: ['设计', 'UX', 'Onboarding']
        },
      ]
    },
    {
      id: 4,
      name: "Alex Kumar",
      role: "DevOps工程师",
      team: "基础设施团队",
      sprint: "Sprint 12",
      avatar: imgEllipse9,
      statusColor: "#00891E",
      totalTasks: 4,
      completedTasks: 3,
      inProgressTasks: 1,
      completionRate: 75,
      activities: [
        { 
          day: 0, hour: 8, type: 'start', time: '8:00 AM', 
          taskId: 'TASK-401', taskTitle: 'CI/CD流程优化',
          description: '优化构建时间，实现并行测试', 
          author: 'Alex Kumar',
          estimatedHours: 8, actualHours: 0, completionPercent: 0,
          tags: ['DevOps', 'CI/CD', '性能']
        },
        { 
          day: 1, hour: 15, type: 'in-progress', time: '3:00 PM', 
          taskId: 'TASK-401', taskTitle: 'CI/CD流程优化',
          description: '实现并行测试执行，速度提升50%', 
          author: 'Alex Kumar',
          estimatedHours: 8, actualHours: 6, completionPercent: 75,
          tags: ['DevOps', 'CI/CD', '性能']
        },
        { 
          day: 2, hour: 17, type: 'done', time: '5:00 PM', 
          taskId: 'TASK-401', taskTitle: 'CI/CD流程优化',
          description: '构建时间从12分钟降至6分钟', 
          author: 'Alex Kumar',
          estimatedHours: 8, actualHours: 7, completionPercent: 100,
          tags: ['DevOps', 'CI/CD', '性能']
        },
        { 
          day: 3, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-402', taskTitle: 'Kubernetes集群升级',
          description: '升级生产环境K8s到最新LTS版本', 
          author: 'Alex Kumar',
          estimatedHours: 16, actualHours: 0, completionPercent: 0,
          tags: ['DevOps', 'Kubernetes', '基础设施']
        },
        { 
          day: 5, hour: 14, type: 'in-progress', time: '2:00 PM', 
          taskId: 'TASK-402', taskTitle: 'Kubernetes集群升级',
          description: '测试环境升级成功，准备生产环境', 
          author: 'Alex Kumar',
          estimatedHours: 16, actualHours: 10, completionPercent: 65,
          tags: ['DevOps', 'Kubernetes', '基��设施']
        },
        { 
          day: 7, hour: 10, type: 'in-progress', time: '10:00 AM', 
          taskId: 'TASK-402', taskTitle: 'Kubernetes集群升级',
          description: '进行生产前验证测试', 
          author: 'Alex Kumar',
          estimatedHours: 16, actualHours: 14, completionPercent: 85,
          tags: ['DevOps', 'Kubernetes', '基础设施']
        },
        { 
          day: 8, hour: 16, type: 'done', time: '4:00 PM', 
          taskId: 'TASK-402', taskTitle: 'Kubernetes集群升级',
          description: '生产环境升级完成，零宕机时间', 
          author: 'Alex Kumar',
          estimatedHours: 16, actualHours: 16, completionPercent: 100,
          tags: ['DevOps', 'Kubernetes', '基础设施']
        },
      ]
    },
    {
      id: 5,
      name: "Jessica Park",
      role: "QA测试工程师",
      team: "质量保障组",
      sprint: "Sprint 12",
      avatar: imgEllipse7,
      statusColor: "#00891E",
      totalTasks: 4,
      completedTasks: 2,
      inProgressTasks: 2,
      completionRate: 50,
      activities: [
        { 
          day: 0, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-501', taskTitle: 'E2E测试套件开发',
          description: '使用Playwright创建结账流程自动化测试', 
          author: 'Jessica Park',
          estimatedHours: 12, actualHours: 0, completionPercent: 0,
          tags: ['QA', 'E2E', 'Playwright']
        },
        { 
          day: 2, hour: 13, type: 'in-progress', time: '1:00 PM', 
          taskId: 'TASK-501', taskTitle: 'E2E测试套件开发',
          description: '完成支付流程测试场景编写', 
          author: 'Jessica Park',
          estimatedHours: 12, actualHours: 8, completionPercent: 70,
          tags: ['QA', 'E2E', 'Playwright']
        },
        { 
          day: 3, hour: 16, type: 'done', time: '4:00 PM', 
          taskId: 'TASK-501', taskTitle: 'E2E测试套件开发',
          description: '所有测试用例通过，集成到CI', 
          author: 'Jessica Park',
          estimatedHours: 12, actualHours: 11, completionPercent: 100,
          tags: ['QA', 'E2E', 'Playwright']
        },
        { 
          day: 4, hour: 10, type: 'start', time: '10:00 AM', 
          taskId: 'TASK-502', taskTitle: '性能压力测试',
          description: '进行高并发场景下的负载测试', 
          author: 'Jessica Park',
          estimatedHours: 10, actualHours: 0, completionPercent: 0,
          tags: ['QA', '性能测试', 'k6']
        },
        { 
          day: 6, hour: 15, type: 'in-progress', time: '3:00 PM', 
          taskId: 'TASK-502', taskTitle: '性能压力测试',
          description: '发现3个性能瓶颈，创建bug报告', 
          author: 'Jessica Park',
          estimatedHours: 10, actualHours: 6, completionPercent: 60,
          tags: ['QA', '性能测试', 'k6']
        },
        { 
          day: 8, hour: 11, type: 'start', time: '11:00 AM', 
          taskId: 'TASK-503', taskTitle: '无障碍访问审计',
          description: 'WCAG 2.1 AA标准合规性检查', 
          author: 'Jessica Park',
          estimatedHours: 8, actualHours: 0, completionPercent: 0,
          tags: ['QA', '无障碍', 'WCAG']
        },
        { 
          day: 10, hour: 14, type: 'in-progress', time: '2:00 PM', 
          taskId: 'TASK-503', taskTitle: '无障碍访问审计',
          description: '完成屏幕阅读器手动测试', 
          author: 'Jessica Park',
          estimatedHours: 8, actualHours: 6, completionPercent: 75,
          tags: ['QA', '无障碍', 'WCAG']
        },
      ]
    },
    {
      id: 6,
      name: "David Thompson",
      role: "全栈开发工程师",
      team: "产品研发二组",
      sprint: "Sprint 12",
      avatar: imgEllipse8,
      statusColor: "#FF8800",
      totalTasks: 3,
      completedTasks: 1,
      inProgressTasks: 1,
      completionRate: 33,
      activities: [
        { 
          day: 0, hour: 8, type: 'start', time: '8:30 AM', 
          taskId: 'TASK-601', taskTitle: '支付网关集成',
          description: '集成Stripe支付，支持多币种', 
          author: 'David Thompson',
          estimatedHours: 20, actualHours: 0, completionPercent: 0,
          tags: ['全栈', 'Payment', 'Stripe']
        },
        { 
          day: 2, hour: 11, type: 'in-progress', time: '11:00 AM', 
          taskId: 'TASK-601', taskTitle: '支付网关集成',
          description: '支付处理逻辑开发完成', 
          author: 'David Thompson',
          estimatedHours: 20, actualHours: 12, completionPercent: 60,
          tags: ['全栈', 'Payment', 'Stripe']
        },
        { 
          day: 4, hour: 15, type: 'in-progress', time: '3:00 PM', 
          taskId: 'TASK-601', taskTitle: '支付网关集成',
          description: '沙盒环境测试通过', 
          author: 'David Thompson',
          estimatedHours: 20, actualHours: 18, completionPercent: 90,
          tags: ['全栈', 'Payment', 'Stripe']
        },
        { 
          day: 5, hour: 17, type: 'done', time: '5:00 PM', 
          taskId: 'TASK-601', taskTitle: '支付网关集成',
          description: '生产环境就绪，所有边界情况已处理', 
          author: 'David Thompson',
          estimatedHours: 20, actualHours: 20, completionPercent: 100,
          tags: ['全栈', 'Payment', 'Stripe']
        },
        { 
          day: 6, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-602', taskTitle: '邮件通知服务',
          description: '构建邮件模板和发送系统', 
          author: 'David Thompson',
          estimatedHours: 14, actualHours: 0, completionPercent: 0,
          tags: ['后端', 'Email', 'SendGrid']
        },
        { 
          day: 8, hour: 14, type: 'blocked', time: '2:00 PM', 
          taskId: 'TASK-602', taskTitle: '邮件通知服务',
          description: '等待SendGrid预算审批', 
          author: 'David Thompson',
          estimatedHours: 14, actualHours: 8, completionPercent: 35,
          tags: ['后端', 'Email', 'SendGrid'],
          isWarning: true
        },
      ]
    },
    {
      id: 7,
      name: "Lisa Wang",
      role: "产品经理",
      team: "产品团队",
      sprint: "Sprint 12",
      avatar: imgEllipse10,
      statusColor: "#00891E",
      totalTasks: 3,
      completedTasks: 2,
      inProgressTasks: 1,
      completionRate: 67,
      activities: [
        { 
          day: 0, hour: 10, type: 'start', time: '10:00 AM', 
          taskId: 'TASK-701', taskTitle: 'Sprint计划会议',
          description: '组织Sprint规划会议，确定优先级', 
          author: 'Lisa Wang',
          estimatedHours: 4, actualHours: 0, completionPercent: 0,
          tags: ['管理', 'Sprint Planning']
        },
        { 
          day: 0, hour: 14, type: 'done', time: '2:00 PM', 
          taskId: 'TASK-701', taskTitle: 'Sprint计划会议',
          description: 'Sprint Backlog确认，Story Points分配完成', 
          author: 'Lisa Wang',
          estimatedHours: 4, actualHours: 4, completionPercent: 100,
          tags: ['管理', 'Sprint Planning']
        },
        { 
          day: 1, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-702', taskTitle: '用户故事细化',
          description: '编写用户故事和验收标准', 
          author: 'Lisa Wang',
          estimatedHours: 6, actualHours: 0, completionPercent: 0,
          tags: ['管理', 'User Story']
        },
        { 
          day: 2, hour: 16, type: 'done', time: '4:00 PM', 
          taskId: 'TASK-702', taskTitle: '用户故事细化',
          description: '8个用户故事完成，已添加到Backlog', 
          author: 'Lisa Wang',
          estimatedHours: 6, actualHours: 5, completionPercent: 100,
          tags: ['管理', 'User Story']
        },
        { 
          day: 5, hour: 10, type: 'start', time: '10:00 AM', 
          taskId: 'TASK-703', taskTitle: 'Sprint Review准备',
          description: '准备Sprint评审会议材料和Demo', 
          author: 'Lisa Wang',
          estimatedHours: 5, actualHours: 0, completionPercent: 0,
          tags: ['管理', 'Sprint Review']
        },
        { 
          day: 10, hour: 13, type: 'in-progress', time: '1:00 PM', 
          taskId: 'TASK-703', taskTitle: 'Sprint Review准备',
          description: '收集团队反馈，准备演示PPT', 
          author: 'Lisa Wang',
          estimatedHours: 5, actualHours: 3, completionPercent: 60,
          tags: ['管理', 'Sprint Review']
        },
      ]
    },
    {
      id: 8,
      name: "Tom Rodriguez",
      role: "架构师",
      team: "技术委员会",
      sprint: "Sprint 12",
      avatar: imgEllipse7,
      statusColor: "#00891E",
      totalTasks: 2,
      completedTasks: 1,
      inProgressTasks: 1,
      completionRate: 50,
      activities: [
        { 
          day: 0, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-801', taskTitle: '微服务架构设计',
          description: '设计订单服务的微服务拆分方案', 
          author: 'Tom Rodriguez',
          estimatedHours: 16, actualHours: 0, completionPercent: 0,
          tags: ['架构', '微服务', '设计']
        },
        { 
          day: 2, hour: 14, type: 'in-progress', time: '2:00 PM', 
          taskId: 'TASK-801', taskTitle: '微服务架构设计',
          description: '完成架构图和技术选型文档', 
          author: 'Tom Rodriguez',
          estimatedHours: 16, actualHours: 10, completionPercent: 65,
          tags: ['架构', '微服务', '设计']
        },
        { 
          day: 4, hour: 16, type: 'review', time: '4:00 PM', 
          taskId: 'TASK-801', taskTitle: '微服务架构设计',
          description: '提交架构评审，等待团队反馈', 
          author: 'Tom Rodriguez',
          estimatedHours: 16, actualHours: 14, completionPercent: 90,
          tags: ['架构', '微服务', '设计']
        },
        { 
          day: 6, hour: 10, type: 'done', time: '10:00 AM', 
          taskId: 'TASK-801', taskTitle: '微服务架构设计',
          description: '架构方案通过，开始实施', 
          author: 'Tom Rodriguez',
          estimatedHours: 16, actualHours: 16, completionPercent: 100,
          tags: ['架构', '微服务', '设计']
        },
        { 
          day: 7, hour: 9, type: 'start', time: '9:00 AM', 
          taskId: 'TASK-802', taskTitle: '技术债务评估',
          description: '评估当前系统技术债务并制定优化计划', 
          author: 'Tom Rodriguez',
          estimatedHours: 12, actualHours: 0, completionPercent: 0,
          tags: ['架构', '技术债', '优化']
        },
        { 
          day: 10, hour: 15, type: 'in-progress', time: '3:00 PM', 
          taskId: 'TASK-802', taskTitle: '技术债务评估',
          description: '识别出15个需要重构的模块', 
          author: 'Tom Rodriguez',
          estimatedHours: 12, actualHours: 8, completionPercent: 65,
          tags: ['架构', '技术债', '优化']
        },
      ]
    }
  ];

  const handleActivityClick = (activity: any, member: any) => {
    setSelectedActivity(activity);
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
    setSelectedMember(null);
  };

  // 计算统计数据
  const allActivities = members.flatMap(m => m.activities);
  const totalTasks = members.reduce((sum, m) => sum + m.totalTasks, 0);
  const completedTasks = members.reduce((sum, m) => sum + m.completedTasks, 0);
  const inProgressTasks = members.reduce((sum, m) => sum + m.inProgressTasks, 0);
  const blockedTasks = allActivities.filter(a => a.type === 'blocked').length;

  return (
    <div className="min-h-screen bg-[#fcfcfe] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回</span>
            </button>
            <Logo />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Scrum Sprint 任务看板 - 成员视图</h1>
              <p className="text-sm text-gray-500">Sprint 12 • 2026年2月11日 - 2026年3月3日</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务..."
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-4">
          <StatCard
            title="总任务数"
            value={totalTasks.toString()}
            subtitle={`活跃成员: ${members.length}人`}
            subtitleColor="text-blue-600"
            iconColor="#175CD3"
            iconPath={svgPaths.p13635700}
          />
          <StatCard
            title="已完成任务"
            value={completedTasks.toString()}
            subtitle={`完成率: ${Math.round((completedTasks / totalTasks) * 100)}%`}
            subtitleColor="text-green-600"
            iconColor="#00891E"
            iconPath={svgPaths.p1ae3cb00}
          />
          <StatCard
            title="进行中任务"
            value={inProgressTasks.toString()}
            subtitle="当前Sprint进度良好"
            subtitleColor="text-yellow-600"
            iconColor="#F59E0B"
            iconPath={svgPaths.p3c934600}
          />
          <StatCard
            title="阻塞任务"
            value={blockedTasks.toString()}
            subtitle={blockedTasks > 0 ? "需要立即关注" : "无阻塞"}
            subtitleColor={blockedTasks > 0 ? "text-red-600" : "text-gray-500"}
            iconColor={blockedTasks > 0 ? "#EF4444" : "#6B7280"}
            iconPath={svgPaths.p13635700}
          />
        </div>
      </div>

      {/* Main Gantt Chart - 保持原来的布局 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Timeline Header */}
        <div className="flex border-b-2 border-gray-300 bg-gray-50 sticky top-0 z-20">
          <div className="sticky left-0 z-30 bg-gray-100 border-r-2 border-gray-300 w-80 flex-shrink-0">
            <div className="p-4 font-semibold text-gray-700">
              团队成员 ({members.length})
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex" style={{ minWidth: `${timelineDays.length * 60}px` }}>
              {timelineDays.map((day, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 p-3 text-center border-r border-gray-200 ${
                    day.day === 'Sat' || day.day === 'Sun' ? 'bg-gray-100' : 'bg-white'
                  }`}
                  style={{ width: '60px' }}
                >
                  <div className="text-xs font-medium text-gray-500">{day.day}</div>
                  <div className="text-sm font-semibold text-gray-900">{day.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gantt Chart Rows */}
        <div className="flex-1 overflow-auto">
          {members.map((member) => {
            const memberActivities = member.activities;
            
            return (
              <div key={member.id} className="flex border-b border-gray-200 bg-white hover:bg-gray-50/50 transition-colors">
                {/* Fixed Left Column - Member Info */}
                <div className="sticky left-0 z-10 bg-white border-r border-gray-200 w-80 flex-shrink-0 shadow-sm">
                  <div className="p-4 h-[100px] flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full ring-2 ring-gray-100" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{member.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">
                          {member.completedTasks}/{member.totalTasks}
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${member.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{member.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Timeline */}
                <div className="flex-1 overflow-x-auto">
                  <div className="relative h-[100px]" style={{ minWidth: `${timelineDays.length * 60}px` }}>
                    {/* Day columns background */}
                    <div className="absolute inset-0 flex">
                      {timelineDays.map((day, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 border-r border-gray-100 ${
                            day.day === 'Sat' || day.day === 'Sun' ? 'bg-gray-50' : ''
                          }`}
                          style={{ width: '60px' }}
                        />
                      ))}
                    </div>

                    {/* Activity Icons with Smart Positioning */}
                    {timelineDays.map((day) => {
                      const positionedActivities = calculateActivityPositions(memberActivities, day.dayIndex);
                      
                      return positionedActivities.map((activity, actIndex) => (
                        <div
                          key={`${day.dayIndex}-${actIndex}`}
                          className="absolute"
                          style={{
                            left: `${day.dayIndex * 60 + activity.horizontalPosition * 0.6}px`,
                            top: `${35 + activity.verticalPosition}px`,
                          }}
                        >
                          <ActivityIcon
                            type={activity.type}
                            isWarning={activity.isWarning}
                            size="sm"
                            onClick={() => handleActivityClick(activity, member)}
                          />
                        </div>
                      ));
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        activity={selectedActivity}
        member={selectedMember}
        allActivities={selectedMember?.activities || []}
      />
    </div>
  );
}
