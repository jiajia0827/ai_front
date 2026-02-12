import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', total: 420, new: 380, unique: 350 },
  { month: 'Feb', total: 380, new: 340, unique: 320 },
  { month: 'Mar', total: 450, new: 420, unique: 380 },
  { month: 'Apr', total: 480, new: 450, unique: 410 },
  { month: 'May', total: 520, new: 480, unique: 440 },
  { month: 'Jun', total: 650, new: 580, unique: 520 },
  { month: 'Jul', total: 600, new: 550, unique: 490 },
  { month: 'Aug', total: 580, new: 530, unique: 470 },
  { month: 'Sep', total: 620, new: 570, unique: 510 },
  { month: 'Oct', total: 660, new: 600, unique: 540 },
  { month: 'Nov', total: 700, new: 640, unique: 580 },
  { month: 'Dec', total: 680, new: 620, unique: 560 },
];

export function VisitorInsightsChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sprint 洞察</h3>
          <p className="text-sm text-gray-500 mt-1">任务趋势分析</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
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
            hide
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={false}
            name="总任务"
          />
          <Line 
            type="monotone" 
            dataKey="new" 
            stroke="#ec4899" 
            strokeWidth={2}
            dot={false}
            name="新任务"
          />
          <Line 
            type="monotone" 
            dataKey="unique" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            name="已完成"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-gray-600">总任务</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
          <span className="text-gray-600">新任务</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-gray-600">已完成</span>
        </div>
      </div>
    </div>
  );
}
