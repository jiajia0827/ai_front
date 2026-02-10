import React from 'react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Clock, Users, CheckCircle2, AlertCircle, MessageSquare, Play, Square, ChevronRight, CircleDot } from 'lucide-react';
import { DailyStandup, members } from '../data/standData';
import { cn } from './ui/utils';

interface TimelineViewProps {
  date: Date;
  data?: DailyStandup;
}

export function TimelineView({ date, data }: TimelineViewProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <Clock size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">暂无站会记录</h3>
        <p className="text-slate-500 text-sm mt-2">{format(date, 'yyyy年MM月dd日')} 无会议数据。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/50">
        <div className="flex justify-between items-start mb-4">
           <div>
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">每日站会</span>
                <span className="text-slate-500 text-xs font-medium">{format(date, 'EEEE', { locale: undefined })}</span>
             </div>
             <h2 className="text-xl font-bold text-slate-800">{format(date, 'yyyy年MM月dd日')}</h2>
           </div>
           
           <div className="flex gap-2">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                <MessageSquare size={16} />
              </button>
           </div>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock size={14} className="text-blue-500" />
            <span className="font-semibold">{data.startTime} - {data.endTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users size={14} className="text-purple-500" />
            <span className="font-semibold">{data.attendees.length} 参会</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <AlertCircle size={14} className="text-rose-500" />
            <span className="font-semibold">{data.blockerCount} 阻塞</span>
          </div>
        </div>
      </div>

      {/* Structured Standup List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
        {data.updates.map((update, idx) => {
            const member = members.find(m => m.id === update.memberId);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={update.id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                 {/* Member Header */}
                 <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                       <div className="relative">
                         <img src={member?.avatar} alt={member?.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                         {update.status === 'blocked' && (
                           <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white">
                             <AlertCircle size={10} className="text-white" />
                           </span>
                         )}
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-slate-800">{member?.name}</h4>
                         <p className="text-[10px] text-slate-400 font-medium">{member?.role}</p>
                       </div>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                      update.status === 'done' ? "bg-emerald-50 text-emerald-600" :
                      update.status === 'blocked' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {update.status === 'done' ? '已完成' : update.status === 'blocked' ? '受阻' : '进行中'}
                    </div>
                 </div>

                 {/* The 3 Questions */}
                 <div className="space-y-3">
                    
                    {/* Yesterday */}
                    <div className="flex gap-2">
                      <div className="w-5 shrink-0 flex justify-center pt-0.5">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">昨天完成了什么?</p>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{update.yesterdayWork}</p>
                      </div>
                    </div>

                    {/* Today */}
                    <div className="flex gap-2">
                      <div className="w-5 shrink-0 flex justify-center pt-0.5">
                         <CircleDot size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">今天计划做什么?</p>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{update.todayPlan}</p>
                      </div>
                    </div>

                    {/* Blocker (Conditional) */}
                    {update.blocker && (
                      <div className="flex gap-2 bg-rose-50/50 p-2 rounded-lg border border-rose-100/50">
                        <div className="w-5 shrink-0 flex justify-center pt-0.5">
                           <AlertCircle size={14} className="text-rose-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-rose-400 font-bold uppercase mb-0.5">遇到的障碍</p>
                          <p className="text-xs text-rose-700 font-medium leading-relaxed">{update.blocker}</p>
                        </div>
                      </div>
                    )}
                 </div>
              </motion.div>
            );
          })}

          {/* Decisions Section */}
          {data.decisions.length > 0 && (
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-900 uppercase mb-3 flex items-center gap-2">
                <MessageSquare size={14} />
                会议决策 & 行动项
              </h4>
              <div className="space-y-2">
                {data.decisions.map(d => (
                   <div key={d.id} className="flex gap-2 items-start bg-white/60 p-2 rounded-lg">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                        d.type === 'decision' ? "bg-indigo-500" : "bg-purple-500"
                      )} />
                      <span className="text-xs text-slate-700 font-medium">{d.text}</span>
                   </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
