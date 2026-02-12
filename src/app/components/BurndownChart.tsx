import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { time: '第1天', 计划: 120, 实际: 120, 待办: 100, 已完成: 98 },
  { time: '第2天', 计划: 115, 实际: 110, 待办: 95, 已完成: 92 },
  { time: '第3天', 计划: 110, 实际: 105, 待办: 88, 已完成: 85 },
  { time: '第4天', 计划: 105, 实际: 95, 待办: 82, 已完成: 80 },
  { time: '第5天', 计划: 100, 实际: 90, 待办: 78, 已完成: 75 },
  { time: '第6天', 计划: 95, 实际: 88, 待办: 72, 已完成: 70 },
  { time: '第7天', 计划: 90, 实际: 82, 待办: 68, 已完成: 65 },
  { time: '第8天', 计划: 85, 实际: 78, 待办: 62, 已完成: 60 },
  { time: '第9天', 计划: 80, 实际: 72, 待办: 58, 已完成: 55 },
  { time: '第10天', 计划: 75, 实际: 68, 待办: 52, 已完成: 50 },
];

export function BurndownChart() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Sprint 燃尽图</h2>
          <p className="text-xs text-gray-400 mt-1">实时追踪Sprint进度</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-300"></div>
            <span className="text-gray-500">计划</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-300"></div>
            <span className="text-gray-500">实际</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-300"></div>
            <span className="text-gray-500">待办</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            domain={[0, 130]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="计划" 
            stroke="#fda4af" 
            strokeWidth={2.5}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="实际" 
            stroke="#67e8f9" 
            strokeWidth={2.5}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="待办" 
            stroke="#fcd34d" 
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}