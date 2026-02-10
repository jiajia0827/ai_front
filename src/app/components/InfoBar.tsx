import React from 'react';
import { Badge } from './ui/badge';
import { Clock, Calendar, Target, Users, ShieldCheck, ChevronRight } from 'lucide-react';

export function InfoBar() {
  return (
    <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between relative z-20">
      <div className="flex items-center space-x-8">
        {/* Sprint Info */}
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-100 p-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">当前迭代</p>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900">Sprint 25.1</span>
              <span className="text-[10px] text-slate-400">Jan 15 - Mar 15</span>
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="flex items-center space-x-2 max-w-xs">
          <div className="bg-emerald-100 p-1.5 rounded-lg">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">迭代目标</p>
            <p className="text-xs font-medium text-slate-700 truncate">优化核心体验，提升系统性能 20%</p>
          </div>
        </div>

        {/* Team */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-8">
          <div className="flex -space-x-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                {['Z', 'L', 'W', 'C'][i-1]}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold">
              +5
            </div>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">交付团队</p>
            <p className="text-xs font-bold text-slate-900">产品开发 A 组</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="flex items-center justify-end space-x-1.5 text-[10px] text-slate-400 mb-0.5">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>最后同步</span>
          </div>
          <p className="text-[11px] font-mono font-medium text-slate-600">2025-01-20 14:30</p>
        </div>
      </div>
    </div>
  );
}
