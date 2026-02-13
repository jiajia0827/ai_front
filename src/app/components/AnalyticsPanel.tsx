import { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend,
  ComposedChart, Line
} from 'recharts';
import { cn } from './ui/utils';
import { TrendingUp, PieChart as PieChartIcon, Target, BarChart2, Zap } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsPanel() {
  const [activeTab, setActiveTab] = useState<'radar' | 'trend' | 'dist' | 'compare'>('radar');

  // Enhanced Radar Data
  const radarData = [
    { subject: '进度', A: 120, B: 110, fullMark: 150 },
    { subject: '质量', A: 98, B: 130, fullMark: 150 },
    { subject: '协作', A: 86, B: 130, fullMark: 150 },
    { subject: '沟通', A: 99, B: 100, fullMark: 150 },
    { subject: '风险', A: 85, B: 90, fullMark: 150 },
    { subject: '创新', A: 65, B: 85, fullMark: 150 },
  ];

  // Enhanced Trend Data (Velocity vs Scope)
  const trendData = [
    { day: '周一', completion: 65, velocity: 40, scope: 100 },
    { day: '周二', completion: 75, velocity: 55, scope: 105 },
    { day: '周三', completion: 60, velocity: 45, scope: 110 },
    { day: '周四', completion: 85, velocity: 70, scope: 110 },
    { day: '周五', completion: 90, velocity: 85, scope: 115 },
    { day: '周六', completion: 40, velocity: 20, scope: 115 },
    { day: '周日', completion: 30, velocity: 10, scope: 115 },
  ];

  // Enhanced Distribution Data
  const distData = [
    { name: '功能开发', value: 400 },
    { name: 'Bug修复', value: 300 },
    { name: '代码重构', value: 300 },
    { name: '自动化测试', value: 200 },
  ];

  // Enhanced Comparison Data
  const compareData = [
    { name: '陈亚历', tasks: 12, reviews: 5, efficiency: 92 },
    { name: '张莎拉', tasks: 8, reviews: 10, efficiency: 88 },
    { name: '罗斯', tasks: 15, reviews: 2, efficiency: 95 },
    { name: '王艾米', tasks: 10, reviews: 8, efficiency: 90 },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col p-6">
       <div className="flex items-center justify-between mb-6 shrink-0">
         <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
               <Zap size={24} fill="currentColor" className="opacity-20 absolute" />
               <Zap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">团队效能分析</h3>
              <p className="text-xs text-slate-500 font-medium">Sprint 24 实时数据概览</p>
            </div>
         </div>
         
         <div className="flex bg-slate-100/80 p-1.5 rounded-2xl">
            {[
              { id: 'radar', icon: Target, label: '多维评估' },
              { id: 'trend', icon: TrendingUp, label: '速率趋势' },
              { id: 'dist', icon: PieChartIcon, label: '工作分布' },
              { id: 'compare', icon: BarChart2, label: '成员对比' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-100" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
         </div>
       </div>

       <div className="flex-1 w-full min-h-0 bg-slate-50/50 rounded-2xl border border-slate-100/50 p-4 relative overflow-hidden">
          {activeTab === 'radar' && (
            <div className="flex h-full items-center">
              <div className="w-2/3 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar
                      name="本周表现"
                      dataKey="B"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="上周基准"
                      dataKey="A"
                      stroke="#cbd5e1"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fill="transparent"
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/3 flex flex-col justify-center gap-4 pr-8">
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">综合评分</p>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-black text-slate-800">92</span>
                       <span className="text-sm font-bold text-emerald-500 mb-1">↑ 5%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                       <div className="h-full bg-blue-500 w-[92%] rounded-full" />
                    </div>
                 </div>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">质量指数</p>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-black text-slate-800">98</span>
                       <span className="text-sm font-bold text-emerald-500 mb-1">High</span>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'trend' && (
            <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={trendData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <defs>
                    <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="completion" 
                   stroke="#3b82f6" 
                   strokeWidth={4}
                   fillOpacity={1} 
                   fill="url(#colorComp)" 
                   name="任务完成度"
                 />
                 <Line 
                   type="monotone" 
                   dataKey="scope" 
                   stroke="#94a3b8" 
                   strokeWidth={2}
                   strokeDasharray="5 5"
                   dot={false}
                   name="迭代范围"
                 />
                 <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
               </ComposedChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'dist' && (
            <div className="flex w-full h-full items-center justify-center">
              <ResponsiveContainer width="50%" height="100%">
                 <PieChart>
                    <Pie
                      data={distData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      cornerRadius={6}
                    >
                      {distData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="w-1/3 flex flex-col gap-4">
                 {distData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between group p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all cursor-default">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">{entry.name}</span>
                       </div>
                       <span className="text-sm font-bold text-slate-800">{entry.value}h</span>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareData} barGap={8} margin={{ top: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                   <YAxis hide />
                   <Tooltip 
                     cursor={{fill: '#f1f5f9', radius: 8}} 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                   />
                   <Bar dataKey="tasks" name="任务完成数" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={32}>
                      {compareData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#3b82f6'} />
                      ))}
                   </Bar>
                   <Bar dataKey="reviews" name="代码评审数" fill="#e2e8f0" radius={[6, 6, 6, 6]} barSize={32} />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                </BarChart>
             </ResponsiveContainer>
          )}
       </div>
    </div>
  );
}
