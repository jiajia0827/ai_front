import React from 'react';
import { TimelineEvent } from '../data/standData';
import { Clock, User, AlertCircle, MessageSquare, CheckCircle, PlayCircle, StopCircle, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface TimelineProps {
  date: Date;
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ date, events }) => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-1">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
           <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Timeline</span>
        </div>
        <h2 className="text-lg font-bold text-slate-800">
          {format(date, 'MMM d, yyyy')}
        </h2>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span>👥 6 Participants</span>
          <span>✨ 3 Decisions</span>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-5 relative">
        {/* Vertical Line */}
        <div className="absolute left-[29px] top-5 bottom-5 w-0.5 bg-slate-200"></div>

        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = getIconForType(event.type);
            const colorClass = getColorForType(event.type);
            
            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Time & Dot */}
                <div className="flex flex-col items-end min-w-[60px] pt-1">
                   <span className="text-xs font-semibold text-slate-500">{event.time}</span>
                </div>
                
                {/* Node */}
                <div className={clsx(
                  "relative z-10 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0",
                  colorClass
                )}>
                   <Icon size={12} className="text-white" />
                </div>

                {/* Card */}
                <div className="flex-1 pb-2">
                   <div className={clsx(
                     "bg-white p-3 rounded-xl border shadow-sm transition-all hover:shadow-md",
                     event.type === 'blocker' ? "border-red-100 bg-red-50/10" : "border-slate-100"
                   )}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                      </div>
                      
                      {event.speaker && (
                        <div className="flex items-center gap-2 mb-2">
                          <img src={event.speaker.avatar} alt={event.speaker.name} className="w-5 h-5 rounded-full bg-slate-200" />
                          <span className="text-xs font-medium text-slate-600">{event.speaker.name}</span>
                        </div>
                      )}

                      {event.progress !== undefined && (
                        <div className="mb-2">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${event.progress}%` }} 
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5 block text-right">{event.progress}% Complete</span>
                        </div>
                      )}

                      {event.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {event.description}
                        </p>
                      )}

                      {event.decision && (
                        <div className="flex gap-2 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                          <Lightbulb size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-yellow-800 font-medium">{event.decision}</span>
                        </div>
                      )}

                      {event.tags && (
                        <div className="flex gap-1 mt-2">
                          {event.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
        <button className="py-2 px-3 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors">
          Expand Record
        </button>
        <button className="py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors">
          Generate Summary
        </button>
      </div>
    </div>
  );
};

// Helpers
const getIconForType = (type: string) => {
  switch (type) {
    case 'start': return PlayCircle;
    case 'end': return StopCircle;
    case 'blocker': return AlertCircle;
    case 'discussion': return MessageSquare;
    case 'assignment': return CheckCircle;
    case 'update': return User;
    default: return Clock;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'start': return 'bg-blue-500';
    case 'end': return 'bg-slate-500';
    case 'blocker': return 'bg-red-500';
    case 'discussion': return 'bg-purple-500';
    case 'assignment': return 'bg-green-500';
    case 'update': return 'bg-indigo-500';
    default: return 'bg-slate-400';
  }
};
