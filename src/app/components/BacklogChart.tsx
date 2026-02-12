import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { priority: '紧急', count: 12, color: '#dba39a' },
  { priority: '高', count: 25, color: '#f4d4a6' },
  { priority: '中', count: 38, color: '#9db4c0' },
  { priority: '低', count: 15, color: '#a7c4bc' },
];

export function BacklogChart() {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">待办事项优先级分布</h2>
        <p className="text-xs text-gray-400 mt-1">共 {total} 个待办任务</p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
          <XAxis 
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <YAxis 
            type="category"
            dataKey="priority" 
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
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {data.map((item, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-xl font-bold text-gray-700">{item.count}</div>
            <div className="text-xs text-gray-400 mt-1">{item.priority}优先级</div>
            <div className="text-xs font-semibold mt-1" style={{ color: item.color }}>
              {((item.count / total) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}