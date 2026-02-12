import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', volume: 1136, service: 695 },
  { month: 'Feb', volume: 1200, service: 720 },
  { month: 'Mar', volume: 980, service: 650 },
  { month: 'Apr', volume: 1100, service: 680 },
  { month: 'May', volume: 890, service: 590 },
  { month: 'Jun', volume: 950, service: 620 },
];

export function VolumeServiceChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">工作量 vs 质量水平</h3>
      <p className="text-sm text-gray-500 mb-6">月度对比</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="month" 
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
          <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} name="工作量" />
          <Bar dataKey="service" fill="#10b981" radius={[4, 4, 0, 0]} name="质量" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-around mt-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>工作量</span>
          </div>
          <div className="text-lg font-bold text-gray-900">1,136</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>质量水平</span>
          </div>
          <div className="text-lg font-bold text-gray-900">695</div>
        </div>
      </div>
    </div>
  );
}
