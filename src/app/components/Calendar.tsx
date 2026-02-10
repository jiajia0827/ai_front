import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { DailyStats } from '../lib/mockData';
import { AlertTriangle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  data: DailyStats[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar: React.FC<CalendarProps> = ({ currentDate, selectedDate, onSelectDate, data }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayData = (date: Date) => data.find(d => isSameDay(d.date, date));

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <span className="text-2xl text-blue-600">📅</span> 
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Done</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> In Progress</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Blocked</div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-50/30">
        {calendarDays.map((day) => {
          const dayData = getDayData(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={clsx(
                "relative p-2 border-b border-r border-slate-100 cursor-pointer transition-all duration-200 group hover:bg-white hover:shadow-md hover:z-10",
                !isCurrentMonth && "bg-slate-50/50 text-slate-300",
                isCurrentMonth && "bg-white",
                isSelected && "ring-2 ring-inset ring-blue-500 bg-blue-50/30 z-10",
                isDayToday && !isSelected && "bg-blue-50/10"
              )}
            >
              {/* Date Number & Weekday */}
              <div className="flex justify-between items-start mb-2">
                <div className={clsx(
                  "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isDayToday ? "bg-blue-600 text-white shadow-blue-200 shadow-lg" : "text-slate-700",
                  !isCurrentMonth && "text-slate-300"
                )}>
                  {format(day, 'd')}
                </div>
                {isCurrentMonth && (
                  <span className="text-[10px] text-slate-400 font-medium hidden md:block group-hover:text-blue-500">
                    {format(day, 'EEE')}
                  </span>
                )}
              </div>

              {isCurrentMonth && dayData?.hasMeeting ? (
                <div className="space-y-1.5">
                   {/* Progress Ring & Stats Row */}
                   <div className="flex items-center justify-between">
                      {/* Mini Progress Ring */}
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="16" cy="16" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                          <circle 
                            cx="16" cy="16" r="14" 
                            fill="none" 
                            stroke="url(#blue-gradient)" 
                            strokeWidth="3" 
                            strokeDasharray={`${(dayData.progress / 100) * 88} 100`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#93C5FD" />
                              <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute text-[8px] font-bold text-slate-600">{dayData.progress}%</span>
                      </div>

                      {/* Task Dots */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: dayData.tasks.done }).map((_, i) => (
                          <div key={`d-${i}`} className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        ))}
                        {Array.from({ length: dayData.tasks.inProgress }).map((_, i) => (
                          <div key={`p-${i}`} className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        ))}
                         {Array.from({ length: dayData.tasks.blocked }).map((_, i) => (
                          <div key={`b-${i}`} className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        ))}
                      </div>
                   </div>

                   {/* Footer Info: Blockers & Duration */}
                   <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-50 mt-1">
                      {dayData.blockingCount > 0 ? (
                        <div className="flex items-center gap-0.5 text-red-500 font-medium bg-red-50 px-1 py-0.5 rounded">
                          <AlertTriangle size={10} />
                          <span>{dayData.blockingCount}</span>
                        </div>
                      ) : <div />}
                      
                      <div className="flex items-center gap-0.5 text-slate-400">
                        <Clock size={10} />
                        <span>{dayData.meetingDuration}m</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-full min-h-[60px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
