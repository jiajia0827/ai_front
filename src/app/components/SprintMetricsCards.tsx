import { Target, TrendingUp, Clock, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    label: string;
  };
}

function MetricCard({ title, value, subtitle, icon, color, trend }: MetricCardProps) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500',
  };

  const bgLightColors: Record<string, string> = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
    cyan: 'bg-cyan-50',
  };

  return (
    <div className={`${bgLightColors[color]} rounded-xl p-6 border border-${color}-100`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColors[color]} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
    </div>
  );
}

export function SprintMetricsCards() {
  return (
    <div className="grid grid-cols-6 gap-4">
      <MetricCard
        title="Sprint目标"
        value="65"
        subtitle="故事点"
        icon={<Target size={24} />}
        color="blue"
        trend={{ value: 8, label: '较上周' }}
      />
      <MetricCard
        title="已完成"
        value="48"
        subtitle="故事点"
        icon={<CheckCircle2 size={24} />}
        color="green"
        trend={{ value: 15, label: '完成率74%' }}
      />
      <MetricCard
        title="剩余工作"
        value="17"
        subtitle="故事点"
        icon={<Clock size={24} />}
        color="orange"
      />
      <MetricCard
        title="团队速度"
        value="58.2"
        subtitle="平均值"
        icon={<TrendingUp size={24} />}
        color="purple"
        trend={{ value: 12, label: '提升中' }}
      />
      <MetricCard
        title="阻塞任务"
        value="3"
        subtitle="需要关注"
        icon={<AlertTriangle size={24} />}
        color="red"
      />
      <MetricCard
        title="团队成员"
        value="6"
        subtitle="活跃开发者"
        icon={<Users size={24} />}
        color="cyan"
      />
    </div>
  );
}
