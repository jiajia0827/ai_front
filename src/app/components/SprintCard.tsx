import { TrendingUp, TrendingDown } from 'lucide-react';

interface SprintCardProps {
  title: string;
  value: number;
  unit: string;
  change: number;
  color: string;
  icon: React.ReactNode;
}

export function SprintCard({ title, value, unit, change, color, icon }: SprintCardProps) {
  const isPositive = change >= 0;
  const bgClass = color === 'blue' ? 'bg-blue-400' : color === 'purple' ? 'bg-purple-100' : 'bg-cyan-100';
  const textClass = color === 'blue' ? 'text-white' : color === 'purple' ? 'text-purple-600' : 'text-cyan-600';
  
  return (
    <div className={`${bgClass} rounded-2xl p-6 ${color === 'blue' ? 'shadow-lg' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`text-sm ${color === 'blue' ? 'text-blue-100' : 'text-gray-600'}`}>
          {title}
        </div>
        <div className={textClass}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className={`text-3xl font-semibold ${textClass} mb-1`}>
            {value.toLocaleString()}
          </div>
          <div className={`text-xs ${color === 'blue' ? 'text-blue-100' : 'text-gray-500'}`}>
            {unit}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {color === 'blue' && (
            <svg width="60" height="24" viewBox="0 0 60 24" className="opacity-60">
              <path
                d="M0 20 L15 12 L30 16 L45 8 L60 14"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          )}
          <div className={`flex items-center gap-1 text-xs ${
            isPositive 
              ? color === 'blue' ? 'text-white' : 'text-green-600' 
              : 'text-red-500'
          }`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
