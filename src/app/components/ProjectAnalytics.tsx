import { useState, useRef, useEffect } from 'react';
import { Search, Plus, ChevronDown, Grid3X3, PieChart, TrendingUp, TrendingDown, Users, Target, Activity, BarChart3, Zap, RefreshCw, Clock } from 'lucide-react';
import { ProjectHealthDashboard } from '@/app/components/project-health-dashboard';
import ProjectProgressChart from '@/app/components/project-progress-chart';
import TeamSizeChart from '@/app/components/team-size-chart';
import QualityGradeChart from '@/app/components/quality-grade-chart';
import IterationSpeedChart from '@/app/components/iteration-speed-chart';

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
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [pageVisible, setPageVisible] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageVisible(true);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredProjects = projects;

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
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 min-h-0 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(100 116 139) 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>
      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-3 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl font-bold text-slate-900 transition-all duration-700 ${
              pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>项目分析视图</h1>
            <div className={`flex items-center gap-2 text-xs text-slate-500 transition-all duration-700 delay-100 ${
              pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
              <Clock size={12} />
              <span>更新于 {lastUpdate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 transition-all duration-700 delay-300 ${
            pageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all hover:scale-105 disabled:opacity-50"
              title="刷新数据"
            >
              <RefreshCw size={16} className={`text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

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
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="flex-1 p-8 overflow-y-auto min-h-0">
        <div className="space-y-8">
          
          {/* Top Row - Key Metrics */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${
            pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
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
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: pageVisible ? '75%' : '0%' }}></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-600" />
                    <span className="text-xs text-green-600 font-medium">12%</span>
                  </div>
                </div>
                <svg className="w-full h-8 mt-2 opacity-40" viewBox="0 0 100 20">
                  <polyline points="0,15 20,12 40,14 60,8 80,10 100,5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
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
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000" style={{ width: pageVisible ? `${(healthStats.healthy / filteredProjects.length) * 100}%` : '0%' }}></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-600" />
                    <span className="text-xs text-slate-600 font-medium">{Math.round((healthStats.healthy / filteredProjects.length) * 100)}%</span>
                  </div>
                </div>
                <svg className="w-full h-8 mt-2 opacity-40" viewBox="0 0 100 20">
                  <polyline points="0,12 20,10 40,11 60,7 80,8 100,6" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
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
                    <div className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-1000" style={{ width: pageVisible ? `${((healthStats.warning + healthStats.critical) / filteredProjects.length) * 100}%` : '0%' }}></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity size={12} className="text-red-600" />
                    <span className="text-xs text-red-600 font-medium">需关注</span>
                  </div>
                </div>
                <svg className="w-full h-8 mt-2 opacity-40" viewBox="0 0 100 20">
                  <polyline points="0,10 20,13 40,11 60,15 80,14 100,16" fill="none" stroke="#ef4444" strokeWidth="2" />
                </svg>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
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
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-1000" style={{ width: pageVisible ? '68%' : '0%' }}></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-purple-600" />
                    <span className="text-xs text-slate-600 font-medium">点/周</span>
                  </div>
                </div>
                <svg className="w-full h-8 mt-2 opacity-40" viewBox="0 0 100 20">
                  <polyline points="0,14 20,11 40,13 60,9 80,10 100,7" fill="none" stroke="#9333ea" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Second Row - Top Charts */}
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 transition-all duration-700 delay-100 ${
            pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Health Overview - 2 columns */}
            <div className="lg:col-span-2 flex items-center justify-center">
              <ProjectHealthDashboard />
            </div>

            {/* Right Column - 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Team Size Chart */}
              <TeamSizeChart />
              
              {/* Quality Grade Chart */}
              <QualityGradeChart />
            </div>
          </div>

          {/* Third Row - Progress Distribution (full width) */}
          <div className={`transition-all duration-700 delay-200 ${
            pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <ProjectProgressChart />
          </div>

          {/* Fourth Row - Iteration Speed (full width) */}
          <div className={`transition-all duration-700 delay-300 ${
            pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <IterationSpeedChart />
          </div>

          {/* Fifth Row - Progress vs Risk */}
          <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-700 delay-400 ${
            pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
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


          <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-700 delay-500 ${
            pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
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