import React, { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { UserStory, Task } from '@/app/data/mockData';

// --- Colors ---
const COLORS = {
  high: '#F87171',
  medium: '#FBBF24',
  low: '#9CA3AF',
  dev: '#60A5FA',
  test: '#34D399',
  design: '#A78BFA',
  time: {
    '0-2h': '#EFF6FF',
    '3-5h': '#FFEDD5',
    '6-10h': '#FEE2E2',
    '10h+': '#FECACA',
  }
};

const OWNER_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

// --- Components ---

interface RadarProps {
  story: UserStory | null;
}

export const AcceptanceRadarChart: React.FC<RadarProps> = ({ story }) => {
  const data = useMemo(() => {
    if (!story) return [];
    const ac = story.acceptanceCriteria;
    return [
      { subject: '功能完整性', A: ac.functional, fullMark: 10 },
      { subject: '性能达标率', A: ac.performance, fullMark: 10 },
      { subject: '兼容性', A: ac.compatibility, fullMark: 10 },
      { subject: '用户体验', A: ac.ux, fullMark: 10 },
      { subject: '文档', A: ac.documentation, fullMark: 10 },
    ];
  }, [story]);

  if (!story) return <div className="h-full flex items-center justify-center text-gray-400">请选择一个用户故事</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">验收标准达标率 (US-{story.id.split('-')[2]})</h3>
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6B7280' }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.4}
            />
            <RechartsTooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface AllocationProps {
  tasks: Task[];
}

export const AllocationDonutChart: React.FC<AllocationProps> = ({ tasks }) => {
  const data = useMemo(() => {
    if (!tasks.length) return [];
    
    // Group by Owner
    const ownerMap: Record<string, number> = {};
    tasks.forEach(t => {
      ownerMap[t.owner] = (ownerMap[t.owner] || 0) + 1;
    });
    
    return Object.keys(ownerMap).map(owner => ({
      name: owner,
      value: ownerMap[owner]
    }));
  }, [tasks]);

  const totalTime = useMemo(() => tasks.reduce((acc, t) => acc + t.estimate, 0), [tasks]);

  if (!tasks.length) return <div className="h-full flex items-center justify-center text-gray-400">无任务数据</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">任务分配 (总工时: {totalTime}h)</h3>
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%" 
              innerRadius={35}
              outerRadius={55}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={OWNER_COLORS[index % OWNER_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconSize={8}
              wrapperStyle={{ fontSize: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface TimeDistProps {
  tasks: Task[];
}

export const TimeDistributionBarChart: React.FC<TimeDistProps> = ({ tasks }) => {
  const data = useMemo(() => {
    const buckets = {
      '0-2h': 0,
      '3-5h': 0,
      '6-10h': 0,
      '10h+': 0
    };
    
    tasks.forEach(t => {
      if (t.estimate <= 2) buckets['0-2h']++;
      else if (t.estimate <= 5) buckets['3-5h']++;
      else if (t.estimate <= 10) buckets['6-10h']++;
      else buckets['10h+']++;
    });

    return [
      { name: '0-2h', count: buckets['0-2h'], fill: COLORS.time['0-2h'] },
      { name: '3-5h', count: buckets['3-5h'], fill: COLORS.time['3-5h'] },
      { name: '6-10h', count: buckets['6-10h'], fill: COLORS.time['6-10h'] },
      { name: '10h+', count: buckets['10h+'], fill: COLORS.time['10h+'] },
    ];
  }, [tasks]);

  if (!tasks.length) return <div className="h-full flex items-center justify-center text-gray-400">无任务数据</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">工时预估分布</h3>
      <div className="w-full h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <RechartsTooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.fill} stroke="#ccc" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
