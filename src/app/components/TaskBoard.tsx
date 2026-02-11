'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { 
  Search, Filter, Settings, ChevronDown, ChevronUp, ChevronRight,
  MoreVertical, Plus, AlertTriangle, MessageCircle, Link as LinkIcon,
  Clock, Users, TrendingUp, TrendingDown, Minus, X, Calendar,
  Target, Activity, BarChart3
} from 'lucide-react';
import TaskBoardMemberView from '@/app/components/TaskBoardMemberView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Separator } from '@/app/components/ui/separator';

// 任务状态定义
const TASK_STATUSES = [
  { id: 'todo', name: '🆕 待办', color: 'bg-gray-100' },
  { id: 'available', name: '👤 待领取', color: 'bg-blue-100' },
  { id: 'in-progress', name: '▶️ 进行中', color: 'bg-yellow-100' },
  { id: 'review', name: '🔍 评审中', color: 'bg-purple-100' },
  { id: 'done', name: '✅ 已完成', color: 'bg-green-100' },
  { id: 'blocked', name: '🚧 阻塞', color: 'bg-red-100' },
  { id: 'retrospective', name: '📥 待回溯', color: 'bg-orange-100' }
];

const SWIMLANE_MODES = [
  { id: 'story', name: '按用户故事', icon: Users },
  { id: 'assignee', name: '按负责人', icon: Users },
  { id: 'module', name: '按模块', icon: Users },
  { id: 'priority', name: '按优先级', icon: AlertTriangle }
];

// 模拟任务数据
const mockTasks = [
  {
    id: 'task-1',
    title: '设计登录页面',
    description: '设计新的登录页面UI',
    priority: 'P0',
    storyPoints: 3,
    assignee: '张三',
    avatar: 'ZS',
    status: 'in-progress',
    story: '用户故事A',
    module: '前端',
    dueDate: '2天后',
    subTasksProgress: 60,
    hasComments: true,
    hasDependencies: false,
    type: 'design',
    daysInStatus: 2
  },
  {
    id: 'task-2',
    title: '开发登录接口',
    description: '实现基于JWT的登录接口',
    priority: 'P0',
    storyPoints: 5,
    assignee: '李四',
    avatar: 'LS',
    status: 'in-progress',
    story: '用户故事A',
    module: '后端',
    dueDate: '3天后',
    subTasksProgress: 40,
    hasComments: true,
    hasDependencies: true,
    type: 'backend',
    daysInStatus: 1
  },
  {
    id: 'task-3',
    title: '编写登录测试用例',
    description: '编写单元测试和集成测试',
    priority: 'P1',
    storyPoints: 2,
    assignee: '王五',
    avatar: 'WW',
    status: 'review',
    story: '用户故事A',
    module: '测试',
    dueDate: '5天后',
    subTasksProgress: 80,
    hasComments: false,
    hasDependencies: true,
    type: 'test',
    daysInStatus: 1
  },
  {
    id: 'task-4',
    title: '数据库表设计',
    description: '设计用户表和权限表',
    priority: 'P0',
    storyPoints: 3,
    assignee: '赵六',
    avatar: 'ZL',
    status: 'done',
    story: '用户故事A',
    module: '数据库',
    dueDate: '已完成',
    subTasksProgress: 100,
    hasComments: false,
    hasDependencies: false,
    type: 'backend',
    daysInStatus: 0
  },
  {
    id: 'task-5',
    title: '设计支付流程',
    description: '设计支付流程和界面',
    priority: 'P1',
    storyPoints: 5,
    assignee: '张三',
    avatar: 'ZS',
    status: 'todo',
    story: '用户故事B',
    module: '前端',
    dueDate: '7天后',
    subTasksProgress: 0,
    hasComments: false,
    hasDependencies: false,
    type: 'design',
    daysInStatus: 0
  },
  {
    id: 'task-6',
    title: '开发支付接口',
    description: '对接第三方支付平台',
    priority: 'P0',
    storyPoints: 8,
    assignee: '李四',
    avatar: 'LS',
    status: 'in-progress',
    story: '用户故事B',
    module: '后端',
    dueDate: '4天后',
    subTasksProgress: 30,
    hasComments: true,
    hasDependencies: true,
    type: 'backend',
    daysInStatus: 3
  }
];

const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
  P0: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-700' },
  P1: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-700' },
  P2: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-700' },
  P3: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-700' }
};

const typeColors: Record<string, string> = {
  frontend: 'border-blue-400',
  backend: 'border-green-400',
  test: 'border-purple-400',
  design: 'border-orange-400'
};

// 任务详情模态框组件
interface TaskModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal = ({ task, isOpen, onClose }: TaskModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const statusName = TASK_STATUSES.find(s => s.id === task.status)?.name || task.status;
  const mockSubTasks = [
    { id: 1, name: '需求分析', completed: true },
    { id: 2, name: '接口设计', completed: true },
    { id: 3, name: '代码实现', completed: false },
    { id: 4, name: '单元测试', completed: false },
    { id: 5, name: '集成测试', completed: false }
  ];

  const mockTrendData = [20, 35, 40, 45, 60, 65, task.subTasksProgress];
  const completedSubTasks = mockSubTasks.filter(t => t.completed).length;
  const getRemainingDays = () => {
    if (task.dueDate === '已完成') return 0;
    if (task.dueDate === '已逾期') return -1;
    return parseInt(task.dueDate.replace('天后', '')) || 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in-0 duration-300">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-8 rounded-full ${priorityColors[task.priority].bg}`}></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-600">
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-600">
                      {task.module}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="mt-3 text-gray-600 leading-relaxed">{task.description}</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 左右分栏布局 */}
          <div className="grid grid-cols-3 gap-6">
            {/* 左侧 - 核心数据和可视化 */}
            <div className="col-span-2 space-y-6">
              {/* 关键指标卡片 */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">预估点数</span>
                      <div className="text-2xl font-bold text-gray-900">{task.storyPoints}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">故事点</div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-emerald-50/50 to-green-50/50 border-emerald-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">完成进度</span>
                      <div className="text-2xl font-bold text-gray-900">{task.subTasksProgress}%</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{completedSubTasks}/{mockSubTasks.length} 子任务</div>
                </Card>
                
                <Card className={`p-6 bg-gradient-to-br ${getRemainingDays() < 0 ? 'from-red-50/50 to-rose-50/50 border-red-100/50' : getRemainingDays() <= 2 ? 'from-amber-50/50 to-orange-50/50 border-amber-100/50' : 'from-slate-50/50 to-gray-50/50 border-slate-100/50'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getRemainingDays() < 0 ? 'bg-red-500/10' : getRemainingDays() <= 2 ? 'bg-amber-500/10' : 'bg-slate-500/10'}`}>
                      <Calendar className={`w-5 h-5 ${getRemainingDays() < 0 ? 'text-red-600' : getRemainingDays() <= 2 ? 'text-amber-600' : 'text-slate-600'}`} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">剩余时间</span>
                      <div className="text-2xl font-bold text-gray-900">
                        {getRemainingDays() < 0 ? '逾期' : getRemainingDays() === 0 ? '已完成' : `${getRemainingDays()}天`}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">截止日期</div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-violet-50/50 to-purple-50/50 border-violet-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">停留时间</span>
                      <div className="text-2xl font-bold text-gray-900">{task.daysInStatus}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">天</div>
                </Card>
              </div>

              {/* 进度可视化 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 环形进度图 */}
                <Card className="p-6 bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-gray-100/50">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-500/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-slate-600" />
                    </div>
                    完成进度
                  </h3>
                  <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="12"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(task.subTasksProgress / 100) * 440} 440`}
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{task.subTasksProgress}%</span>
                      <span className="text-sm text-gray-500">已完成</span>
                    </div>
                  </div>
                </Card>

                {/* 任务趋势图 */}
                <Card className="p-6 bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-gray-100/50">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-slate-600" />
                    </div>
                    进度趋势
                  </h3>
                  <div className="h-32">
                    <svg className="w-full h-full" viewBox="0 0 280 120">
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M 20 ${100 - mockTrendData[0]} ${mockTrendData.map((value, index) => 
                          `L ${20 + (index * 40)} ${100 - value}`
                        ).join(' ')}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={`M 20 ${100 - mockTrendData[0]} ${mockTrendData.map((value, index) => 
                          `L ${20 + (index * 40)} ${100 - value}`
                        ).join(' ')} L ${20 + (mockTrendData.length - 1) * 40} 100 L 20 100 Z`}
                        fill="url(#trendGradient)"
                      />
                      {mockTrendData.map((value, index) => (
                        <circle
                          key={index}
                          cx={20 + (index * 40)}
                          cy={100 - value}
                          r="4"
                          fill="#3b82f6"
                          className="drop-shadow-sm"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>7天前</span>
                    <span>今天</span>
                  </div>
                </Card>
              </div>

              {/* 基本信息 */}
              <Card className="p-6 bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-gray-100/50">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-slate-600" />
                  </div>
                  基本信息
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">负责人</label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {task.avatar}
                      </div>
                      <span className="font-medium text-gray-900">{task.assignee}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">所属用户故事</label>
                    <p className="mt-2 font-medium text-gray-900">{task.story}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">模块</label>
                    <Badge variant="outline" className="mt-2 border-gray-200 text-gray-700">{task.module}</Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">当前状态</label>
                    <Badge className="mt-2 bg-slate-100 text-slate-700 hover:bg-slate-100">{statusName}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">截止日期</label>
                    <p className={`mt-2 font-medium ${task.dueDate === '已逾期' ? 'text-red-600' : 'text-gray-900'}`}>
                      {task.dueDate}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 右侧 - 子任务和附加信息 */}
            <div className="space-y-6">
              {/* 子任务列表 */}
              <Card className="p-6 bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-gray-100/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-500/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-slate-600" />
                    </div>
                    子任务列表
                  </h3>
                  <Badge variant="outline" className="border-gray-200 text-gray-700">{completedSubTasks}/{mockSubTasks.length}</Badge>
                </div>
                <Progress value={(completedSubTasks / mockSubTasks.length) * 100} className="mb-6" />
                <div className="space-y-3">
                  {mockSubTasks.map((subTask) => (
                    <div key={subTask.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        subTask.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        {subTask.completed && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        subTask.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {subTask.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 状态指示器 */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">状态指示</h3>
                <div className="space-y-3">
                  {task.hasDependencies && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <LinkIcon className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900">有依赖关系</p>
                        <p className="text-sm text-orange-700">此任务依赖其他任务</p>
                      </div>
                    </div>
                  )}
                  {task.hasComments && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">有评论</p>
                        <p className="text-sm text-blue-700">包含团队讨论内容</p>
                      </div>
                    </div>
                  )}
                  {task.daysInStatus > 3 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <AlertTriangle className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">停留警告</p>
                        <p className="text-sm text-purple-700">在当前状态已停留 {task.daysInStatus} 天</p>
                      </div>
                    </div>
                  )}
                  {!task.hasDependencies && !task.hasComments && task.daysInStatus <= 3 && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-green-900">状态正常</p>
                        <p className="text-sm text-green-700">任务进展顺利</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 任务卡片组件
interface TaskCardProps {
  task: any;
  onTaskClick: (task: any) => void;
  viewMode: string;
}

const TaskCard = ({ task, onTaskClick, viewMode }: TaskCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const getStatusColor = () => {
    if (task.daysInStatus <= 1) return 'bg-blue-50';
    if (task.daysInStatus <= 3) return 'bg-blue-100';
    if (task.daysInStatus <= 5) return 'bg-blue-200';
    return 'bg-purple-200';
  };

  return (
    <div
      ref={drag}
      onClick={() => onTaskClick(task)}
      className={`${
        viewMode === 'compact' ? 'p-2' : 'p-3'
      } bg-white rounded-lg border-l-4 ${
        typeColors[task.type] || 'border-gray-400'
      } shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      } ${getStatusColor()}`}
    >
      {/* 优先级色条 */}
      <div className="flex items-center justify-between mb-2">
        <Badge className={`${priorityColors[task.priority].bg} text-white text-xs px-1.5 py-0.5`}>
          {task.priority}
        </Badge>
        <div className="flex items-center gap-1">
          {task.hasDependencies && (
            <LinkIcon className="w-3 h-3 text-orange-600" title="有依赖" />
          )}
          {task.hasComments && (
            <MessageCircle className="w-3 h-3 text-blue-600" title="有评论" />
          )}
          {task.dueDate === '已逾期' && (
            <AlertTriangle className="w-3 h-3 text-red-600" title="已逾期" />
          )}
        </div>
      </div>

      {/* 任务标题 */}
      <h4 className={`font-medium text-gray-900 ${viewMode === 'compact' ? 'text-xs' : 'text-sm'} mb-2 line-clamp-2`}>
        {task.title}
      </h4>

      {/* 负责人和故事点 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
            {task.avatar}
          </div>
          <span className="text-xs text-gray-600">{task.assignee}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {task.storyPoints}点
        </Badge>
      </div>

      {/* 时间标签 */}
      {viewMode !== 'compact' && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Clock className="w-3 h-3" />
          <span className={task.dueDate === '已逾期' ? 'text-red-600 font-semibold' : ''}>
            {task.dueDate}
          </span>
        </div>
      )}

      {/* 子任务进度 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>子任务</span>
          <span>{task.subTasksProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all"
            style={{ width: `${task.subTasksProgress}%` }}
          />
        </div>
      </div>

      {/* 停留时间指示 */}
      {task.daysInStatus > 3 && (
        <div className="mt-2 text-xs text-purple-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>已停留{task.daysInStatus}天</span>
        </div>
      )}
    </div>
  );
};

// 状态列组件
interface StatusColumnProps {
  status: any;
  tasks: any[];
  onDrop: (taskId: string, newStatus: string, swimlaneValue: string) => void;
  onTaskClick: (task: any) => void;
  swimlaneValue: string;
  viewMode: string;
}

const StatusColumn = ({ status, tasks, onDrop, onTaskClick, swimlaneValue, viewMode }: StatusColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: any) => onDrop(item.id, status.id, swimlaneValue),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const totalPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0);

  return (
    <div
      ref={drop}
      className={`min-h-[200px] p-2 rounded-lg transition-colors ${
        isOver ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-50'
      }`}
    >
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};

// 泳道组件
interface SwimlaneProps {
  name: string;
  tasks: any[];
  statuses: any[];
  onDrop: (taskId: string, newStatus: string, swimlaneValue: string) => void;
  onTaskClick: (task: any) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  health: 'healthy' | 'warning' | 'critical' | 'done';
  swimlaneValue: string;
  viewMode: string;
}

const Swimlane = ({
  name,
  tasks,
  statuses,
  onDrop,
  onTaskClick,
  collapsed,
  onToggleCollapse,
  health,
  swimlaneValue,
  viewMode
}: SwimlaneProps) => {
  const totalPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const completedPoints = tasks
    .filter((task) => task.status === 'done')
    .reduce((sum, task) => sum + task.storyPoints, 0);
  const progress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const healthColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    done: 'bg-gray-400'
  };

  const healthIcons = {
    healthy: <TrendingUp className="w-4 h-4 text-green-600" />,
    warning: <Minus className="w-4 h-4 text-yellow-600" />,
    critical: <TrendingDown className="w-4 h-4 text-red-600" />,
    done: <X className="w-4 h-4 text-gray-600" />
  };

  return (
    <div className="border-b border-gray-200">
      {/* 泳道标题栏 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          {/* 健康度指示器 */}
          <div className={`w-3 h-3 rounded-full ${healthColors[health]}`} title={health} />

          {/* 泳道名称和统计 */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{totalPoints}点</span>
                <span>·</span>
                <span>已完成{completedPoints}点</span>
                <span>·</span>
                <span className="font-semibold text-blue-600">{progress}%</span>
              </div>
            </div>
            {/* 进度条 */}
            <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 健康度图标 */}
          <div>{healthIcons[health]}</div>

          {/* 折叠按钮 */}
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* 泳道内容 */}
      {!collapsed && (
        <div className="grid" style={{ gridTemplateColumns: `repeat(${statuses.length}, minmax(200px, 1fr))` }}>
          {statuses.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status.id);
            return (
              <div key={status.id} className="border-r border-gray-200 last:border-r-0">
                <StatusColumn
                  status={status}
                  tasks={statusTasks}
                  onDrop={onDrop}
                  onTaskClick={onTaskClick}
                  swimlaneValue={swimlaneValue}
                  viewMode={viewMode}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 折叠状态摘要 */}
      {collapsed && (
        <div className="p-3 bg-gray-50 flex items-center gap-4 text-sm text-gray-600">
          <span>任务总数: {tasks.length}</span>
          <span>完成率: {progress}%</span>
          <span>风险数量: {tasks.filter((t) => t.dueDate === '已逾期').length}</span>
        </div>
      )}
    </div>
  );
};

// 主组件
export default function TaskBoard() {
  const [swimlaneMode, setSwimlaneMode] = useState('story');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  const [collapsedSwimlanes, setCollapsedSwimlanes] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [showMemberView, setShowMemberView] = useState(false);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // 根据泳道模式分组任务
  const swimlanes = useMemo(() => {
    const groups: Record<string, any[]> = {};

    tasks.forEach((task) => {
      let key = '';
      switch (swimlaneMode) {
        case 'story':
          key = task.story;
          break;
        case 'assignee':
          key = task.assignee;
          break;
        case 'module':
          key = task.module;
          break;
        case 'priority':
          key = task.priority;
          break;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
    });

    return Object.entries(groups).map(([name, tasks]) => {
      // 计算健康度
      let health: 'healthy' | 'warning' | 'critical' | 'done' = 'healthy';
      const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
      const completedPoints = tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.storyPoints, 0);
      const progress = totalPoints > 0 ? completedPoints / totalPoints : 0;
      const blockedCount = tasks.filter((t) => t.status === 'blocked').length;
      const overdueCount = tasks.filter((t) => t.dueDate === '已逾期').length;

      if (progress === 1) {
        health = 'done';
      } else if (blockedCount > 0 || overdueCount > 0) {
        health = 'critical';
      } else if (progress < 0.3) {
        health = 'warning';
      }

      return { name, tasks, health };
    });
  }, [tasks, swimlaneMode]);

  // 处理任务拖拽
  const handleTaskDrop = (taskId: string, newStatus: string, swimlaneValue: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updates: any = { status: newStatus };

          // 根据泳道模式更新对应字段
          switch (swimlaneMode) {
            case 'story':
              updates.story = swimlaneValue;
              break;
            case 'assignee':
              updates.assignee = swimlaneValue;
              break;
            case 'module':
              updates.module = swimlaneValue;
              break;
            case 'priority':
              updates.priority = swimlaneValue;
              break;
          }

          return { ...task, ...updates };
        }
        return task;
      })
    );
  };

  // 切换泳道折叠状态
  const toggleSwimlaneCollapse = (swimlaneName: string) => {
    setCollapsedSwimlanes((prev) => {
      const next = new Set(prev);
      if (next.has(swimlaneName)) {
        next.delete(swimlaneName);
      } else {
        next.add(swimlaneName);
      }
      return next;
    });
  };

  // 统计数据
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
      blocked: tasks.filter((t) => t.status === 'blocked').length,
      totalPoints: tasks.reduce((sum, t) => sum + t.storyPoints, 0),
      completedPoints: tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.storyPoints, 0)
    };
  }, [tasks]);

  // 如果显示成员视图，渲染成员视图组件
  if (showMemberView) {
    return <TaskBoardMemberView onBack={() => setShowMemberView(false)} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* 页面头部 */}
        <div className="flex items-center justify-between bg-white p-4 border-b shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sprint #15 任务看板</h1>
            <p className="text-sm text-gray-600 mt-1">2026年2月3日 - 2月17日</p>
          </div>

          <div className="flex items-center gap-3">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索任务..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 视图模式 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  视图: {viewMode === 'detailed' ? '详细' : '紧凑'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setViewMode('detailed')}>详细模式</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('compact')}>紧凑模式</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 泳道模式切换 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {SWIMLANE_MODES.find((m) => m.id === swimlaneMode)?.name}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {SWIMLANE_MODES.map((mode) => (
                  <DropdownMenuItem key={mode.id} onClick={() => setSwimlaneMode(mode.id)}>
                    <mode.icon className="w-4 h-4 mr-2" />
                    {mode.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => setShowStats(!showStats)}>
              <Filter className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline"
              onClick={() => setShowMemberView(true)}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              成员视图
            </Button>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              新建任务
            </Button>
          </div>
        </div>

        {/* 统计概览 */}
        {showStats && (
          <div className="flex gap-3 p-4 bg-gray-50 border-b flex-shrink-0">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">总任务</span>
              <span className="text-lg font-bold text-blue-600">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">进行中</span>
              <span className="text-lg font-bold text-yellow-600">{stats.inProgress}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">已完成</span>
              <span className="text-lg font-bold text-green-600">{stats.done}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">阻塞</span>
              <span className="text-lg font-bold text-red-600">{stats.blocked}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">完成度</span>
              <span className="text-lg font-bold text-purple-600">
                {Math.round((stats.completedPoints / stats.totalPoints) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* 主内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto">
          {/* 泳道图主体 */}
          <div className="bg-white">
            {/* 状态列标题 */}
            <div
              className="grid bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300 sticky top-0 z-10"
              style={{ gridTemplateColumns: `repeat(${TASK_STATUSES.length}, minmax(200px, 1fr))` }}
            >
              {TASK_STATUSES.map((status) => {
                const count = tasks.filter((t) => t.status === status.id).length;
                const points = tasks
                  .filter((t) => t.status === status.id)
                  .reduce((sum, t) => sum + t.storyPoints, 0);
                return (
                  <div key={status.id} className="p-4 text-center border-r border-gray-300 last:border-r-0">
                    <div className="font-semibold text-gray-900 mb-1">{status.name}</div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Badge variant="outline">{count} 个</Badge>
                      <Badge variant="outline">{points} 点</Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 泳道列表 */}
            <div>
              {swimlanes.map((swimlane) => (
                <Swimlane
                  key={swimlane.name}
                  name={swimlane.name}
                  tasks={swimlane.tasks}
                  statuses={TASK_STATUSES}
                  onDrop={handleTaskDrop}
                  onTaskClick={handleTaskClick}
                  collapsed={collapsedSwimlanes.has(swimlane.name)}
                  onToggleCollapse={() => toggleSwimlaneCollapse(swimlane.name)}
                  health={swimlane.health}
                  swimlaneValue={swimlane.name}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>

        </div>

        {/* 任务详情模态框 */}
        <TaskModal 
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </DndProvider>
  );
}