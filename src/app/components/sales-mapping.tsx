"use client"

const teamMembers = [
  { name: "张伟", avatar: "张", tasks: 5, points: 13, done: 4, color: "bg-[#4F46E5]", barWidth: 85 },
  { name: "李娜", avatar: "李", tasks: 4, points: 10, done: 3, color: "bg-[#06B6D4]", barWidth: 65 },
  { name: "王强", avatar: "王", tasks: 4, points: 12, done: 3, color: "bg-[#F59E0B]", barWidth: 78 },
  { name: "赵敏", avatar: "赵", tasks: 3, points: 8, done: 2, color: "bg-[#EF4444]", barWidth: 52 },
  { name: "陈静", avatar: "陈", tasks: 5, points: 15, done: 5, color: "bg-[#10B981]", barWidth: 98 },
  { name: "刘洋", avatar: "刘", tasks: 3, points: 10, done: 2, color: "bg-[#8B5CF6]", barWidth: 65 },
]

export function SalesMapping() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">团队负载</h2>
        <span className="text-xs text-muted-foreground">共 {teamMembers.reduce((s, m) => s + m.tasks, 0)} 个任务</span>
      </div>
      <div className="flex flex-col gap-3">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-card-foreground">{member.name}</span>
                <span className="text-xs text-muted-foreground">{member.done}/{member.tasks} 任务 | {member.points} 点</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${member.color}`}
                  style={{ width: `${member.barWidth}%`, opacity: member.barWidth > 90 ? 1 : 0.85 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
