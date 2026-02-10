import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, ChevronDown, ChevronRight, CheckCircle2, Clock, PlayCircle, Filter, ListTodo } from 'lucide-react';
import { cn } from './ui/utils';

interface Task {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'to-start';
  assignee?: string;
}

interface UserStory {
  id: string;
  title: string;
  priority: 'high' | 'critical' | 'mid';
  status: 'in-progress' | 'completed' | 'to-start';
  category: string;
  points: number;
  actualPoints?: number;
  reviewComment?: string;
  tasks: Task[];
}

const mockStories: UserStory[] = [
  {
    id: 'US-001',
    title: '用户身份验证优化',
    priority: 'high',
    status: 'in-progress',
    category: '后端开发',
    points: 8,
    tasks: [
      { id: 'T-1', name: 'API接口重构', status: 'completed' },
      { id: 'T-2', name: '安全性测试', status: 'in-progress', assignee: '张三' },
      { id: 'T-3', name: '性能优化', status: 'to-start' },
    ]
  },
  {
    id: 'US-002',
    title: '结账流程重设计',
    priority: 'critical',
    status: 'completed',
    category: '前端开发',
    points: 6,
    actualPoints: 6,
    reviewComment: '用户体验提升明显，已通过验收',
    tasks: []
  },
  {
    id: 'US-003',
    title: '移动端响应式适配',
    priority: 'mid',
    status: 'to-start',
    category: 'UI/UX',
    points: 5,
    tasks: []
  }
];

export function SprintBacklog({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const [expandedStories, setExpandedStories] = useState<string[]>(['US-001']);

  const toggleExpand = (id: string) => {
    setExpandedStories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-6 space-y-8">
        <Button variant="ghost" size="icon" onClick={onToggle} className="text-slate-400 hover:text-slate-900">
          <ChevronRight className="w-5 h-5" />
        </Button>
        <div className="rotate-90 origin-center whitespace-nowrap text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase py-10">
          Sprint Backlog
        </div>
      </div>
    );
  }

  return (
    <div className="w-[420px] bg-slate-50 border-r border-slate-200 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-10">
      <div className="p-8 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2 rounded-lg">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">迭代待办</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 text-slate-400 hover:bg-slate-100">
            <ChevronDown className="w-4 h-4 rotate-90" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-slate-900 transition-all outline-none" 
              placeholder="搜索用户故事..."
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {mockStories.map(story => (
          <div key={story.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-slate-300 transition-all group">
            <div 
              className="p-5 cursor-pointer"
              onClick={() => toggleExpand(story.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors">{story.id}</span>
                  <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border", getPriorityColor(story.priority))}>
                    {story.priority}
                  </div>
                </div>
                <div className={cn("transition-transform duration-300", expandedStories.includes(story.id) ? "rotate-180" : "")}>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </div>
              </div>
              
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 leading-snug">{story.title}</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] px-2 py-0.5">
                    {story.category}
                  </Badge>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    {story.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{story.status}</span>
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-900">
                  {story.points} SP
                </div>
              </div>

              {story.reviewComment && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-700 leading-relaxed italic">
                  “ {story.reviewComment} ”
                </div>
              )}
            </div>

            {expandedStories.includes(story.id) && story.tasks.length > 0 && (
              <div className="bg-slate-50/50 border-t border-slate-100 p-5 space-y-3">
                {story.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center",
                        task.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {task.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                      </div>
                      <span className={cn("font-medium", task.status === 'completed' ? "text-slate-400 line-through" : "text-slate-700")}>
                        {task.name}
                      </span>
                    </div>
                    {task.assignee && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">{task.assignee}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
