import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const velocityData = [
  { value: 45 }, { value: 52 }, { value: 48 }, { value: 55 }, { value: 58 }, { value: 54 }, { value: 60 }, { value: 65 }
];

const storyPointsData = [
  { value: 32 }, { value: 38 }, { value: 35 }, { value: 42 }, { value: 45 }, { value: 48 }, { value: 52 }, { value: 55 }
];

const defectsData = [
  { value: 12 }, { value: 15 }, { value: 10 }, { value: 8 }, { value: 6 }, { value: 9 }, { value: 7 }, { value: 5 }
];

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  change: number;
  data: any[];
  color: string;
}

function MetricCard({ title, value, unit, change, data, color }: MetricCardProps) {
  const isPositive = change >= 0;
  const strokeColor = color === 'green' ? '#10b981' : color === 'purple' ? '#8b5cf6' : '#ec4899';
  
  return (
    <div className="bg-white rounded-xl p-5 flex-1">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="flex gap-1">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6h8M4 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{unit}</div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${
          isPositive ? 'text-green-600' : 'text-red-500'
        }`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricsCards() {
  return (
    <div className="flex gap-4">
      <MetricCard
        title="团队速度"
        value="58.2"
        unit="故事点/冲刺"
        change={12}
        data={velocityData}
        color="purple"
      />
      <MetricCard
        title="完成故事点"
        value="465.22"
        unit="总计"
        change={92}
        data={storyPointsData}
        color="green"
      />
      <MetricCard
        title="缺陷趋势"
        value="5"
        unit="本周"
        change={-23}
        data={defectsData}
        color="pink"
      />
    </div>
  );
}
