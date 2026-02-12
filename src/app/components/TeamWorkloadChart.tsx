import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: '张明', workload: 85, capacity: 100, avatar: 'Zhang' },
  { name: '李华', workload: 92, capacity: 100, avatar: 'Li' },
  { name: '王芳', workload: 78, capacity: 100, avatar: 'Wang' },
  { name: '刘强', workload: 95, capacity: 100, avatar: 'Liu' },
  { name: '陈静', workload: 68, capacity: 100, avatar: 'Chen' },
  { name: '赵敏', workload: 88, capacity: 100, avatar: 'Zhao' },
];

export function TeamWorkloadChart() {
  const getColor = (workload: number) => {
    if (workload >= 90) return '#dba39a';
    if (workload >= 75) return '#f4d4a6';
    return '#a7c4bc';
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">团队成员负载</h2>
        <p className="text-xs text-gray-400 mt-1">当前Sprint工作量分配</p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
            formatter={(value) => [`${value}%`, '工作负载']}
          />
          <Bar dataKey="workload" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.workload)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#a7c4bc]"></div>
            <span className="text-gray-500">正常 (&lt;75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f4d4a6]"></div>
            <span className="text-gray-500">较高 (75-90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#dba39a]"></div>
            <span className="text-gray-500">超负荷 (≥90%)</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          平均负载: <span className="font-semibold text-gray-700">84%</span>
        </div>
      </div>
    </div>
  );
}