import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: '第1天', planned: 50, actual: 50 },
  { day: '第2天', planned: 45, actual: 48 },
  { day: '第3天', planned: 40, actual: 43 },
  { day: '第4天', planned: 35, actual: 38 },
  { day: '第5天', planned: 30, actual: 32 },
  { day: '第6天', planned: 25, actual: 26 },
  { day: '第7天', planned: 20, actual: 20 },
  { day: '第8天', planned: 15, actual: 14 },
  { day: '第9天', planned: 10, actual: 9 },
  { day: '第10天', planned: 5, actual: 4 },
  { day: '第11天', planned: 0, actual: 0 },
];

export function PlannedVsActualChart() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">计划 vs 实际完成</h2>
          <p className="text-xs text-gray-400 mt-1">工作量对比分析</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-purple-200"></div>
            <span className="text-gray-500">计划工作量</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-teal-200"></div>
            <span className="text-gray-500">实际工作量</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPlanned2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ddd6fe" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#ddd6fe" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorActual2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#99f6e4" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#99f6e4" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis 
            dataKey="day" 
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
          <Area 
            type="monotone" 
            dataKey="planned" 
            stroke="#c4b5fd" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPlanned2)" 
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke="#5eead4" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActual2)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}