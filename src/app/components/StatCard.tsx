interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  change: string;
  bgColor: string;
  iconColor: string;
  trend?: number;
}

export function StatCard({ icon, value, label, change, bgColor, iconColor, trend }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-5 relative overflow-hidden`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconColor} opacity-90`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-400'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-xs text-gray-600 mb-2">{label}</div>
      <div className="text-xs text-gray-500">{change}</div>
      
      {/* 装饰性迷你图 */}
      <svg className="absolute bottom-0 right-0 opacity-10" width="100" height="40" viewBox="0 0 100 40">
        <path d="M0 30 Q 25 20, 50 25 T 100 20" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}