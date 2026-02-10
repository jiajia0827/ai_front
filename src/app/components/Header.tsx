import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Layers, Filter } from 'lucide-react';
import { cn } from './ui/utils';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  viewMode: 'month' | 'week';
  setViewMode: (mode: 'month' | 'week') => void;
}

export function Header({ currentDate, onPrevMonth, onNextMonth, viewMode, setViewMode }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scrum 每日站会看板</h1>
            <p className="text-sm text-slate-500 font-medium">Daily Standup Dashboard</p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-1 bg-slate-50 rounded-xl px-1 py-1">
             <button onClick={onPrevMonth} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:shadow-sm">
              <ChevronLeft size={18} />
             </button>
             <span className="px-3 text-sm font-semibold text-slate-700 min-w-[100px] text-center">
               {currentDate.toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' })}
             </span>
             <button onClick={onNextMonth} className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:shadow-sm">
              <ChevronRight size={18} />
             </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1" />

          <div className="flex bg-slate-50 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('month')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                viewMode === 'month' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              月视图
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                viewMode === 'week' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              周视图
            </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1" />

          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Users size={14} />
            全部成员
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Filter size={14} />
            迭代 24
          </button>
        </div>
      </div>
    </div>
  );
}
