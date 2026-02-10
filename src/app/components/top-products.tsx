"use client"

const backlogItems = [
  {
    id: "US-101",
    name: "用户认证登录流程",
    points: 8,
    progress: 100,
    color: "bg-[#10B981]",
    status: "已完成",
    statusBg: "bg-[#D1FAE5]",
    statusText: "text-[#059669]",
  },
  {
    id: "US-102",
    name: "支付接口集成开发",
    points: 13,
    progress: 60,
    color: "bg-[#3B82F6]",
    status: "进行中",
    statusBg: "bg-[#DBEAFE]",
    statusText: "text-[#2563EB]",
  },
  {
    id: "US-103",
    name: "数据分析图表模块",
    points: 8,
    progress: 35,
    color: "bg-[#F59E0B]",
    status: "进行中",
    statusBg: "bg-[#FEF3C7]",
    statusText: "text-[#D97706]",
  },
  {
    id: "US-104",
    name: "邮件通知服务开发",
    points: 5,
    progress: 10,
    color: "bg-[#EF4444]",
    status: "待办",
    statusBg: "bg-[#FEE2E2]",
    statusText: "text-[#DC2626]",
  },
  {
    id: "BUG-21",
    name: "修复登录超时异常",
    points: 3,
    progress: 80,
    color: "bg-[#8B5CF6]",
    status: "进行中",
    statusBg: "bg-[#EDE9FE]",
    statusText: "text-[#7C3AED]",
  },
]

export function TopProducts() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">待办事项</h2>
        <span className="text-xs text-muted-foreground">{backlogItems.length} 个事项</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-border">
            <th className="text-left pb-3 font-medium">编号</th>
            <th className="text-left pb-3 font-medium">用户故事</th>
            <th className="text-center pb-3 font-medium">点数</th>
            <th className="text-left pb-3 font-medium">进度</th>
            <th className="text-right pb-3 font-medium">状态</th>
          </tr>
        </thead>
        <tbody>
          {backlogItems.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0">
              <td className="py-3 text-xs text-muted-foreground font-mono">{item.id}</td>
              <td className="py-3 text-sm text-card-foreground">{item.name}</td>
              <td className="py-3 text-center">
                <span className="text-xs font-bold text-card-foreground bg-secondary px-2 py-0.5 rounded-md">{item.points}</span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-8">{item.progress}%</span>
                </div>
              </td>
              <td className="py-3 text-right">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.statusBg} ${item.statusText}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
