import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', online: 8, offline: 12 },
  { day: 'Tue', online: 12, offline: 8 },
  { day: 'Wed', online: 6, offline: 18 },
  { day: 'Thu', online: 14, offline: 10 },
  { day: 'Fri', online: 10, offline: 14 },
  { day: 'Sat', online: 16, offline: 8 },
  { day: 'Sun', online: 12, offline: 20 },
];

export function TotalRevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">故事点完成情况</h3>
      <p className="text-sm text-gray-500 mb-6">每周统计</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="online" fill="#3b82f6" radius={[4, 4, 0, 0]} name="开发任务" />
          <Bar dataKey="offline" fill="#06b6d4" radius={[4, 4, 0, 0]} name="测试任务" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">开发任务</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
          <span className="text-gray-600">测试任务</span>
        </div>
      </div>
    </div>
  );
}
