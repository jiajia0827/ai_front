import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: '已完成', value: 156, color: '#a7c4bc' },
  { name: '进行中', value: 38, color: '#9db4c0' },
  { name: '待办', value: 23, color: '#e5a899' },
  { name: '已阻塞', value: 8, color: '#dba39a' },
];

const COLORS = ['#a7c4bc', '#9db4c0', '#e5a899', '#dba39a'];

export function SprintProgressChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const completedPercentage = ((data[0].value / total) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">当前Sprint进度</h2>
        <p className="text-xs text-gray-400 mt-1">任务状态分布</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative flex-shrink-0 mb-6">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={data}
                cx={90}
                cy={90}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-800">{completedPercentage}%</div>
            <div className="text-xs text-gray-400">完成度</div>
          </div>
        </div>

        <div className="w-full space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}