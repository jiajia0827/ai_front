import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Badge } from './ui/badge';
import { TrendingUp, BarChart3, Target } from 'lucide-react';

const burndownData = [
  { day: 'W1', ideal: 65, actual: 65 },
  { day: 'W2', ideal: 58, actual: 62 },
  { day: 'W3', ideal: 51, actual: 60 },
  { day: 'W4', ideal: 44, actual: 52 },
  { day: 'W5', ideal: 37, actual: 48 },
  { day: 'W6', ideal: 30, actual: 42 },
  { day: 'W7', ideal: 23, actual: null },
  { day: 'W8', ideal: 16, actual: null },
  { day: 'W9', ideal: 9, actual: null },
  { day: 'W10', ideal: 0, actual: null },
];

export function SprintProgress() {
  return (
    <div className="bg-white p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-2.5 rounded-xl">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">迭代燃尽趋势</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-slate-500">Sprint 25.1</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                健康度: 优秀
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">计划 SP</p>
            <p className="text-lg font-bold text-slate-900">65</p>
          </div>
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">已完成</p>
            <p className="text-lg font-bold text-blue-600">42 <span className="text-xs text-slate-400 font-medium ml-1">65%</span></p>
          </div>
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">剩余</p>
            <p className="text-lg font-bold text-rose-500">23</p>
          </div>
          <div className="bg-emerald-600 px-5 py-3 rounded-2xl shadow-lg shadow-emerald-200">
            <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">预测完成</p>
            <p className="text-lg font-bold text-white">100%</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-slate-50/50 rounded-3xl border border-slate-100 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={burndownData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                padding: '12px'
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}
            />
            <Area 
              name="理想燃尽" 
              type="monotone" 
              dataKey="ideal" 
              stroke="#94a3b8" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              fill="transparent"
            />
            <Area 
              name="实际燃尽" 
              type="monotone" 
              dataKey="actual" 
              stroke="#2563eb" 
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorActual)"
              dot={{ r: 5, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
