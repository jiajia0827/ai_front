import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { week: '第1周', requirements: 12, defects: 5 },
  { week: '第2周', requirements: 15, defects: 8 },
  { week: '第3周', requirements: 18, defects: 6 },
  { week: '第4周', requirements: 14, defects: 4 },
  { week: '第5周', requirements: 20, defects: 7 },
  { week: '第6周', requirements: 16, defects: 3 },
  { week: '第7周', requirements: 22, defects: 5 },
  { week: '第8周', requirements: 19, defects: 4 },
];

export function RequirementVsDefectChart() {
  const totalRequirements = data.reduce((sum, item) => sum + item.requirements, 0);
  const totalDefects = data.reduce((sum, item) => sum + item.defects, 0);
  const defectRate = ((totalDefects / totalRequirements) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">需求 vs 缺陷趋势</h2>
          <p className="text-xs text-gray-400 mt-1">质量指标分析</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-blue-200"></div>
            <span className="text-gray-500">需求</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-rose-200"></div>
            <span className="text-gray-500">缺陷</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis 
            dataKey="week" 
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
          <Bar dataKey="requirements" fill="#bfdbfe" radius={[6, 6, 0, 0]} />
          <Bar dataKey="defects" fill="#fecaca" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{totalRequirements}</div>
          <div className="text-xs text-gray-500 mt-1">总需求数</div>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-rose-400">{totalDefects}</div>
          <div className="text-xs text-gray-500 mt-1">总缺陷数</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{defectRate}%</div>
          <div className="text-xs text-gray-500 mt-1">缺陷率</div>
        </div>
      </div>
    </div>
  );
}