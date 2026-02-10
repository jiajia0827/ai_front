import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';
import { radarData, trendData } from '../data/standData';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = ['Radar', 'Trend', 'Distribution', 'Comparison', 'Heatmap'];

export const DataPanel = () => {
  const [activeTab, setActiveTab] = useState('Radar');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
          <span className="text-xl">📈</span> Multi-dimensional Analytics
        </h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === tab 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'Radar' && (
             <motion.div 
               key="radar"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.05 }}
               className="w-full h-full flex items-center justify-around"
             >
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar
                        name="Team A"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                      <Radar
                        name="Team B"
                        dataKey="B"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="#10b981"
                        fillOpacity={0.2}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/3 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                     <h4 className="text-blue-900 font-bold text-sm mb-1">Collaboration Score</h4>
                     <div className="text-2xl font-black text-blue-600">92/100</div>
                     <p className="text-xs text-blue-700/70 mt-1">Top 5% compared to previous sprints.</p>
                  </div>
                   <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                     <h4 className="text-emerald-900 font-bold text-sm mb-1">Efficiency</h4>
                     <div className="text-2xl font-black text-emerald-600">+14%</div>
                     <p className="text-xs text-emerald-700/70 mt-1">Faster resolution of blockers.</p>
                  </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'Trend' && (
             <motion.div 
                key="trend"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
             >
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <Tooltip />
                   <Area 
                     type="monotone" 
                     dataKey="value" 
                     stroke="#3b82f6" 
                     strokeWidth={3}
                     fillOpacity={1} 
                     fill="url(#colorValue)" 
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </motion.div>
          )}
          
          {/* Placeholder for other tabs to save space/complexity for now, but framework is there */}
          {(activeTab !== 'Radar' && activeTab !== 'Trend') && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-slate-400"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 mb-2 flex items-center justify-center text-xl">📊</div>
              <p className="text-sm font-medium">Visualization Component Placeholder</p>
              <p className="text-xs">Select "Radar" or "Trend" for demo.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
