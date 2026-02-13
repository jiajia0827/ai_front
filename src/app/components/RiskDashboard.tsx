import { useState, useEffect } from 'react';
import { RiskRadar } from './RiskRadar';
import { TaskDetailPanel } from './TaskDetailPanel';
import { mockTasks } from '@/app/data/mockTasks';
import { Task } from '@/app/types/task';
import { X } from 'lucide-react';

interface RiskDashboardProps {
  onClose?: () => void;
}

export function RiskDashboard({ onClose }: RiskDashboardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(mockTasks[0]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">健康风险仪表盘</h1>
            <p className="text-xs text-gray-500 mt-0.5">Sprint 任务风险监控与分析 · 按 ESC 关闭</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="关闭 (ESC)"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Content with scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-4 items-start justify-center">
            <div className="scale-90 origin-top">
              <RiskRadar
                tasks={mockTasks}
                selectedTask={selectedTask}
                onTaskSelect={setSelectedTask}
              />
            </div>
            
            {selectedTask && (
              <div className="flex-shrink-0">
                <TaskDetailPanel
                  task={selectedTask}
                  onClose={() => setSelectedTask(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
