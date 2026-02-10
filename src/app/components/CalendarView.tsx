import React, { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Clock, MoreHorizontal, Edit, FileText, CheckSquare } from 'lucide-react';
import { cn } from './ui/utils';
import { DailyStandup, members } from '../data/standData';

interface CalendarViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  data: DailyStandup[];
}

export function CalendarView({ currentDate, selectedDate, onSelectDate, data }: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full flex flex-col">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 shrink-0">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 bg-slate-50 gap-[1px] border-b border-l border-slate-100 auto-rows-fr overflow-y-auto min-h-0">
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
        {calendarDays.map((day, dayIdx) => {
          const dayData = data.find(d => isSameDay(d.date, day));
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);
          const dateStr = day.toISOString();
          
          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(day)}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
              className={cn(
                "relative bg-white p-2 min-h-[100px] transition-all cursor-pointer group hover:z-20",
                !isCurrentMonth && "bg-slate-50/50 text-slate-400",
                isSelected && "ring-2 ring-inset ring-blue-500 z-10 bg-blue-50/10",
                "hover:shadow-lg border-r border-b border-slate-100" 
              )}
            >
              {/* Quick Actions Menu (Visible on Hover) */}
              <AnimatePresence>
                {hoveredDate === dateStr && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-2 right-2 flex gap-1 z-30"
                  >
                     <button className="p-1 bg-white border border-slate-100 rounded-md shadow-sm hover:text-blue-600 hover:border-blue-200" title="编辑记录">
                        <Edit size={12} />
                     </button>
                     <button className="p-1 bg-white border border-slate-100 rounded-md shadow-sm hover:text-blue-600 hover:border-blue-200" title="查看报告">
                        <FileText size={12} />
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header: Date & Weekday */}
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all",
                  isDayToday ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-700",
                  !isCurrentMonth && "text-slate-400",
                  isSelected && !isDayToday && "bg-blue-100 text-blue-700"
                )}>
                  {format(day, 'd')}
                </span>
                {dayData && (
                   <span className="text-[10px] font-medium text-slate-400 flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded-full">
                     <Clock size={10} />
                     {dayData.duration}分
                   </span>
                )}
              </div>

              {/* Data Content */}
              {dayData ? (
                <div className="flex flex-col gap-2">
                  {/* Progress Ring & Stats */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          className="text-slate-100"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 14}
                          strokeDashoffset={2 * Math.PI * 14 * (1 - dayData.efficiencyScore / 100)}
                          stroke="url(#blueGradient)"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold text-slate-600">
                        {dayData.efficiencyScore}%
                      </span>
                    </div>
                    
                    {/* Status Dots */}
                    <div className="flex flex-col gap-1 w-full">
                       <div className="flex items-center justify-between text-[8px] text-slate-400">
                          <span>进度</span>
                          <span className="font-bold text-slate-600">{dayData.taskStats.done + dayData.taskStats.inProgress + dayData.taskStats.blocked}</span>
                       </div>
                       <div className="flex gap-0.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div style={{ width: `${(dayData.taskStats.done / (dayData.taskStats.done + dayData.taskStats.inProgress + dayData.taskStats.blocked)) * 100}%` }} className="bg-emerald-400" />
                         <div style={{ width: `${(dayData.taskStats.inProgress / (dayData.taskStats.done + dayData.taskStats.inProgress + dayData.taskStats.blocked)) * 100}%` }} className="bg-amber-400" />
                         <div style={{ width: `${(dayData.taskStats.blocked / (dayData.taskStats.done + dayData.taskStats.inProgress + dayData.taskStats.blocked)) * 100}%` }} className="bg-rose-400" />
                       </div>
                    </div>
                  </div>

                  {/* Blocker Alert */}
                  {dayData.blockerCount > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md w-full justify-center shadow-sm">
                      <AlertTriangle size={10} fill="currentColor" className="text-rose-500" />
                      {dayData.blockerCount} 个阻塞项
                    </div>
                  )}
                </div>
              ) : (
                !isWeekend(day) && isCurrentMonth && (
                  <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                        <Edit size={12} /> 记录
                     </button>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}
