import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', reality: 45, target: 50 },
  { month: 'Feb', reality: 52, target: 55 },
  { month: 'Mar', reality: 60, target: 58 },
  { month: 'Apr', reality: 55, target: 60 },
  { month: 'May', reality: 68, target: 65 },
  { month: 'Jun', reality: 62, target: 70 },
  { month: 'Jul', reality: 75, target: 72 },
  { month: 'Aug', reality: 70, target: 75 },
];

export function TargetVsRealityChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">目标 vs 实际</h3>
      <p className="text-sm text-gray-500 mb-6">Sprint 速度对比</p>

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
          <Bar dataKey="reality" fill="#10b981" radius={[4, 4, 0, 0]} name="实际完成" />
          <Bar dataKey="target" fill="#fbbf24" radius={[4, 4, 0, 0]} name="目标" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-around mt-4">
        <div className="bg-green-50 rounded-xl p-3 text-center flex-1 mr-2">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>实际完成</span>
          </div>
          <div className="text-lg font-bold text-gray-900">8,823</div>
          <div className="text-xs text-gray-500">当前周期</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center flex-1 ml-2">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>目标</span>
          </div>
          <div className="text-lg font-bold text-gray-900">12,122</div>
          <div className="text-xs text-gray-500">当前周期</div>
        </div>
      </div>
    </div>
  );
}
