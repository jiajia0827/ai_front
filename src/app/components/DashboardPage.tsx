import { StatCard } from './StatCard';
import { BurndownChart } from './BurndownChart';
import { SprintProgressChart } from './SprintProgressChart';
import { VelocityChart } from './VelocityChart';
import { PlannedVsActualChart } from './PlannedVsActualChart';
import { TeamWorkloadChart } from './TeamWorkloadChart';
import { BacklogChart } from './BacklogChart';
import { RequirementVsDefectChart } from './RequirementVsDefectChart';
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">实时监控项目进度，数据驱动决策</p>
        </div>

        {/* 顶部：关键指标卡片 */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          <StatCard
            icon={<Target size={20} />}
            value="65"
            label="Sprint 目标"
            change="故事点"
            bgColor="bg-gradient-to-br from-cyan-100 to-cyan-50"
            iconColor="text-cyan-500"
            trend={8}
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            value="48"
            label="已完成任务"
            change="完成率 74%"
            bgColor="bg-gradient-to-br from-teal-100 to-teal-50"
            iconColor="text-teal-500"
            trend={15}
          />
          <StatCard
            icon={<Clock size={20} />}
            value="17"
            label="剩余故事点"
            change="还剩 4 天"
            bgColor="bg-gradient-to-br from-amber-100 to-amber-50"
            iconColor="text-amber-500"
            trend={-5}
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            value="58.2"
            label="团队速度"
            change="平均值"
            bgColor="bg-gradient-to-br from-rose-100 to-rose-50"
            iconColor="text-rose-400"
            trend={12}
          />
        </div>

        {/* 第一行：燃尽图 + 进度图 */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="col-span-2">
            <BurndownChart />
          </div>
          <div className="col-span-1">
            <SprintProgressChart />
          </div>
        </div>

        {/* 第二行：团队速度 + 计划vs实际 */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <VelocityChart />
          <PlannedVsActualChart />
        </div>

        {/* 第三行：团队负载 + 待办事项 */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <TeamWorkloadChart />
          <BacklogChart />
        </div>

        {/* 第四行：需求vs缺陷 */}
        <div className="grid grid-cols-1 gap-5">
          <RequirementVsDefectChart />
        </div>
      </div>
    </div>
  );
}
