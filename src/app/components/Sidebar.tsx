import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SideEffect, Treatment } from '../data/covid-data';

interface SidebarProps {
  selectedNode: SideEffect | Treatment | null;
  isOpen: boolean;
  onClose: () => void;
}

function isTreatment(node: SideEffect | Treatment): node is Treatment {
  return 'sideEffectId' in node;
}

export function Sidebar({ selectedNode, isOpen, onClose }: SidebarProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'respiratory': return 'bg-emerald-100 text-emerald-700';
      case 'neurological': return 'bg-amber-100 text-amber-700';
      case 'cardiovascular': return 'bg-rose-100 text-rose-700';
      case 'digestive': return 'bg-cyan-100 text-cyan-700';
      case 'mental': return 'bg-violet-100 text-violet-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'PO': return 'bg-red-100 text-red-700 border-red-200';
      case 'SM': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'Dev': return 'bg-green-100 text-green-700 border-green-200';
      case 'QA': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleName = (role?: string) => {
    switch (role) {
      case 'PO': return 'Product Owner';
      case 'SM': return 'Scrum Master';
      case 'Dev': return '开发人员';
      case 'QA': return '测试人员';
      default: return '团队成员';
    }
  };

  const getTreatmentTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-blue-100 text-blue-700';
      case 'therapy': return 'bg-purple-100 text-purple-700';
      case 'lifestyle': return 'bg-green-100 text-green-700';
      case 'natural': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case '✅': return 'bg-green-100 text-green-700 border-green-200';
      case '🔄': return 'bg-blue-100 text-blue-700 border-blue-200';
      case '⏳': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case '🚫': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTaskTypeInfo = (taskType?: string) => {
    switch (taskType) {
      case 'pbi': return { label: '📦 产品待办事项', color: 'bg-purple-50 border-purple-200 text-purple-700' };
      case 'story': return { label: '📖 用户故事', color: 'bg-blue-50 border-blue-200 text-blue-700' };
      case 'task': return { label: '✏️ 任务', color: 'bg-green-50 border-green-200 text-green-700' };
      default: return { label: '任务项', color: 'bg-gray-50 border-gray-200 text-gray-700' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && selectedNode && (
        <motion.div 
          className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-border z-50"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
        >
          <motion.div 
            className="p-6 h-full overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <motion.h2 
                className="text-xl text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {selectedNode.name}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {isTreatment(selectedNode) ? (
                <div className="flex flex-wrap gap-2">
                  {selectedNode.taskType && (
                    <motion.span 
                      className={`inline-block px-3 py-1 rounded-full text-sm border ${getTaskTypeInfo(selectedNode.taskType).color}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {getTaskTypeInfo(selectedNode.taskType).label}
                    </motion.span>
                  )}
                  <motion.span 
                    className={`inline-block px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedNode.status)}`}
                    whileHover={{ scale: 1.05 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0)",
                        "0 0 0 10px rgba(59, 130, 246, 0.1)",
                        "0 0 0 0 rgba(59, 130, 246, 0)"
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {selectedNode.status === '✅' && '已完成'}
                    {selectedNode.status === '🔄' && '进行中'}
                    {selectedNode.status === '⏳' && '待开始'}
                    {selectedNode.status === '🚫' && '已搁置'}
                  </motion.span>
                  {selectedNode.priority && (
                    <motion.span 
                      className={`inline-block px-3 py-1 rounded-full text-sm border ${getPriorityColor(selectedNode.priority)}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {selectedNode.priority === 'high' && '🔴 高'}
                      {selectedNode.priority === 'medium' && '🟡 中'}
                      {selectedNode.priority === 'low' && '🔵 低'}
                    </motion.span>
                  )}
                  {selectedNode.storyPoints && (
                    <motion.span 
                      className="inline-block px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      {selectedNode.storyPoints} SP
                    </motion.span>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {selectedNode.role && (
                      <motion.span 
                        className={`inline-block px-3 py-1 rounded-full text-sm border ${getRoleColor(selectedNode.role)}`}
                        whileHover={{ scale: 1.05 }}
                        animate={{ 
                          boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                            "0 0 0 10px rgba(59, 130, 246, 0.1)",
                            "0 0 0 0 rgba(59, 130, 246, 0)"
                          ]
                        }}
                        transition={{ 
                          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        {getRoleName(selectedNode.role)}
                      </motion.span>
                    )}
                    {selectedNode.avatar && (
                      <motion.div 
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {selectedNode.avatar}
                      </motion.div>
                    )}
                  </div>
                  {selectedNode.taskLoad !== undefined && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">任务负载</span>
                        <span className="font-medium text-foreground">{selectedNode.taskLoad} 个故事点</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${
                            selectedNode.taskLoad > 12 ? 'bg-gradient-to-r from-red-400 to-orange-400' :
                            selectedNode.taskLoad > 8 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            'bg-gradient-to-r from-green-400 to-emerald-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((selectedNode.taskLoad / 15) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedNode.taskLoad > 12 ? '⚠️ 负载较重，需要关注' :
                         selectedNode.taskLoad > 8 ? '✅ 负载正常' :
                         '💚 负载较轻'}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <h3 className="mb-2 text-foreground">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedNode.description}
                </p>
              </motion.div>

              <motion.div 
                className={`p-4 rounded-lg border ${ 
                  isTreatment(selectedNode) 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' 
                    : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: isTreatment(selectedNode)
                    ? "0 10px 25px -5px rgb(99 102 241 / 0.1)"
                    : "0 10px 25px -5px rgb(168 85 247 / 0.1)"
                }}
              >
                <h4 className="mb-2 text-foreground">
                  {isTreatment(selectedNode) ? (
                    selectedNode.taskType === 'pbi' ? '📦 PBI信息' :
                    selectedNode.taskType === 'story' ? '📖 用户故事详情' :
                    '✏️ 任务说明'
                  ) : '👤 成员信息'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isTreatment(selectedNode) 
                    ? selectedNode.taskType === 'pbi' 
                      ? '产品待办事项（PBI）是产品待办列表中的工作单元，需要进一步分解为用户故事和任务才能开始开发。'
                      : selectedNode.taskType === 'story'
                      ? '用户故事从PBI分解而来，描述了用户需要的具体功能。可以进一步分解为多个开发任务。'
                      : '任务是最小的工作单元，从用户故事分解而来，由团队成员在Sprint中完成。'
                    : `这是团队的${getRoleName(selectedNode.role)}，负责在Scrum流程中承担特定职责，与团队其他成员协作完成Sprint目标。`
                  }
                </p>
                {isTreatment(selectedNode) && selectedNode.assignee && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">负责人：</strong>{selectedNode.assignee}
                    </p>
                  </div>
                )}
              </motion.div>

              {isTreatment(selectedNode) && (
                <motion.div 
                  className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgb(245 158 11 / 0.1)"
                  }}
                >
                  <h4 className="mb-2 text-foreground">🎯 Scrum分解层级</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedNode.taskType === 'pbi' ? 'bg-purple-400' : 'bg-gray-300'}`} />
                      <span className={selectedNode.taskType === 'pbi' ? 'font-bold text-purple-700' : ''}>
                        PBI（产品待办事项）
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className={`w-3 h-3 rounded-full ${selectedNode.taskType === 'story' ? 'bg-blue-400' : 'bg-gray-300'}`} />
                      <span className={selectedNode.taskType === 'story' ? 'font-bold text-blue-700' : ''}>
                        ↳ 用户故事
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-8">
                      <div className={`w-3 h-3 rounded-full ${selectedNode.taskType === 'task' ? 'bg-green-400' : 'bg-gray-300'}`} />
                      <span className={selectedNode.taskType === 'task' ? 'font-bold text-green-700' : ''}>
                        ↳ 任务
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div 
                className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgb(16 185 129 / 0.1)"
                }}
              >
                <h4 className="mb-2 text-foreground">💡 互动提示</h4>
                <p className="text-sm text-muted-foreground">
                  拖动节点可以重新排列布局。点击中心项目名查看整体信息，点击成员查看个人资料，点击任务查看工作详情。
                  {isTreatment(selectedNode) && selectedNode.taskType && (
                    <span className="block mt-2 text-indigo-600 font-medium">
                      当前层级：{
                        selectedNode.taskType === 'pbi' ? '这是顶层PBI，可分解为多个用户故事' :
                        selectedNode.taskType === 'story' ? '这是用户故事，可分解为具体任务' :
                        '这是可执行的最小任务单元'
                      }
                    </span>
                  )}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}