import { useState } from 'react';
import { Search, Plus, User, Users, Calendar, TrendingUp, Target, BarChart3, AlertTriangle, Clock, Flame, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Grid3X3, PieChart } from 'lucide-react';
import { ProjectAnalytics } from './ProjectAnalytics';

interface Project {
  id: string;
  name: string;
  isOwner: boolean;
  status: 'healthy' | 'warning' | 'critical' | 'archived';
  progress: number;
  completedPoints: number;
  totalPoints: number;
  teamSize: number;
  daysLeft: number;
  velocity: number;
  quality: string;
  risks: { type: 'blocked' | 'delayed' | 'quality'; label: string; severity: 'high' | 'medium' }[];
  isActive: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: '电商平台重构',
    isOwner: true,
    status: 'healthy',
    progress: 68,
    completedPoints: 13,
    totalPoints: 19,
    teamSize: 5,
    daysLeft: 12,
    velocity: 32,
    quality: 'A',
    risks: [],
    isActive: true
  },
  {
    id: '2',
    name: '移动端优化项目',
    isOwner: false,
    status: 'warning',
    progress: 42,
    completedPoints: 8,
    totalPoints: 19,
    teamSize: 4,
    daysLeft: 8,
    velocity: 28,
    quality: 'B',
    risks: [
      { type: 'delayed', label: '滞后2天', severity: 'medium' },
      { type: 'quality', label: '代码质量下降', severity: 'medium' }
    ],
    isActive: true
  },
  {
    id: '3',
    name: '数据分析系统',
    isOwner: true,
    status: 'critical',
    progress: 25,
    completedPoints: 5,
    totalPoints: 20,
    teamSize: 6,
    daysLeft: 15,
    velocity: 18,
    quality: 'C',
    risks: [
      { type: 'blocked', label: '1个阻塞', severity: 'high' },
      { type: 'delayed', label: '滞后5天', severity: 'high' }
    ],
    isActive: true
  },
  {
    id: '4',
    name: 'AI智能推荐引擎',
    isOwner: false,
    status: 'healthy',
    progress: 85,
    completedPoints: 17,
    totalPoints: 20,
    teamSize: 7,
    daysLeft: 6,
    velocity: 45,
    quality: 'A',
    risks: [],
    isActive: true
  },
  {
    id: '5',
    name: '用户权限系统升级',
    isOwner: true,
    status: 'warning',
    progress: 55,
    completedPoints: 11,
    totalPoints: 20,
    teamSize: 3,
    daysLeft: 10,
    velocity: 25,
    quality: 'B',
    risks: [
      { type: 'quality', label: '测试覆盖不足', severity: 'medium' }
    ],
    isActive: true
  },
  {
    id: '6',
    name: '支付网关集成',
    isOwner: false,
    status: 'archived',
    progress: 100,
    completedPoints: 15,
    totalPoints: 15,
    teamSize: 4,
    daysLeft: 0,
    velocity: 30,
    quality: 'A',
    risks: [],
    isActive: false
  },
  {
    id: '7',
    name: '微服务架构重构',
    isOwner: true,
    status: 'healthy',
    progress: 72,
    completedPoints: 18,
    totalPoints: 25,
    teamSize: 8,
    daysLeft: 14,
    velocity: 38,
    quality: 'A',
    risks: [],
    isActive: true
  },
  {
    id: '8',
    name: '客户服务系统',
    isOwner: false,
    status: 'warning',
    progress: 35,
    completedPoints: 7,
    totalPoints: 20,
    teamSize: 5,
    daysLeft: 18,
    velocity: 22,
    quality: 'B',
    risks: [
      { type: 'delayed', label: '滞后3天', severity: 'medium' }
    ],
    isActive: true
  },
  {
    id: '9',
    name: '数据仓库优化',
    isOwner: true,
    status: 'critical',
    progress: 15,
    completedPoints: 3,
    totalPoints: 20,
    teamSize: 4,
    daysLeft: 20,
    velocity: 12,
    quality: 'C',
    risks: [
      { type: 'blocked', label: '2个阻塞', severity: 'high' },
      { type: 'quality', label: '性能问题', severity: 'high' }
    ],
    isActive: true
  },
  {
    id: '10',
    name: '移动应用重设计',
    isOwner: false,
    status: 'healthy',
    progress: 90,
    completedPoints: 18,
    totalPoints: 20,
    teamSize: 6,
    daysLeft: 5,
    velocity: 42,
    quality: 'A',
    risks: [],
    isActive: true
  },
  {
    id: '11',
    name: '安全审计系统',
    isOwner: true,
    status: 'warning',
    progress: 48,
    completedPoints: 12,
    totalPoints: 25,
    teamSize: 5,
    daysLeft: 16,
    velocity: 28,
    quality: 'B',
    risks: [
      { type: 'quality', label: '安全漏洞', severity: 'medium' }
    ],
    isActive: true
  },
  {
    id: '12',
    name: '内容管理平台',
    isOwner: false,
    status: 'healthy',
    progress: 63,
    completedPoints: 15,
    totalPoints: 24,
    teamSize: 7,
    daysLeft: 11,
    velocity: 35,
    quality: 'A',
    risks: [],
    isActive: true
  }
];

export function ProjectList() {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [sortBy, setSortBy] = useState('最近更新');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'analytics'>('grid');
  const itemsPerPage = 8;

  const filters = ['全部', '我负责的', '有风险', '活跃中', '已归档'];
  const sortOptions = ['最近更新', '名称', '风险等级'];

  // Filter and paginate projects
  const filteredProjects = mockProjects.filter(project => {
    if (activeFilter === '我负责的') return project.isOwner;
    if (activeFilter === '有风险') return project.risks.length > 0;
    if (activeFilter === '活跃中') return project.isActive;
    if (activeFilter === '已归档') return !project.isActive;
    return true;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  if (viewMode === 'analytics') {
    return <ProjectAnalytics projects={mockProjects} onBackToGrid={() => setViewMode('grid')} />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#A5D6A7';
      case 'warning': return '#FFB74D';
      case 'critical': return '#EF5350';
      case 'archived': return '#BDBDBD';
      default: return '#BDBDBD';
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'blocked': return <Flame size={14} className="text-red-500" />;
      case 'delayed': return <Clock size={14} className="text-orange-500" />;
      case 'quality': return <AlertTriangle size={14} className="text-yellow-600" />;
      default: return null;
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
      {/* Status Bar */}
      <div 
        className="h-1.5 w-full" 
        style={{ backgroundColor: getStatusColor(project.status) }}
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{project.name}</h3>
          {project.isOwner && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ml-2 flex-shrink-0">
              <User size={11} className="mr-1" />
              我负责
            </span>
          )}
        </div>

        {/* Basic Info */}
        <div className="flex items-center gap-3 mb-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {project.isActive ? '活跃' : '已归档'}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {project.teamSize}人
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {project.daysLeft}天
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">进度：{project.progress}%</span>
            <span className="text-xs text-slate-500">({project.completedPoints}/{project.totalPoints}故事点)</span>
          </div>
          <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="flex items-center gap-4 mb-5 text-sm">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Target size={15} className="text-blue-500" />
            <span className="font-medium">速度：</span>
            <span className="font-semibold text-blue-600">{project.velocity}点/周</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <BarChart3 size={15} className="text-green-500" />
            <span className="font-medium">质量：</span>
            <span className="font-semibold text-green-600">{project.quality}</span>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="mb-5 min-h-[28px]">
          {project.risks.length > 0 ? (
            <div className="space-y-1.5">
              {project.risks.slice(0, 2).map((risk, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {getRiskIcon(risk.type)}
                  <span className={`font-medium ${
                    risk.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {risk.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="font-medium">✅ 运行正常</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
            进入项目
          </button>
          {project.risks.length > 0 && (
            <button className="px-4 py-2.5 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors">
              处理
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 min-h-0">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">项目总览</h1>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'
                }`}
                title="网格视图"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'analytics' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'
                }`}
                title="分析视图"
              >
                <PieChart size={16} />
              </button>
            </div>

            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
              <Plus size={18} />
              新建项目
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索项目…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 bg-white px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                显示 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProjects.length)} 项，共 {filteredProjects.length} 个项目
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}