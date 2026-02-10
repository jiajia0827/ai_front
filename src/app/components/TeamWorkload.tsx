import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AlertCircle, Construction, Lightbulb, Users2, Activity } from 'lucide-react';
import { cn } from './ui/utils';

const teamData = [
  { name: '张三', role: '后端开发', committed: 22, completed: 18, rate: '82%', focus: '高', avatar: 'ZS' },
  { name: '李四', role: '前端开发', committed: 20, completed: 16, rate: '80%', focus: '中', avatar: 'LS' },
  { name: '王五', role: 'UI/UX设计', committed: 15, completed: 12, rate: '80%', focus: '高', avatar: 'WW' },
  { name: '赵六', role: '质量保证', committed: 8, completed: 6, rate: '75%', focus: '中', avatar: 'ZL' },
];

export function TeamWorkload() {
  return (
    <div className="bg-white p-8 h-full flex gap-10 overflow-hidden">
      {/* Table Section */}
      <div className="flex-[3] flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Users2 className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">团队贡献度</h2>
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>整体完成率: 80%</span>
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex-1">
          <Table>
            <TableHeader className="bg-slate-100/50">
              <TableRow className="border-slate-200">
                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-6">成员</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">角色</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">已承诺 SP</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">已完成 SP</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">完成率</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center pr-6">专注度</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamData.map((member) => (
                <TableRow key={member.name} className="hover:bg-white transition-colors border-slate-100">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {member.avatar}
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{member.role}</TableCell>
                  <TableCell className="text-right text-sm font-mono font-medium text-slate-400">{member.committed}</TableCell>
                  <TableCell className="text-right text-sm font-mono font-bold text-blue-600">{member.completed}</TableCell>
                  <TableCell className="text-right text-sm font-bold text-emerald-600">{member.rate}</TableCell>
                  <TableCell className="text-center pr-6">
                    <div className={cn(
                      "inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                      member.focus === '高' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {member.focus}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Blockers Section */}
      <div className="flex-[1.2] flex flex-col min-w-0">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">阻塞与挑战</h2>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 group hover:border-amber-200 transition-colors">
            <div className="bg-amber-50 p-2 rounded-xl group-hover:bg-amber-100 transition-colors">
              <Construction className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 leading-tight">API 响应延迟</p>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">影响 US-001 后端优化进度</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 group hover:border-rose-200 transition-colors">
            <div className="bg-rose-50 p-2 rounded-xl group-hover:bg-rose-100 transition-colors">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 leading-tight">测试环境不稳定</p>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">导致 US-002 回归测试反复</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 group hover:border-indigo-200 transition-colors">
            <div className="bg-indigo-50 p-2 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 leading-tight">需求变更：平板支持</p>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">US-003 增加额外 UI 适配工作</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
