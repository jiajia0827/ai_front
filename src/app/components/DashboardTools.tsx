import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, History, Map, Share2, FileDown, CalendarDays, Bell, Settings2, HelpCircle } from 'lucide-react';

export function DashboardTools() {
  const [activeView, setActiveView] = React.useState('review');

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between relative z-20">
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">SCRUM BOARD</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Review & Retro</p>
          </div>
        </div>

        <nav className="flex items-center space-x-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveView('review')}
            className={`h-9 text-xs font-bold rounded-xl px-4 transition-all ${
              activeView === 'review' 
                ? 'bg-white shadow-sm text-indigo-600 border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            迭代评审视图
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveView('history')}
            className={`h-9 text-xs font-bold rounded-xl px-4 transition-all flex items-center gap-1.5 ${
              activeView === 'history' 
                ? 'bg-white shadow-sm text-indigo-600 border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            历史轨迹
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveView('roadmap')}
            className={`h-9 text-xs font-bold rounded-xl px-4 transition-all flex items-center gap-1.5 ${
              activeView === 'roadmap' 
                ? 'bg-white shadow-sm text-indigo-600 border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            路线图
          </Button>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 border-r border-slate-200 pr-6">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 rounded-xl">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 rounded-xl">
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="rounded-xl border-slate-200 h-10 px-4 text-xs font-bold text-slate-600">
            <FileDown className="w-4 h-4 mr-2 text-indigo-600" />
            报告
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-6 text-xs font-bold shadow-lg shadow-slate-200">
            分享面板
          </Button>
        </div>
      </div>
    </div>
  );
}
