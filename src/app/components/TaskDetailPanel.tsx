import { Task } from '@/app/types/task';
import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
}

type TabType = 'overview' | 'insights' | 'trends' | 'measures';

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const riskLevelMap = {
    low: { text: '低风险', color: '#10B981', bgColor: '#D1FAE5', tier: 'Tier 1' },
    medium: { text: '中风险', color: '#F59E0B', bgColor: '#FEF3C7', tier: 'Tier 2' },
    high: { text: '高风险', color: '#EF4444', bgColor: '#FEE2E2', tier: 'Tier 3' },
  };

  const riskInfo = riskLevelMap[task.riskLevel];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '概览' },
    { id: 'insights', label: '洞察' },
    { id: 'trends', label: '趋势' },
    { id: 'measures', label: '指标' },
  ];

  const riskTrendData = task.riskTrend.map((value, index) => ({
    week: index + 5,
    risk: value,
  }));

  const progressTrendData = task.progressTrend.map((value, index) => ({
    week: index + 5,
    progress: value,
  }));

  const getStatusBadge = (value: number) => {
    if (value >= 80) return { text: '优秀', color: '#10B981', bgColor: '#D1FAE5' };
    if (value >= 60) return { text: '良好', color: '#10B981', bgColor: '#D1FAE5' };
    if (value >= 40) return { text: '进展中', color: '#F59E0B', bgColor: '#FEF3C7' };
    return { text: '需改进', color: '#EF4444', bgColor: '#FEE2E2' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-[380px] h-[700px] flex flex-col text-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: riskInfo.color }}
            >
              {task.id}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{task.name}</h2>
              <p className="text-xs text-gray-500">{task.sprintName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className="px-4 py-2 rounded-lg flex items-center justify-between"
          style={{ backgroundColor: riskInfo.bgColor }}
        >
          <span className="font-semibold" style={{ color: riskInfo.color }}>
            {riskInfo.text}
          </span>
          <span className="text-sm font-medium text-gray-600">{riskInfo.tier}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 border-b border-gray-200">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">任务完成度</h3>
                <span className="text-base font-bold" style={{ color: riskInfo.color }}>
                  {task.completion}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${task.completion}%`,
                    backgroundColor: riskInfo.color,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">按计划推进</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span>核心指标</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">复杂度</p>
                  <p className="font-semibold text-gray-900">{task.complexity}/10</p>
                </div>
                <div>
                  <p className="text-gray-500">负责人</p>
                  <p className="font-semibold text-gray-900">{task.assignee}</p>
                </div>
                <div>
                  <p className="text-gray-500">迭代ID</p>
                  <p className="font-semibold text-gray-900">{task.sprintId}</p>
                </div>
                <div>
                  <p className="text-gray-500">代码质量</p>
                  <p className="font-semibold text-gray-900">{task.codeQuality}%</p>
                </div>
              </div>
            </div>

            {task.blockers.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-red-900 flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} />
                  <span>阻塞原因</span>
                </h3>
                <ul className="space-y-1">
                  {task.blockers.map((blocker, index) => (
                    <li key={index} className="text-xs text-red-700 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{blocker}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <span className="text-blue-600">💡</span>
              <span>干预措施建议</span>
            </h3>

            {task.riskLevel === 'high' && (
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">拆分任务</h4>
                      <p className="text-xs text-gray-600">
                        将复杂任务拆分为更小的子任务，每个子任务控制在2-3天内完成
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">增加资源</h4>
                      <p className="text-xs text-gray-600">
                        安排有相关经验的高级工程师进行结对编程或技术指导
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">协调依赖</h4>
                      <p className="text-xs text-gray-600">
                        与依赖团队建立每日同步机制，确保阻塞问题及时解决
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">调整优先级</h4>
                      <p className="text-xs text-gray-600">
                        考虑将部分非核心功能延后到下个迭代，专注于关键路径
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {task.riskLevel === 'medium' && (
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">澄清需求</h4>
                      <p className="text-xs text-gray-600">
                        与产品经理确认需求细节，避免返工和方向性错误
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">提升测试覆盖</h4>
                      <p className="text-xs text-gray-600">
                        增加单元测试和集成测试，确保代码质量和稳定性
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">加强沟通</h4>
                      <p className="text-xs text-gray-600">
                        每日站会重点关注此任务进展，及时暴露和解决问题
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {task.riskLevel === 'low' && (
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-green-700 text-xs font-semibold mb-1">✅ 任务进展良好</p>
                  <p className="text-xs text-gray-600">
                    继续保持当前节奏，按计划完成剩余工作即可
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">代码审查</h4>
                      <p className="text-xs text-gray-600">
                        完成后及时提交代码审查，确保质量标准
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">知识分享</h4>
                      <p className="text-xs text-gray-600">
                        可以考虑在团队会议上分享经验和最佳实践
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                风险等级趋势 (8周)
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="week"
                    stroke="#6B7280"
                    fontSize={10}
                    label={{ value: '周', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={10}
                    domain={[0, 100]}
                    label={{ value: '风险值 %', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', r: 3 }}
                    name="风险等级"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-center">
                <span className="text-xs font-semibold text-red-600">
                  当前风险值: {task.riskTrend[task.riskTrend.length - 1]}%
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                任务进度趋势
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={progressTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="week"
                    stroke="#6B7280"
                    fontSize={10}
                    label={{ value: '周', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={10}
                    domain={[0, 100]}
                    label={{ value: '完成度 %', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 3 }}
                    name="完成度"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-center">
                <span className="text-xs font-semibold text-green-600">
                  当前完成度: {task.completion}%
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'measures' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">质量评估指标</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">代码质量</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          color: getStatusBadge(task.codeQuality).color,
                          backgroundColor: getStatusBadge(task.codeQuality).bgColor,
                        }}
                      >
                        {getStatusBadge(task.codeQuality).text}
                      </span>
                      <span className="text-xs font-semibold text-gray-900">{task.codeQuality}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gray-900"
                      style={{ width: `${task.codeQuality}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">团队协作度</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          color: getStatusBadge(task.collaboration).color,
                          backgroundColor: getStatusBadge(task.collaboration).bgColor,
                        }}
                      >
                        {getStatusBadge(task.collaboration).text}
                      </span>
                      <span className="text-xs font-semibold text-gray-900">{task.collaboration}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gray-900"
                      style={{ width: `${task.collaboration}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">需求清晰度</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          color: getStatusBadge(task.requirementClarity).color,
                          backgroundColor: getStatusBadge(task.requirementClarity).bgColor,
                        }}
                      >
                        {getStatusBadge(task.requirementClarity).text}
                      </span>
                      <span className="text-xs font-semibold text-gray-900">
                        {task.requirementClarity}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gray-900"
                      style={{ width: `${task.requirementClarity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">测试覆盖率</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          color: getStatusBadge(task.testCoverage).color,
                          backgroundColor: getStatusBadge(task.testCoverage).bgColor,
                        }}
                      >
                        {getStatusBadge(task.testCoverage).text}
                      </span>
                      <span className="text-xs font-semibold text-gray-900">{task.testCoverage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gray-900"
                      style={{ width: `${task.testCoverage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">综合评分</h4>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (task.codeQuality +
                    task.collaboration +
                    task.requirementClarity +
                    task.testCoverage) /
                    4
                )}
                <span className="text-lg text-gray-500">/100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
