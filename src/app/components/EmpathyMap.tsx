import React from 'react';
import { User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface EmpathyMapProps {
  roleType?: 'PO' | 'SM' | 'DEV' | 'QA' | 'UI' | 'ST';
}

const EmpathyMap = ({ roleType = 'DEV' }: EmpathyMapProps) => {
  // 模拟数据
  const poData = {
    priority: [
      { name: '高', value: 8 },
      { name: '中', value: 12 },
      { name: '低', value: 5 }
    ],
    value: [
      { name: 'Sprint1', value: 45 },
      { name: 'Sprint2', value: 62 },
      { name: 'Sprint3', value: 78 },
      { name: 'Sprint4', value: 85 }
    ]
  };

  const smData = {
    health: [
      { subject: '沟通', A: 4 },
      { subject: '交付', A: 3.5 },
      { subject: '质量', A: 4.5 },
      { subject: '协作', A: 4 },
      { subject: '改进', A: 3 }
    ],
    velocity: [
      { name: 'S1', value: 25 },
      { name: 'S2', value: 28 },
      { name: 'S3', value: 32 },
      { name: 'S4', value: 30 }
    ]
  };

  const devData = {
    burndown: [
      { day: 'D1', remaining: 40 },
      { day: 'D2', remaining: 35 },
      { day: 'D3', remaining: 28 },
      { day: 'D4', remaining: 20 },
      { day: 'D5', remaining: 12 }
    ],
    commits: [
      { name: '模块A', value: 45 },
      { name: '模块B', value: 32 },
      { name: '模块C', value: 28 }
    ]
  };

  const qaData = {
    defects: [
      { name: '严重', value: 3, color: '#ef4444' },
      { name: '一般', value: 8, color: '#f59e0b' },
      { name: '轻微', value: 12, color: '#10b981' }
    ],
    coverage: [
      { name: '功能', value: 85 },
      { name: 'API', value: 92 },
      { name: '自动化', value: 78 }
    ]
  };

  const renderTopLeft = () => {
    switch (roleType) {
      case 'PO':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">需求优先级分布</h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={poData.priority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}>
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-slate-600 mt-2">总计: 25个需求</div>
          </div>
        );
      case 'SM':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">团队健康度</h3>
            <ResponsiveContainer width="100%" height="80%">
              <RadarChart data={smData.health}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <Radar dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'DEV':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">任务燃尽图</h3>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={devData.burndown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="remaining" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'QA':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">缺陷分布</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={qaData.defects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">工作进度</h3>
            <div className="space-y-3 flex-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>任务完成</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderTopRight = () => {
    switch (roleType) {
      case 'PO':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">价值燃起图</h3>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={poData.value}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'SM':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">团队速度趋势</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={smData.velocity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'DEV':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">代码贡献</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={devData.commits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'QA':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">测试覆盖率</h3>
            <div className="space-y-4 flex-1">
              {qaData.coverage.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-bold text-blue-600">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-3" />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">关键指标</h3>
            <div className="space-y-3 flex-1">
              <div className="text-sm">完成率: 85%</div>
            </div>
          </div>
        );
    }
  };

  const renderBottomLeft = () => {
    switch (roleType) {
      case 'PO':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">待办列表状态</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex justify-between items-center">
                <span>待分析</span>
                <span className="px-2 py-1 bg-gray-100 rounded">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>已就绪</span>
                <span className="px-2 py-1 bg-blue-100 rounded">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span>进行中</span>
                <span className="px-2 py-1 bg-yellow-100 rounded">12</span>
              </div>
            </div>
          </div>
        );
      case 'SM':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">障碍追踪</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>待解决: 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>处理中: 3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>已解决: 15</span>
              </div>
            </div>
          </div>
        );
      case 'DEV':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">技术债务</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex justify-between">
                <span>代码重构</span>
                <span className="text-orange-600">3项</span>
              </div>
              <div className="flex justify-between">
                <span>性能优化</span>
                <span className="text-orange-600">2项</span>
              </div>
              <div className="flex justify-between">
                <span>文档更新</span>
                <span className="text-orange-600">5项</span>
              </div>
            </div>
          </div>
        );
      case 'QA':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">风险等级</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>高风险: 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>中风险: 4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>低风险: 8</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">工作内容</h3>
            <div className="space-y-2 text-sm flex-1">
              <div>• 日常任务</div>
              <div>• 会议参与</div>
              <div>• 文档编写</div>
            </div>
          </div>
        );
    }
  };

  const renderBottomRight = () => {
    switch (roleType) {
      case 'PO':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">干系人反馈</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-2">
                <span>⭐⭐⭐⭐⭐</span>
                <span>非常满意</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⭐⭐⭐⭐</span>
                <span>满意</span>
              </div>
              <div className="text-gray-500">平均评分: 4.5/5</div>
            </div>
          </div>
        );
      case 'SM':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">改进行动</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="w-3 h-3" />
                <span>优化站会流程</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly className="w-3 h-3" />
                <span>提升代码质量</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly className="w-3 h-3" />
                <span>加强团队协作</span>
              </div>
            </div>
          </div>
        );
      case 'DEV':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">Code Review</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex justify-between">
                <span>已评审</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span>待评审</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span>评审质量</span>
                <span className="text-green-600">优秀</span>
              </div>
            </div>
          </div>
        );
      case 'QA':
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">自动化测试</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex justify-between">
                <span>脚本数量</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span>通过率</span>
                <span className="text-green-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span>执行时长</span>
                <span>12分钟</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-3">成果输出</h3>
            <div className="space-y-2 text-sm flex-1">
              <div>• 完成交付</div>
              <div>• 质量保证</div>
              <div>• 持续改进</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      
      {/* Diagonal Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      </div>

      {/* Central Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center shadow-md">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="w-8 h-8 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Top Triangle */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2" style={{width: 0, height: 0, borderLeft: '150px solid transparent', borderRight: '150px solid transparent', borderBottom: '150px solid white', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'}}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[260px]">
          {renderTopLeft()}
        </div>
      </div>

      {/* Bottom Triangle */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2" style={{width: 0, height: 0, borderLeft: '150px solid transparent', borderRight: '150px solid transparent', borderTop: '150px solid white', filter: 'drop-shadow(0 -4px 6px rgba(0,0,0,0.1))'}}>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[260px]">
          {renderBottomRight()}
        </div>
      </div>

      {/* Left Triangle */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2" style={{width: 0, height: 0, borderTop: '150px solid transparent', borderBottom: '150px solid transparent', borderRight: '150px solid white', filter: 'drop-shadow(4px 0 6px rgba(0,0,0,0.1))'}}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[260px]">
          {renderBottomLeft()}
        </div>
      </div>

      {/* Right Triangle */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2" style={{width: 0, height: 0, borderTop: '150px solid transparent', borderBottom: '150px solid transparent', borderLeft: '150px solid white', filter: 'drop-shadow(-4px 0 6px rgba(0,0,0,0.1))'}}>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[260px]">
          {renderTopRight()}
        </div>
      </div>

    </div>
  );
};

export default EmpathyMap;
