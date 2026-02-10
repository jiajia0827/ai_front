import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Cell, ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import { 
  TrendingUp, Zap, Target, Sparkles, 
  ArrowUpRight, Info, ChevronRight, Activity, 
  ShieldAlert, RefreshCcw, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // 修正motion导入（原代码是motion/react，应为framer-motion）
import { cn } from './ui/utils';

// --- Components for Specific Visualizations ---

const Counter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let totalMiliseconds = duration * 1000;
    let incrementTime = totalMiliseconds / end;
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === Math.floor(end)) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
};

const SatisfactionRing = ({ percentage }: { percentage: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* Background Micro-particles Effect (Simplified) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{ y: 100, x: Math.random() * 200, opacity: 0 }}
            animate={{ y: -50, opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]">
        {/* Track */}
        <circle
          cx="50%" cy="50%" r={radius}
          stroke="#f1f5f9" strokeWidth="12" fill="transparent"
        />
        {/* Progress Ring */}
        <motion.circle
          cx="50%" cy="50%" r={radius}
          stroke="url(#grad1)" strokeWidth="12" fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <div className="text-3xl font-black text-slate-800 tracking-tighter">
          <Counter value={percentage} />%
        </div>
        <div className="flex items-center text-[10px] font-bold text-amber-500 mt-1">
          <ArrowUpRight className="w-3 h-3 mr-0.5" />
          +4.2% 增长
        </div>
      </div>
    </div>
  );
};

const Speedometer = ({ value }: { value: number }) => {
  return (
    <div className="relative w-full h-32 flex flex-col items-center overflow-hidden">
      <svg className="w-40 h-20 overflow-visible">
        <path d="M 10 80 A 70 70 0 0 1 150 80" stroke="#f1f5f9" strokeWidth="12" fill="none" strokeLinecap="round" />
        <motion.path 
          d="M 10 80 A 70 70 0 0 1 150 80" 
          stroke="url(#speedGrad)" strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray="220"
          initial={{ strokeDashoffset: 220 }}
          animate={{ strokeDashoffset: 220 - (value / 100) * 220 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <defs>
          <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-12 text-center">
        <p className="text-xl font-black text-slate-800 tracking-tighter">{value}%</p>
        <p className="text-[9px] font-black text-slate-400 uppercase">迭代效率</p>
      </div>
    </div>
  );
};

const Thermometer = ({ value }: { value: number }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-4 h-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <motion.div 
          className="absolute bottom-0 w-full"
          style={{ backgroundColor: value > 50 ? '#EF4444' : '#3B82F6' }}
          initial={{ height: 0 }}
          animate={{ height: `${value}%` }}
          transition={{ duration: 1.5 }}
        />
      </div>
      <p className="mt-3 text-[9px] font-black text-slate-400 uppercase">风险指数</p>
      <p className="text-xs font-bold text-slate-700 mt-1">{value}%</p>
    </div>
  );
};

// --- Main Component ---

export function Retrospective() {
  const [activeTab, setActiveTab] = useState('overview');
  const [radarHover, setRadarHover] = useState<string | null>(null);

  const radarData = [
    { subject: '协作效率', current: 120, target: 140, fullMark: 150, priority: 2 },
    { subject: '技术质量', current: 98, target: 130, fullMark: 150, priority: 4 },
    { subject: '需求明确', current: 86, target: 140, fullMark: 150, priority: 5 },
    { subject: '交付速度', current: 99, target: 125, fullMark: 150, priority: 3 },
    { subject: '压力状态', current: 110, target: 100, fullMark: 150, priority: 1 },
    { subject: '沟通氛围', current: 140, target: 145, fullMark: 150, priority: 1 },
  ];

  const bubbleData = [
    { name: '代码评审优化', difficulty: 40, impact: 85, range: 70, type: 'positive', roi: '220%', desc: '发现Bug数下降30%' },
    { name: '自动化测试', difficulty: 60, impact: 90, range: 80, type: 'positive', roi: '180%', desc: '回归耗时减少40%' },
    { name: '需求澄清不清', difficulty: 75, impact: -65, range: 60, type: 'to-improve', roi: 'N/A', desc: '影响2个故事交付' },
    { name: '文档同步', difficulty: 30, impact: 45, range: 40, type: 'positive', roi: '150%', desc: '新成员上手提速' },
  ];

  const techDebtData = [
    { name: 'Sprint 21', eliminated: 40, remaining: 60 },
    { name: 'Sprint 22', eliminated: 35, remaining: 55 },
    { name: 'Sprint 23', eliminated: 50, remaining: 40 },
    { name: 'Sprint 24', eliminated: 45, remaining: 35 },
    { name: 'Sprint 25', eliminated: 65, remaining: 20 },
  ];

  return (
    <div className="bg-[#f8fafc] p-8 h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      
      {/* 1. Header & Navigation */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">迭代回顾数据洞察 <span className="text-indigo-500 font-normal">v2.0</span></h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Scrum Intelligence Dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {['overview', 'details', 'predict'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
                activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab === 'overview' ? '概览视图' : tab === 'details' ? '详情对账' : '未来预测'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Row: Satisfaction & Radar */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Satisfaction Module */}
        <div className="col-span-4 bg-white rounded-[40px] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">综合满意度</h3>
            <Info className="w-4 h-4 text-slate-300" />
          </div>
          <SatisfactionRing percentage={92.4} />
          <div className="mt-4 grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">活跃贡献</p>
              <p className="text-sm font-black text-indigo-600">88.5%</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">交付质量</p>
              <p className="text-sm font-black text-emerald-600">96.0%</p>
            </div>
          </div>
        </div>

        {/* Team Effectiveness Radar */}
        <div className="col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">交互式效能雷达</h3>
              <p className="text-lg font-black text-slate-800 tracking-tight mt-1">六维能力立体分析</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                <div className="w-3 h-1 bg-indigo-600/30 border border-indigo-600 rounded-sm" />
                <span>当前能力</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                <div className="w-3 h-0.5 border-t-2 border-dashed border-slate-300" />
                <span>目标边界</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex min-h-0">
            <div className="flex-[3] min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" strokeWidth={0.5} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 800 }} 
                  />
                  {/* Heatmap Layer (Background Gradient) */}
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#94A3B8"
                    strokeDasharray="5 5"
                    fill="transparent"
                  />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    fill="#4F46E5"
                    fillOpacity={0.15}
                    onMouseMove={(e) => setRadarHover(e ? e.subject : null)}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-[1] flex flex-col justify-center space-y-4 border-l border-slate-100 pl-8">
              {radarData.slice(0, 3).map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{item.subject}</span>
                    <span className="text-[11px] font-black text-indigo-600">{item.current}/{item.target}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.current/item.target)*100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
              <button className="text-[10px] font-black text-indigo-500 uppercase flex items-center mt-2 group">
                查看全维度分析<ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mid Row: Action Impact Bubble & Goal Dashboard */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Action Impact Bubble Chart */}
        <div className="col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">价值流与影响因子气泡图</h3>
              <p className="text-lg font-black text-slate-800 tracking-tight mt-1">ROI 与实施难度多维矩阵</p>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Positive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">To Improve</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    dataKey="difficulty" 
                    name="实施难度" 
                    unit="%" 
                    axisLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    label={{ value: '实施难度', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="impact" 
                    name="预期收益" 
                    unit="%" 
                    axisLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    label={{ value: '预期收益', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 700 }}
                  />
                  <ZAxis type="number" dataKey="range" range={[400, 2500]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800">
                            <p className="text-xs font-black uppercase mb-2 text-indigo-400">{data.name}</p>
                            <div className="space-y-1.5">
                              <p className="text-[11px] flex justify-between"><span>影响度</span> <span className="font-black">{Math.abs(data.impact)}</span></p>
                              <p className="text-[11px] flex justify-between"><span>ROI:</span> <span className="font-black text-emerald-400">{data.roi}</span></p>
                              <p className="text-[11px] border-t border-slate-800 pt-1.5 mt-1.5 opacity-70 italic">{data.desc}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Actions" data={bubbleData}>
                    {bubbleData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.type === 'positive' ? 'url(#posBubble)' : 'url(#negBubble)'} 
                        stroke={entry.type === 'positive' ? '#10B981' : '#EF4444'}
                      />
                    ))}
                  </Scatter>
                  <defs>
                    <radialGradient id="posBubble">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </radialGradient>
                    <radialGradient id="negBubble">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </radialGradient>
                  </defs>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100 group hover:bg-emerald-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-emerald-200 shadow-sm text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-800 tracking-tight">代码评审质量提升</span>
                  </div>
                  <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">ROI: 220%</span>
                </div>
                <div className="space-y-1.5 ml-10">
                  <p className="text-[11px] text-slate-500 flex items-center">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2" /> 
                    发现Bug数下降30%
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2" /> 
                    平均耗时减少15min
                  </p>
                </div>
              </div>
              
              <div className="bg-rose-50/50 rounded-3xl p-5 border border-rose-100 group hover:bg-rose-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-rose-200 shadow-sm text-rose-600">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-800 tracking-tight">需求澄清不充分</span>
                  </div>
                  <span className="text-[9px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">高风险</span>
                </div>
                <div className="space-y-1.5 ml-10">
                  <p className="text-[11px] text-slate-500 flex items-center">
                    <span className="w-1 h-1 bg-rose-500 rounded-full mr-2" /> 
                    影响2个故事交付
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center">
                    <span className="w-1 h-1 bg-rose-500 rounded-full mr-2" /> 
                    返工率提升18%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal & Metrics Dashboard */}
        <div className="col-span-4 bg-white rounded-[40px] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">核心指标监控</h3>
            <RefreshCcw className="w-4 h-4 text-slate-300" />
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">迭代效率</span>
                <Zap className="w-3 h-3 text-amber-500" />
              </div>
              <Speedometer value={85} />
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase">风险指数</span>
                <Target className="w-3 h-3 text-blue-500" />
              </div>
              <Thermometer value={35} />
            </div>
            
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">技术债务趋势</span>
                <BrainCircuit className="w-3 h-3 text-indigo-500" />
              </div>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techDebtData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 9 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fontWeight: 700 }} width={60} />
                    <Bar dataKey="eliminated" fill="#10B981" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="remaining" fill="#E2E8F0" radius={[0, 4, 4, 0]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', fontSize: '10px', padding: '8px' }}
                      formatter={(value, name) => [value, name === 'eliminated' ? '已消除' : '剩余']}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}