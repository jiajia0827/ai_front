import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

const data = [
  { sprint: 'Sprint 1', planned: 45, completed: 42, velocity: 42 },
  { sprint: 'Sprint 2', planned: 50, completed: 48, velocity: 48 },
  { sprint: 'Sprint 3', planned: 48, completed: 52, velocity: 52 },
  { sprint: 'Sprint 4', planned: 55, completed: 50, velocity: 50 },
  { sprint: 'Sprint 5', planned: 52, completed: 55, velocity: 55 },
  { sprint: 'Sprint 6', planned: 58, completed: 58, velocity: 58 },
  { sprint: 'Sprint 7', planned: 60, completed: 62, velocity: 62 },
  { sprint: 'Sprint 8', planned: 60, completed: 65, velocity: 65 },
];

export function VelocityChart() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">团队速度趋势</h2>
          <p className="text-xs text-gray-400 mt-1">每个Sprint的计划vs完成故事点</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-blue-200"></div>
            <span className="text-gray-500">计划</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-teal-200"></div>
            <span className="text-gray-500">完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-0.5 bg-rose-300"></div>
            <span className="text-gray-500">速度</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis 
            dataKey="sprint" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          />
          <Bar dataKey="planned" fill="#bfdbfe" radius={[6, 6, 0, 0]} />
          <Bar dataKey="completed" fill="#99f6e4" radius={[6, 6, 0, 0]} />
          <Line 
            type="monotone" 
            dataKey="velocity" 
            stroke="#fda4af" 
            strokeWidth={2.5}
            dot={{ fill: '#fda4af', r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}