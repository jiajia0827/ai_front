import React, { useMemo } from 'react';
import { UserStory, Task } from '@/app/data/mockData';
import { format, differenceInDays, addDays, startOfDay, endOfDay } from 'date-fns';
import clsx from 'clsx';

interface GanttChartProps {
  stories: UserStory[];
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
}

const COLORS = {
  'Not Started': '#9CA3AF',
  'In Progress': '#F59E0B',
  'Completed': '#10B981',
  'Blocked': '#EF4444'
};

export const GanttChart: React.FC<GanttChartProps> = ({ stories, tasks, selectedTaskId, onSelectTask }) => {
  // Calculate Timeline Range
  const { startDate, endDate, totalDays } = useMemo(() => {
    if (tasks.length === 0) return { startDate: new Date(), endDate: new Date(), totalDays: 1 };
    
    const starts = tasks.map(t => t.startDate.getTime());
    const ends = tasks.map(t => t.endDate.getTime());
    
    const minStart = startOfDay(new Date(Math.min(...starts)));
    const maxEnd = endOfDay(new Date(Math.max(...ends)));
    
    // Add buffer
    const start = addDays(minStart, -1);
    const end = addDays(maxEnd, 2);
    const days = differenceInDays(end, start);
    
    return { startDate: start, endDate: end, totalDays: days };
  }, [tasks]);

  const dates = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));
  }, [startDate, totalDays]);

  const getPosition = (start: Date, end: Date) => {
    const startOffset = differenceInDays(start, startDate);
    const duration = differenceInDays(end, start) + 1; // Inclusive
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  return (
    <div className="w-full h-full bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-100 font-semibold text-gray-700 text-sm flex justify-between items-center">
        <span>Sprint 进度甘特图</span>
        <div className="flex gap-3 text-xs">
           {Object.entries(COLORS).map(([status, color]) => (
             <div key={status} className="flex items-center gap-1">
               <span className="w-2 h-2 rounded-full" style={{ background: color }} />
               {status}
             </div>
           ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[800px] h-full flex flex-col">
          {/* Header Dates */}
          <div className="flex border-b border-slate-100 bg-slate-50 sticky top-0 z-20 h-8">
            <div className="w-48 flex-shrink-0 border-r border-slate-200 px-2 flex items-center text-xs font-medium text-slate-500">
              任务项
            </div>
            <div className="flex-1 relative">
              {dates.map((date, i) => (
                <div 
                  key={i} 
                  className="absolute top-0 bottom-0 border-l border-slate-100 text-[10px] text-slate-400 pl-1 pt-1 truncate"
                  style={{ left: `${(i / totalDays) * 100}%`, width: `${(1 / totalDays) * 100}%` }}
                >
                  {format(date, 'MM/dd')}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1">
            {stories.map(story => {
              const storyTasks = tasks.filter(t => t.storyId === story.id);
              if (storyTasks.length === 0) return null;

              return (
                <div key={story.id} className="group">
                  {/* Story Row */}
                  <div className="flex bg-slate-50/50 border-b border-slate-100 h-8 items-center">
                    <div className="w-48 flex-shrink-0 px-2 text-xs font-bold text-slate-700 truncate border-r border-slate-200" title={story.title}>
                      {story.id} {story.title}
                    </div>
                    <div className="flex-1 relative h-full">
                       {/* Grid Lines */}
                       {dates.map((_, i) => (
                        <div key={i} className="absolute top-0 bottom-0 border-l border-slate-100" style={{ left: `${(i / totalDays) * 100}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Task Rows */}
                  {storyTasks.map(task => {
                     const { left, width } = getPosition(task.startDate, task.endDate);
                     const isSelected = selectedTaskId === task.id;
                     
                     return (
                       <div 
                        key={task.id} 
                        className={clsx(
                          "flex border-b border-slate-50 h-7 items-center hover:bg-blue-50 cursor-pointer transition-colors",
                          isSelected ? "bg-blue-50" : ""
                        )}
                        onClick={() => onSelectTask(task.id)}
                       >
                         <div className="w-48 flex-shrink-0 px-4 text-xs text-slate-600 truncate border-r border-slate-200 flex items-center justify-between">
                           <span>{task.id} ({task.owner})</span>
                           <span className={clsx("text-[9px] px-1 rounded", 
                             task.status === 'Completed' ? "bg-green-100 text-green-700" :
                             task.status === 'Blocked' ? "bg-red-100 text-red-700" :
                             "bg-gray-100 text-gray-700"
                           )}>{task.status}</span>
                         </div>
                         <div className="flex-1 relative h-full">
                            {/* Grid Lines (Faint) */}
                           {dates.map((_, i) => (
                            <div key={i} className="absolute top-0 bottom-0 border-l border-slate-50" style={{ left: `${(i / totalDays) * 100}%` }} />
                          ))}
                           
                           {/* Task Bar */}
                           <div 
                              className="absolute top-1 bottom-1 rounded-sm shadow-sm opacity-90 hover:opacity-100 transition-all text-[9px] text-white flex items-center px-1 overflow-hidden whitespace-nowrap"
                              style={{ 
                                left, 
                                width,
                                backgroundColor: COLORS[task.status] 
                              }}
                           >
                             {task.estimate}h
                           </div>
                         </div>
                       </div>
                     );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
