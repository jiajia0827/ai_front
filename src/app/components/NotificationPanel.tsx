interface Notification {
  id: number;
  user: string;
  avatar: string;
  action: string;
  message: string;
  time: string;
  type?: 'message' | 'task' | 'update';
  color?: string;
  link?: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    user: '李华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
    action: '发送了一条消息',
    message: '关于用户故事的详细说明，我们需要进一步讨论',
    time: '5分钟前',
    type: 'message',
  },
  {
    id: 2,
    user: '王芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
    action: '发送了一个图标',
    message: '新完成的设计稿已经上传到共享文档',
    time: '3小时前',
    type: 'update',
    color: 'cyan',
    link: '打开文档',
  },
  {
    id: 3,
    user: '任务提醒',
    avatar: '',
    action: '进度',
    message: 'Sprint计划会议将在今天下午2点开始，请准时参加',
    time: '3小时前',
    type: 'task',
    color: 'pink',
    link: '立即查看',
  },
  {
    id: 4,
    user: '张明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    action: '发送了一条消息',
    message: '代码审查已完成，可以合并到主分支了',
    time: '2小时前',
    type: 'message',
  },
];

export function NotificationPanel() {
  return (
    <div className="w-80 bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-900">通知</h3>
        <button className="text-xs text-blue-500 hover:text-blue-600">查看全部</button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex gap-3 group">
            {notification.type === 'task' ? (
              <div className={`w-10 h-10 rounded-full bg-${notification.color}-100 flex items-center justify-center flex-shrink-0`}>
                <svg width="20" height="20" viewBox="0 0 20 20" className={`text-${notification.color}-500`} fill="currentColor">
                  <path d="M10 2L3 7v6c0 4.418 3.134 6.5 7 8 3.866-1.5 7-3.582 7-8V7l-7-5z" />
                </svg>
              </div>
            ) : (
              <img 
                src={notification.avatar} 
                alt={notification.user}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{notification.user}</span>
                  <span className="text-gray-500 text-xs ml-1">{notification.action}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="4" r="1" fill="#9ca3af"/>
                    <circle cx="8" cy="8" r="1" fill="#9ca3af"/>
                    <circle cx="8" cy="12" r="1" fill="#9ca3af"/>
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
              {notification.link && (
                <button className="text-xs text-blue-500 hover:text-blue-600">
                  {notification.link} →
                </button>
              )}
              <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 text-sm text-blue-500 hover:text-blue-600 text-center">
        查看全部
      </button>
    </div>
  );
}
