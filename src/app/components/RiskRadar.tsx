import { Task, TIER_CONFIG } from '@/app/types/task';

interface TaskBubbleProps {
  task: Task;
  centerX: number;
  centerY: number;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskBubble({ task, centerX, centerY, isSelected, onClick }: TaskBubbleProps) {
  const x = centerX + task.position.x;
  const y = centerY + task.position.y;

  const colorMap = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
  };

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
        style={{
          backgroundColor: colorMap[task.riskLevel],
          border: isSelected ? '3px solid #fff' : 'none',
          boxShadow: isSelected
            ? `0 0 20px ${colorMap[task.riskLevel]}`
            : '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <span className="text-sm">{task.id}</span>
      </div>
    </div>
  );
}

interface RiskRadarProps {
  selectedTask: Task | null;
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
}

export function RiskRadar({ selectedTask, onTaskSelect, tasks }: RiskRadarProps) {
  const width = 700;
  const height = 700;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg className="absolute inset-0" width={width} height={height}>
        {/* Tier 3 - Red */}
        <circle
          cx={centerX}
          cy={centerY}
          r={TIER_CONFIG[3].radius}
          fill="none"
          stroke={TIER_CONFIG[3].color}
          strokeWidth="3"
          strokeDasharray="10,10"
          opacity="0.6"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`0 ${centerX} ${centerY}`}
            to={`360 ${centerX} ${centerY}`}
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x={centerX}
          y={centerY - TIER_CONFIG[3].radius - 15}
          textAnchor="middle"
          fill={TIER_CONFIG[3].color}
          fontSize="16"
          fontWeight="600"
        >
          Tier 3: 高风险区
        </text>

        {/* Tier 2 - Orange */}
        <circle
          cx={centerX}
          cy={centerY}
          r={TIER_CONFIG[2].radius}
          fill="none"
          stroke={TIER_CONFIG[2].color}
          strokeWidth="3"
          strokeDasharray="10,10"
          opacity="0.7"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`0 ${centerX} ${centerY}`}
            to={`360 ${centerX} ${centerY}`}
            dur="15s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x={centerX}
          y={centerY - TIER_CONFIG[2].radius - 15}
          textAnchor="middle"
          fill={TIER_CONFIG[2].color}
          fontSize="16"
          fontWeight="600"
        >
          Tier 2: 中风险区
        </text>

        {/* Tier 1 - Green */}
        <circle
          cx={centerX}
          cy={centerY}
          r={TIER_CONFIG[1].radius}
          fill="none"
          stroke={TIER_CONFIG[1].color}
          strokeWidth="3"
          strokeDasharray="10,10"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`0 ${centerX} ${centerY}`}
            to={`360 ${centerX} ${centerY}`}
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x={centerX}
          y={centerY - TIER_CONFIG[1].radius - 15}
          textAnchor="middle"
          fill={TIER_CONFIG[1].color}
          fontSize="16"
          fontWeight="600"
        >
          Tier 1: 低风险区
        </text>

        {/* Safe Zone */}
        <circle
          cx={centerX}
          cy={centerY}
          r={120}
          fill="#10B981"
          opacity="0.15"
        />
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fill="#10B981"
          fontSize="18"
          fontWeight="700"
        >
          Safe Zone
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          fill="#10B981"
          fontSize="14"
          fontWeight="600"
        >
          迭代健康区
        </text>
      </svg>

      {/* Task Bubbles */}
      {tasks.map((task) => (
        <TaskBubble
          key={task.id}
          task={task}
          centerX={centerX}
          centerY={centerY}
          isSelected={selectedTask?.id === task.id}
          onClick={() => onTaskSelect(task)}
        />
      ))}
    </div>
  );
}
