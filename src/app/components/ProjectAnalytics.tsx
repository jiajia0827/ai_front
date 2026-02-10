import { useState, useRef, useEffect } from 'react';
import { Search, Plus, ChevronDown, Grid3X3, PieChart, TrendingUp, Users, Target, Activity, BarChart3, Zap } from 'lucide-react';

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

interface ProjectAnalyticsProps {
  projects: Project[];
  onBackToGrid: () => void;
}

export function ProjectAnalytics({ projects, onBackToGrid }: ProjectAnalyticsProps) {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [sortBy, setSortBy] = useState('最近更新');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  const filters = ['全部', '我负责的', '有风险', '活跃中', '已归档'];
  const sortOptions = ['最近更新', '名称', '风险等级'];

  // Filter projects based on active filter
  const filteredProjects = projects.filter(project => {
    if (activeFilter === '我负责的') return project.isOwner;
    if (activeFilter === '有风险') return project.risks.length > 0;
    if (activeFilter === '活跃中') return project.isActive;
    if (activeFilter === '已归档') return !project.isActive;
    return true;
  });

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoPlay || filteredProjects.length <= 6) return;
    
    const interval = setInterval(() => {
      if (tableRef.current) {
        const container = tableRef.current;
        const scrollAmount = container.scrollTop + 60;
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        if (scrollAmount >= maxScroll) {
          container.scrollTop = 0;
        } else {
          container.scrollTo({ top: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlay, filteredProjects.length]);

  // Calculate health distribution
  const healthStats = {
    healthy: filteredProjects.filter(p => p.status === 'healthy').length,
    warning: filteredProjects.filter(p => p.status === 'warning').length,
    critical: filteredProjects.filter(p => p.status === 'critical').length,
    archived: filteredProjects.filter(p => p.status === 'archived').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'critical': return '#F44336';
      case 'archived': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      case 'archived': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Mock team members for heat map
  const teamMembers = ['张三', '李四', '王五', '赵六', '钱七', '孙八'];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 min-h-0">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">项目分析视图</h1>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button 
                onClick={onBackToGrid}
                className="p-2 rounded-md transition-colors hover:bg-slate-200 text-slate-600" 
                title="网格视图"
              >
                <Grid3X3 size={16} />
              </button>
              <button className="p-2 rounded-md transition-colors bg-white shadow-sm text-blue-600" title="分析视图">
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

      {/* Analytics Content */}
      <div className="flex-1 p-8 overflow-y-auto min-h-0">
        <div className="space-y-8">
          
          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{filteredProjects.length}</div>
                    <div className="text-sm text-slate-500">项目总数</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">+12%</span>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{healthStats.healthy}</div>
                    <div className="text-sm text-slate-500">健康项目</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: `${(healthStats.healthy / filteredProjects.length) * 100}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">{Math.round((healthStats.healthy / filteredProjects.length) * 100)}%</span>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{healthStats.warning + healthStats.critical}</div>
                    <div className="text-sm text-slate-500">风险项目</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full" style={{ width: `${((healthStats.warning + healthStats.critical) / filteredProjects.length) * 100}%` }}></div>
                  </div>
                  <span className="text-xs text-red-600 font-medium">需关注</span>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{Math.round(filteredProjects.reduce((sum, p) => sum + p.velocity, 0) / filteredProjects.length)}</div>
                    <div className="text-sm text-slate-500">平均速度</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">点/周</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Health Overview Donut Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">项目健康度分布</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#4CAF50" strokeWidth="20"
                      strokeDasharray={`${(healthStats.healthy / filteredProjects.length) * 440} 440`} />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#FF9800" strokeWidth="20"
                      strokeDasharray={`${(healthStats.warning / filteredProjects.length) * 440} 440`}
                      strokeDashoffset={`-${(healthStats.healthy / filteredProjects.length) * 440}`} />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#F44336" strokeWidth="20"
                      strokeDasharray={`${(healthStats.critical / filteredProjects.length) * 440} 440`}
                      strokeDashoffset={`-${((healthStats.healthy + healthStats.warning) / filteredProjects.length) * 440}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{filteredProjects.length}</div>
                      <div className="text-sm text-slate-500">项目</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600">健康 {healthStats.healthy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-slate-600">警告 {healthStats.warning}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-600">危险 {healthStats.critical}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-slate-600">归档 {healthStats.archived}</span>
                </div>
              </div>
            </div>

            {/* Progress Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">进度分布</h3>
              <div className="space-y-4">
                {[
                  { range: '0-25%', count: filteredProjects.filter(p => p.progress <= 25).length, color: 'bg-red-500' },
                  { range: '26-50%', count: filteredProjects.filter(p => p.progress > 25 && p.progress <= 50).length, color: 'bg-orange-500' },
                  { range: '51-75%', count: filteredProjects.filter(p => p.progress > 50 && p.progress <= 75).length, color: 'bg-yellow-500' },
                  { range: '76-100%', count: filteredProjects.filter(p => p.progress > 75).length, color: 'bg-green-500' }
                ].map((item) => (
                  <div key={item.range} className="flex items-center gap-3">
                    <div className="w-16 text-sm text-slate-600">{item.range}</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${(item.count / filteredProjects.length) * 100}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm font-medium text-slate-700">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Size Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">团队规模分布</h3>
              <div className="h-48 flex items-end justify-center gap-8">
                {[
                  { size: '1-3人', count: filteredProjects.filter(p => p.teamSize <= 3).length, color: 'bg-gradient-to-t from-blue-400 to-blue-600' },
                  { size: '4-6人', count: filteredProjects.filter(p => p.teamSize > 3 && p.teamSize <= 6).length, color: 'bg-gradient-to-t from-indigo-400 to-indigo-600' },
                  { size: '7+人', count: filteredProjects.filter(p => p.teamSize > 6).length, color: 'bg-gradient-to-t from-purple-400 to-purple-600' }
                ].map((item, idx) => {
                  const maxCount = Math.max(
                    filteredProjects.filter(p => p.teamSize <= 3).length,
                    filteredProjects.filter(p => p.teamSize > 3 && p.teamSize <= 6).length,
                    filteredProjects.filter(p => p.teamSize > 6).length,
                    1
                  );
                  const heightPercent = (item.count / maxCount) * 70 + 15;
                  return (
                    <div key={item.size} className="flex flex-col items-center group cursor-pointer">
                      <div className="text-lg font-bold text-slate-700 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.count} 个项目
                      </div>
                      <div 
                        className={`w-20 ${item.color} rounded-t-lg transition-all duration-500 hover:scale-105 shadow-lg relative overflow-hidden flex items-end justify-center pb-2`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="text-white font-bold text-xl">{item.count}</span>
                      </div>
                      <div className="text-sm text-slate-600 mt-3 font-medium">{item.size}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <div className="text-sm text-slate-500 mb-2">
                  总计 {filteredProjects.reduce((sum, p) => sum + p.teamSize, 0)} 人参与 {filteredProjects.length} 个项目
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>小型团队</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>中型团队</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>大型团队</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row - Progress vs Risk */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">项目进度与风险对比</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="w-40 text-sm text-slate-700 font-medium truncate">{project.name}</div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-slate-200 rounded-full h-6">
                      <div 
                        className="h-6 rounded-full flex items-center justify-end pr-3 text-white text-xs font-medium transition-all duration-500"
                        style={{ 
                          width: `${Math.max(project.progress, 8)}%`,
                          backgroundColor: getStatusColor(project.status)
                        }}
                      >
                        {project.progress}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 w-24">{project.completedPoints}/{project.totalPoints} SP</div>
                  <div className="text-xs text-slate-500 w-16">{project.velocity}点/周</div>
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(project.status)}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Fourth Row - Velocity Trends & Team Load */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Velocity Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">迭代速度趋势</h3>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="40" y1={40 + i * 32} x2="360" y2={40 + i * 32} stroke="#f1f5f9" strokeWidth="1" />
                  ))}
                  {/* Velocity line */}
                  <polyline
                    fill="none"
                    stroke="url(#velocityGradient)"
                    strokeWidth="3"
                    points={Array.from({ length: 10 }, (_, i) => {
                      const x = 40 + (i * 32);
                      const baseVelocity = 25;
                      const variation = Math.sin(i * 0.8) * 8 + Math.random() * 6;
                      const velocity = Math.max(baseVelocity + variation, 15);
                      const y = 170 - ((velocity - 15) / 35) * 130;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  {/* Data points */}
                  {Array.from({ length: 10 }, (_, i) => {
                    const x = 40 + (i * 32);
                    const baseVelocity = 25;
                    const variation = Math.sin(i * 0.8) * 8 + Math.random() * 6;
                    const velocity = Math.max(baseVelocity + variation, 15);
                    const y = 170 - ((velocity - 15) / 35) * 130;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="#3b82f6" className="hover:r-6 transition-all cursor-pointer" />
                        <text x={x} y="190" textAnchor="middle" className="text-xs fill-slate-500">S{i + 15}</text>
                      </g>
                    );
                  })}
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="velocityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-600">平均: 28点/周</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-600">目标: 35点/周</span>
                </div>
              </div>
            </div>

            {/* Quality Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">质量等级分布</h3>
              <div className="space-y-6">
                {[
                  { grade: 'A', count: filteredProjects.filter(p => p.quality === 'A').length, color: 'from-green-400 to-green-600', bgColor: 'bg-green-100' },
                  { grade: 'B', count: filteredProjects.filter(p => p.quality === 'B').length, color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-yellow-100' },
                  { grade: 'C', count: filteredProjects.filter(p => p.quality === 'C').length, color: 'from-red-400 to-red-600', bgColor: 'bg-red-100' }
                ].map((item) => {
                  const percentage = filteredProjects.length > 0 ? (item.count / filteredProjects.length) * 100 : 0;
                  return (
                    <div key={item.grade} className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                        <span className="font-bold text-lg">{item.grade}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">质量等级 {item.grade}</span>
                          <span className="text-sm text-slate-500">{item.count} 个项目</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-lg font-bold text-slate-700 w-12 text-right">
                        {Math.round(percentage)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Row - Auto-Scrolling Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">项目关键指标详情</h3>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500">
                  共 {filteredProjects.length} 个项目
                </div>
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isAutoPlay 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isAutoPlay ? '暂停轮播' : '开始轮播'}
                </button>
              </div>
            </div>
            
            <div 
              ref={tableRef}
              className="overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 text-slate-600 font-semibold">项目名称</th>
                    <th className="text-left p-4 text-slate-600 font-semibold">负责人</th>
                    <th className="text-center p-4 text-slate-600 font-semibold">状态</th>
                    <th className="text-center p-4 text-slate-600 font-semibold">进度</th>
                    <th className="text-center p-4 text-slate-600 font-semibold">团队规模</th>
                    <th className="text-center p-4 text-slate-600 font-semibold">速度</th>
                    <th className="text-center p-4 text-slate-600 font-semibold">质量</th>
                    <th className="text-center p-4 text-slate-600 font-semibold">风险</th>
                    <th className="text-center p-4 text-slate-600 font-semibold">剩余天数</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, idx) => (
                    <tr key={project.id} className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all duration-200 ${
                      idx % 2 === 0 ? 'bg-slate-25' : ''
                    }`}>
                      <td className="p-4 text-slate-800 font-medium">{project.name}</td>
                      <td className="p-4 text-slate-600">{project.isOwner ? '我' : '其他'}</td>
                      <td className="p-4 text-center">
                        <div className={`w-4 h-4 rounded-full mx-auto ${getRiskColor(project.status)}`}></div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-slate-700 font-medium">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-700">{project.teamSize}人</td>
                      <td className="p-4 text-center text-slate-700">{project.velocity}点/周</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.quality === 'A' ? 'bg-green-100 text-green-700' :
                          project.quality === 'B' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {project.quality}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {project.risks.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            ⚠ {project.risks.length}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            ✓ 正常
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center text-slate-700 font-medium">{project.daysLeft}天</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProjects.length > 6 && (
              <div className="mt-4 text-center text-xs text-slate-400">
                鼠标悬停暂停轮播，移开继续滚动
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}