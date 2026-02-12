interface HistoryItem {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  change: number;
  date: string;
}

const historyItems: HistoryItem[] = [
  {
    id: 1,
    icon: 'S',
    iconBg: 'bg-purple-100 text-purple-600',
    title: 'Sprint 12 已完成',
    change: 0.003,
    date: '08/20/2018',
  },
  {
    id: 2,
    icon: 'T',
    iconBg: 'bg-gray-800 text-white',
    title: '新增用户故事',
    change: -6.23,
    date: '08/20/2018',
  },
  {
    id: 3,
    icon: 'D',
    iconBg: 'bg-blue-100 text-blue-600',
    title: '修复了5个缺陷',
    change: -5.23,
    date: '08/20/2018',
  },
  {
    id: 4,
    icon: 'R',
    iconBg: 'bg-gray-100 text-gray-600',
    title: '代码审查完成',
    change: -6.23,
    date: '08/20/2018',
  },
  {
    id: 5,
    icon: 'M',
    iconBg: 'bg-purple-100 text-purple-600',
    title: '团队回顾会议',
    change: 0.005,
    date: '08/20/2018',
  },
];

export function HistoryPanel() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-900">历史记录</h3>
        <button className="text-xs text-blue-500 hover:text-blue-600">查看全部</button>
      </div>

      <div className="space-y-3">
        {historyItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center text-sm font-semibold`}>
                {item.icon}
              </div>
              <span className="text-sm text-gray-700">{item.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${item.change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </span>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
