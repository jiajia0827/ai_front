import { useState, useMemo } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Separator } from '@/app/components/ui/separator';
import { Progress } from '@/app/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/components/ui/chart';
import { Search, Filter, Download, MoreVertical, ChevronDown, ChevronUp, TrendingUp, Target, CheckCircle2, ListOrdered, Plus, Edit, Copy, Trash2, Link as LinkIcon, User as UserIcon, Calendar, ArrowRight, BarChart3, PieChart, Clock, Users, Zap } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Area, AreaChart } from 'recharts';

interface PBI {
  id: string;
  title: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  storyPoints: number;
  businessValue: number;
  complexity: number;
  status: string;
  assignee: string;
  avatar: string;
  createdAt: string;
  estimatedSprint: string;
  tags: string[];
  dependencies: string[];
  blockedBy: string[];
}

const mockPBIs: PBI[] = [
  {
    id: 'PBI-001',
    title: '用户登录认证功能',
    description: '实现用户登录、注册和忘记密码功能',
    priority: 'P0',
    storyPoints: 8,
    businessValue: 95,
    complexity: 75,
    status: '已评审',
    assignee: '张三',
    avatar: 'ZS',
    createdAt: '2026-01-15',
    estimatedSprint: 'Sprint 6',
    tags: ['前端', '后端', '安全'],
    dependencies: ['PBI-012'],
    blockedBy: [],
  },
  {
    id: 'PBI-002',
    title: '数据可视化仪表盘',
    description: '创建动态数据可视化面板，支持多种图表类型',
    priority: 'P0',
    storyPoints: 13,
    businessValue: 90,
    complexity: 85,
    status: '已细化',
    assignee: '李四',
    avatar: 'LS',
    createdAt: '2026-01-18',
    estimatedSprint: 'Sprint 6',
    tags: ['前端', '图表'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-003',
    title: '用户权限管理',
    description: '实现角色和权限的分配与管理',
    priority: 'P1',
    storyPoints: 5,
    businessValue: 70,
    complexity: 40,
    status: '已排期',
    assignee: '王五',
    avatar: 'WW',
    createdAt: '2026-01-20',
    estimatedSprint: 'Sprint 6',
    tags: ['后端', '权限'],
    dependencies: ['PBI-001'],
    blockedBy: [],
  },
  {
    id: 'PBI-004',
    title: '文档上传和管理',
    description: '支持文档上传、下载、预览和版本控制',
    priority: 'P1',
    storyPoints: 8,
    businessValue: 65,
    complexity: 60,
    status: '开发中',
    assignee: '赵六',
    avatar: 'ZL',
    createdAt: '2026-01-22',
    estimatedSprint: 'Sprint 5',
    tags: ['前端', '后端'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-005',
    title: '移动端响应式适配',
    description: '优化移动端显示效果和交互体验',
    priority: 'P2',
    storyPoints: 3,
    businessValue: 45,
    complexity: 25,
    status: '待细化',
    assignee: '孙七',
    avatar: 'SQ',
    createdAt: '2026-01-25',
    estimatedSprint: 'Sprint 7',
    tags: ['前端', '移动端'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-006',
    title: '数据导出功能',
    description: '支持将数据导出为Excel、PDF等格式',
    priority: 'P2',
    storyPoints: 5,
    businessValue: 55,
    complexity: 35,
    status: '已细化',
    assignee: '周八',
    avatar: 'ZB',
    createdAt: '2026-01-28',
    estimatedSprint: 'Sprint 7',
    tags: ['后端'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-007',
    title: '性能优化',
    description: '优化系统响应速度和资源占用',
    priority: 'P1',
    storyPoints: 13,
    businessValue: 75,
    complexity: 90,
    status: '待细化',
    assignee: '未分配',
    avatar: 'UN',
    createdAt: '2026-02-01',
    estimatedSprint: 'Sprint 8',
    tags: ['性能', '优化'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-008',
    title: '消息通知系统',
    description: '实现实时消息推送和通知管理',
    priority: 'P2',
    storyPoints: 8,
    businessValue: 60,
    complexity: 55,
    status: '已评审',
    assignee: '张三',
    avatar: 'ZS',
    createdAt: '2026-02-02',
    estimatedSprint: 'Sprint 7',
    tags: ['前端', '后端'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-009',
    title: '国际化支持',
    description: '添加多语言支持功能',
    priority: 'P3',
    storyPoints: 5,
    businessValue: 30,
    complexity: 45,
    status: '待细化',
    assignee: '李四',
    avatar: 'LS',
    createdAt: '2026-01-30',
    estimatedSprint: '待定',
    tags: ['前端', 'i18n'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-010',
    title: 'API限流控制',
    description: '实现API访问频率限制',
    priority: 'P3',
    storyPoints: 3,
    businessValue: 35,
    complexity: 30,
    status: '已细化',
    assignee: '王五',
    avatar: 'WW',
    createdAt: '2026-01-29',
    estimatedSprint: '待定',
    tags: ['后端', '安全'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-011',
    title: '搜索优化',
    description: '改进搜索算法，提升搜索准确度',
    priority: 'P2',
    storyPoints: 8,
    businessValue: 50,
    complexity: 70,
    status: '待细化',
    assignee: '赵六',
    avatar: 'ZL',
    createdAt: '2026-01-27',
    estimatedSprint: 'Sprint 8',
    tags: ['后端', '搜索'],
    dependencies: [],
    blockedBy: [],
  },
  {
    id: 'PBI-012',
    title: '第三方登录集成',
    description: '支持微信、GitHub等第三方登录',
    priority: 'P1',
    storyPoints: 5,
    businessValue: 80,
    complexity: 50,
    status: '已排期',
    assignee: '孙七',
    avatar: 'SQ',
    createdAt: '2026-01-16',
    estimatedSprint: 'Sprint 6',
    tags: ['后端', '集成'],
    dependencies: [],
    blockedBy: [],
  }
];

const priorityColors: Record<string, { bg: string; border: string; text: string; chart: string }> = {
  P0: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', chart: '#EF5350' },
  P1: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', chart: '#FFB74D' },
  P2: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', chart: '#FFEE58' },
  P3: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', chart: '#66BB6A' },
};

const statusColors: Record<string, string> = {
  '待细化': 'bg-gray-100 text-gray-700',
  '已细化': 'bg-blue-100 text-blue-700',
  '已评审': 'bg-purple-100 text-purple-700',
  '已排期': 'bg-cyan-100 text-cyan-700',
  '开发中': 'bg-orange-100 text-orange-700',
  '已完成': 'bg-green-100 text-green-700',
};

const storyPointColors: Record<number, string> = {
  1: '#E3F2FD',
  2: '#BBDEFB',
  3: '#90CAF9',
  5: '#64B5F6',
  8: '#42A5F5',
  13: '#2196F3',
  21: '#1976D2',
};

export function PBIManagement() {
  const [selectedPBIs, setSelectedPBIs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterStoryPoints, setFilterStoryPoints] = useState<number[]>([]);
  const [highlightedPBI, setHighlightedPBI] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 过滤PBIs
  const filteredPBIs = useMemo(() => {
    let result = [...mockPBIs];

    if (searchTerm) {
      result = result.filter(
        (pbi) =>
          pbi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pbi.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pbi.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPriority.length > 0) {
      result = result.filter((pbi) => filterPriority.includes(pbi.priority));
    }

    if (filterStatus.length > 0) {
      result = result.filter((pbi) => filterStatus.includes(pbi.status));
    }

    if (filterStoryPoints.length > 0) {
      result = result.filter((pbi) => filterStoryPoints.includes(pbi.storyPoints));
    }

    if (highlightedPBI) {
      const highlighted = result.find((pbi) => pbi.id === highlightedPBI);
      if (highlighted) {
        result = [highlighted];
      }
    }

    result.sort((a, b) => {
      let aVal: any = a[sortColumn as keyof typeof a];
      let bVal: any = b[sortColumn as keyof typeof b];

      if (sortColumn === 'priority') {
        const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
        aVal = priorityOrder[a.priority as keyof typeof priorityOrder];
        bVal = priorityOrder[b.priority as keyof typeof priorityOrder];
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [mockPBIs, searchTerm, filterPriority, filterStatus, filterStoryPoints, highlightedPBI, sortColumn, sortDirection]);

  // 计算统计数据
  const stats = useMemo(() => {
    const totalPBIs = mockPBIs.length;
    const totalStoryPoints = mockPBIs.reduce((sum, pbi) => sum + pbi.storyPoints, 0);
    const highPriorityCount = mockPBIs.filter((pbi) => pbi.priority === 'P0' || pbi.priority === 'P1').length;
    const readyCount = mockPBIs.filter((pbi) => pbi.status === '已排期' || pbi.status === '开发中').length;
    const readyRate = ((readyCount / totalPBIs) * 100).toFixed(0);

    return { totalPBIs, totalStoryPoints, highPriorityCount, readyRate };
  }, []);

  // 准备故事点分布数据
  const storyPointDistribution = useMemo(() => {
    const distribution: Record<number, number> = {};
    mockPBIs.forEach((pbi) => {
      distribution[pbi.storyPoints] = (distribution[pbi.storyPoints] || 0) + 1;
    });
    return Object.entries(distribution).map(([points, count]) => ({
      name: `${points}点`,
      value: count,
      points: parseInt(points),
      totalPoints: count * parseInt(points),
    }));
  }, []);

  // 准备Sprint进度数据
  const sprintProgressData = useMemo(() => {
    const sprints = ['Sprint 5', 'Sprint 6', 'Sprint 7', 'Sprint 8'];
    return sprints.map(sprint => {
      const sprintPBIs = mockPBIs.filter(pbi => pbi.estimatedSprint === sprint);
      const completed = sprintPBIs.filter(pbi => pbi.status === '已完成').length;
      const inProgress = sprintPBIs.filter(pbi => pbi.status === '开发中').length;
      const planned = sprintPBIs.filter(pbi => pbi.status === '已排期').length;
      const total = sprintPBIs.length;
      
      return {
        sprint,
        completed,
        inProgress,
        planned,
        total,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });
  }, []);

  // 准备状态分布数据
  const statusDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    mockPBIs.forEach((pbi) => {
      distribution[pbi.status] = (distribution[pbi.status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count,
      pbis: mockPBIs.filter((pbi) => pbi.status === status),
    }));
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectPBI = (id: string) => {
    setSelectedPBIs((prev) =>
      prev.includes(id) ? prev.filter((pbiId) => pbiId !== id) : [...prev, id]
    );
  };

  const handleScatterClick = (pbi: PBI) => {
    setHighlightedPBI(pbi.id);
    setTimeout(() => setHighlightedPBI(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 min-h-0">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
      `}} />

      {/* 面包屑导航 */}
      <div className="bg-white border-b border-slate-200 px-8 py-3">
        <div className="flex items-center text-sm text-slate-600">
          <span>智能项目管理平台</span>
          <ArrowRight size={14} className="mx-2" />
          <span>Sprint启动</span>
          <ArrowRight size={14} className="mx-2" />
          <span className="text-slate-900 font-medium">产品待办项PBIs</span>
        </div>
      </div>

      {/* 页面头部 */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">产品待办项（PBIs）管理</h1>
            <p className="text-slate-500 mt-1">可视化分析与高效管理产品需求</p>
          </div>
          <div className="flex items-center gap-3">
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4" />
                新建PBI
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主体区域：可视化图表和PBI列表 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {/* 全局统计卡片 - 紧凑设计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600">总PBIs数</p>
                <p className="text-xl font-bold text-blue-900">{stats.totalPBIs}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-purple-600">总故事点</p>
                <p className="text-xl font-bold text-purple-900">{stats.totalStoryPoints}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-xs text-red-600">高优先级</p>
                <p className="text-xl font-bold text-red-900">{stats.highPriorityCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-green-600">就绪率</p>
                <p className="text-xl font-bold text-green-900">{stats.readyRate}%</p>
              </div>
            </div>
          </Card>
        </div>
        {/* 优先级四象限矩阵图 - 使用UI组件 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">优先级四象限矩阵</h2>
            <p className="text-sm text-slate-500">悬浮查看详情 • 点击高亮显示</p>
          </div>
          
          <ChartContainer
            config={{
              businessValue: {
                label: "业务价值",
                color: "hsl(var(--chart-1))",
              },
              complexity: {
                label: "复杂度",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[500px]"
          >
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 60,
                left: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="businessValue"
                name="业务价值"
                domain={[0, 100]}
                label={{ value: '业务价值 →', position: 'bottom', offset: -5 }}
              />
              <YAxis
                type="number"
                dataKey="complexity"
                name="复杂度"
                domain={[0, 100]}
                label={{ value: '← 复杂度', angle: -90, position: 'left' }}
              />
              <ReferenceLine x={50} stroke="#94a3b8" strokeDasharray="5 5" />
              <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="5 5" />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const pbi = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
                        <p className="font-semibold text-slate-900 mb-2">{pbi.id}: {pbi.title}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-slate-600">业务价值: <span className="font-medium">{pbi.businessValue}</span></p>
                          <p className="text-slate-600">复杂度: <span className="font-medium">{pbi.complexity}</span></p>
                          <p className="text-slate-600">故事点: <span className="font-medium">{pbi.storyPoints}</span></p>
                          <p className="text-slate-600">优先级: <Badge className={`${priorityColors[pbi.priority].bg} ${priorityColors[pbi.priority].text}`}>{pbi.priority}</Badge></p>
                          <p className="text-slate-600">状态: <Badge className={statusColors[pbi.status]}>{pbi.status}</Badge></p>
                          <p className="text-slate-600">负责人: <span className="font-medium">{pbi.assignee}</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {Object.entries(priorityColors).map(([priority, colors]) => (
                <Scatter
                  key={priority}
                  name={priority}
                  data={mockPBIs.filter((pbi) => pbi.priority === priority)}
                  fill={colors.chart}
                  onClick={(data) => handleScatterClick(data)}
                />
              ))}
            </ScatterChart>
          </ChartContainer>
          
          {/* 象限说明 */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-900">第一象限：战略型</p>
              <p className="text-blue-700">高价值-高复杂度，需仔细规划</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold text-green-900">第二象限：速赢型</p>
              <p className="text-green-700">高价值-低复杂度，优先开发</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-semibold text-yellow-900">第三象限：填充型</p>
              <p className="text-yellow-700">低价值-低复杂度，适时安排</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-900">第四象限：规避型</p>
              <p className="text-red-700">低价值-高复杂度，重新评估</p>
            </div>
          </div>
        </Card>

        {/* 其他可视化图表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 故事点分布 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">故事点分布分析</h3>
              </div>
              <div className="text-xs text-slate-500">
                总计 {stats.totalStoryPoints} 点 • {stats.totalPBIs} 个PBI
              </div>
            </div>
            
            <ChartContainer
              config={{
                value: {
                  label: "数量",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[350px]"
            >
              <RechartsPieChart>
                <Pie
                  data={storyPointDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {storyPointDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={storyPointColors[entry.points] || '#90CAF9'}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0) {
                      const data = payload[0].payload;
                      const percentage = ((data.value / stats.totalPBIs) * 100).toFixed(1);
                      const workloadPercentage = ((data.totalPoints / stats.totalStoryPoints) * 100).toFixed(1);
                      
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: storyPointColors[data.points] || '#90CAF9' }}
                            />
                            <p className="font-semibold text-slate-900">{data.name}</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">PBI数量:</span>
                              <span className="font-medium">{data.value} 个 ({percentage}%)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">总故事点:</span>
                              <span className="font-medium">{data.totalPoints} 点</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">工作量占比:</span>
                              <span className="font-medium">{workloadPercentage}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">平均复杂度:</span>
                              <span className="font-medium">
                                {data.points <= 3 ? '简单' : data.points <= 8 ? '中等' : '复杂'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RechartsPieChart>
            </ChartContainer>
            
            {/* 详细统计表格 */}
            <div className="mt-6">
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-slate-600 mb-2 px-2">
                <div>故事点</div>
                <div className="text-center">数量</div>
                <div className="text-center">总点数</div>
                <div className="text-center">占比</div>
              </div>
              {storyPointDistribution.map((item) => {
                const percentage = ((item.value / stats.totalPBIs) * 100).toFixed(1);
                return (
                  <div key={item.points} className="grid grid-cols-4 gap-4 items-center py-2 px-2 rounded hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: storyPointColors[item.points] || '#90CAF9' }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-center text-sm">{item.value}</div>
                    <div className="text-center text-sm font-medium">{item.totalPoints}</div>
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: storyPointColors[item.points] || '#90CAF9'
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 状态分布 */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">状态分布分析</h3>
            </div>
            
            <ChartContainer
              config={{
                count: {
                  label: "数量",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px] mb-4"
            >
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      const data = payload[0].payload;
                      const percentage = ((data.count / mockPBIs.length) * 100).toFixed(1);
                      
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                          <p className="font-semibold text-slate-900 mb-2">{label}</p>
                          <div className="space-y-1 text-sm">
                            <p>PBI数量: {data.count} 个</p>
                            <p>占比: {percentage}%</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            
            {/* 状态详细统计 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700 mb-3">状态详情</h4>
              {statusDistribution.map((item) => {
                const percentage = ((item.count / mockPBIs.length) * 100).toFixed(1);
                const totalPoints = item.pbis.reduce((sum, pbi) => sum + pbi.storyPoints, 0);
                
                return (
                  <div key={item.status} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={statusColors[item.status]}>{item.status}</Badge>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-600">{item.count} 个</span>
                        <span className="font-medium text-slate-900">{percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <span>故事点: {totalPoints}</span>
                      <Progress value={parseFloat(percentage)} className="w-16 h-1.5" />
                    </div>
                    
                    {/* PBI列表预览 */}
                    <div className="flex gap-1 overflow-x-auto">
                      {item.pbis.slice(0, 3).map((pbi) => (
                        <div key={pbi.id} className="flex-shrink-0 px-2 py-1 bg-white rounded text-xs border">
                          <span className="font-mono text-slate-500">{pbi.id}</span>
                        </div>
                      ))}
                      {item.count > 3 && (
                        <div className="flex-shrink-0 px-2 py-1 bg-slate-200 rounded text-xs text-slate-600">
                          +{item.count - 3}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Sprint进度追踪 */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Sprint进度追踪</h3>
            </div>
            
            <ChartContainer
              config={{
                completed: {
                  label: "已完成",
                  color: "#22c55e",
                },
                inProgress: {
                  label: "进行中",
                  color: "#f59e0b",
                },
                planned: {
                  label: "已计划",
                  color: "#3b82f6",
                },
              }}
              className="h-[200px] mb-4"
            >
              <BarChart data={sprintProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                          <p className="font-semibold text-slate-900 mb-2">{label}</p>
                          <div className="space-y-1 text-sm">
                            <p>已完成: {data.completed} 个</p>
                            <p>进行中: {data.inProgress} 个</p>
                            <p>完成率: {data.completionRate}%</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" />
                <Bar dataKey="planned" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            
            {/* Sprint详细统计 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Sprint详情</h4>
              {sprintProgressData.map((sprint) => (
                <div key={sprint.sprint} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{sprint.sprint}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-600">{sprint.total} 个</span>
                      <span className="font-medium text-green-600">{sprint.completionRate}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <span>进度: {sprint.completed}/{sprint.total}</span>
                    <Progress value={sprint.completionRate} className="w-16 h-1.5" />
                  </div>
                  
                  {/* 状态分布小图标 */}
                  <div className="flex gap-1">
                    {sprint.completed > 0 && (
                      <div className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        完成 {sprint.completed}
                      </div>
                    )}
                    {sprint.inProgress > 0 && (
                      <div className="flex-shrink-0 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                        进行 {sprint.inProgress}
                      </div>
                    )}
                    {sprint.planned > 0 && (
                      <div className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        计划 {sprint.planned}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* PBI列表 - 放在底部 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">
              PBI列表 ({filteredPBIs.length})
            </h3>
            
            {/* 搜索和筛选功能 */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="搜索PBI..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    筛选
                    {(filterPriority.length + filterStatus.length + filterStoryPoints.length) > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {filterPriority.length + filterStatus.length + filterStoryPoints.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">优先级筛选</h4>
                      <div className="flex flex-wrap gap-2">
                        {['P0', 'P1', 'P2', 'P3'].map((priority) => (
                          <Button
                            key={priority}
                            size="sm"
                            variant={filterPriority.includes(priority) ? 'default' : 'outline'}
                            onClick={() =>
                              setFilterPriority((prev) =>
                                prev.includes(priority)
                                  ? prev.filter((p) => p !== priority)
                                  : [...prev, priority]
                              )
                            }
                            className={filterPriority.includes(priority) ? priorityColors[priority].bg : ''}
                          >
                            {priority}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">故事点筛选</h4>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 5, 8, 13, 21].map((points) => (
                          <Button
                            key={points}
                            size="sm"
                            variant={filterStoryPoints.includes(points) ? 'default' : 'outline'}
                            onClick={() =>
                              setFilterStoryPoints((prev) =>
                                prev.includes(points)
                                  ? prev.filter((p) => p !== points)
                                  : [...prev, points]
                              )
                            }
                          >
                            {points}点
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">状态筛选</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(statusColors).map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={filterStatus.includes(status) ? 'default' : 'outline'}
                            onClick={() =>
                              setFilterStatus((prev) =>
                                prev.includes(status)
                                  ? prev.filter((s) => s !== status)
                                  : [...prev, status]
                              )
                            }
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">负责人筛选</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(mockPBIs.map(pbi => pbi.assignee))).map((assignee) => (
                          <Button
                            key={assignee}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            {assignee}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Sprint筛选</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(mockPBIs.map(pbi => pbi.estimatedSprint))).map((sprint) => (
                          <Button
                            key={sprint}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            {sprint}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setFilterPriority([]);
                          setFilterStatus([]);
                          setFilterStoryPoints([]);
                          setSearchTerm('');
                        }}
                      >
                        清除所有筛选
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                      >
                        应用筛选
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {selectedPBIs.length > 0 && (
                <Badge className="bg-blue-100 text-blue-700">
                  已选中 {selectedPBIs.length} 项
                </Badge>
              )}
            </div>
          </div>

          {/* 列表头 */}
          <div className="text-xs text-slate-600 mb-2 grid grid-cols-12 gap-2 px-2">
            <div className="col-span-1"></div>
            <div className="col-span-1 cursor-pointer" onClick={() => handleSort('priority')}>
              优先级 {sortColumn === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
            </div>
            <div className="col-span-5 cursor-pointer" onClick={() => handleSort('title')}>
              标题 {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </div>
            <div className="col-span-1 text-center cursor-pointer" onClick={() => handleSort('storyPoints')}>
              点数 {sortColumn === 'storyPoints' && (sortDirection === 'asc' ? '↑' : '↓')}
            </div>
            <div className="col-span-2">负责人</div>
            <div className="col-span-1">状态</div>
            <div className="col-span-1"></div>
          </div>

          {/* 列表项 */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {filteredPBIs.map((pbi) => (
              <div
                key={pbi.id}
                className={`p-3 rounded-lg border transition-all ${
                  highlightedPBI === pbi.id
                    ? 'bg-blue-50 border-blue-400 shadow-md'
                    : selectedPBIs.includes(pbi.id)
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="grid grid-cols-12 gap-2 items-center text-sm">
                  <div className="col-span-1 flex items-center">
                    <Checkbox
                      checked={selectedPBIs.includes(pbi.id)}
                      onCheckedChange={() => handleSelectPBI(pbi.id)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Badge
                      className={`${priorityColors[pbi.priority].bg} ${priorityColors[pbi.priority].text} ${priorityColors[pbi.priority].border} border`}
                    >
                      {pbi.priority}
                    </Badge>
                  </div>
                  <div className="col-span-5">
                    <p className="font-mono text-xs text-slate-500">{pbi.id}</p>
                    <p className="font-medium text-slate-900">{pbi.title}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                      {pbi.description}
                    </p>
                    {pbi.tags && (
                      <div className="flex gap-1 mt-1">
                        {pbi.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 text-center">
                    <div
                      className="inline-block px-2 py-1 rounded font-semibold text-sm"
                      style={{
                        backgroundColor: storyPointColors[pbi.storyPoints] || '#E3F2FD',
                      }}
                    >
                      {pbi.storyPoints}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                      {pbi.avatar}
                    </div>
                    <span className="text-xs text-slate-700 truncate">{pbi.assignee}</span>
                  </div>
                  <div className="col-span-1">
                    <Badge className={statusColors[pbi.status]}>{pbi.status}</Badge>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          复制
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          查看依赖
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* 附加信息 */}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 pl-10">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>创建于 {pbi.createdAt}</span>
                  </div>
                  <div>Sprint: {pbi.estimatedSprint}</div>
                  {pbi.dependencies.length > 0 && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <LinkIcon className="w-3 h-3" />
                      <span>{pbi.dependencies.length} 个依赖</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 批量操作工具栏 */}
      {selectedPBIs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="p-4 bg-blue-50 border-blue-200 shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-900">
                已选中 {selectedPBIs.length} 个PBI
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  批量分配
                </Button>
                <Button size="sm" variant="outline">
                  移至Sprint
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedPBIs([])}
                >
                  取消选择
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}