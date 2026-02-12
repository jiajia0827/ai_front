import { Search, Bell, ChevronDown } from 'lucide-react';

export function TopNavBar() {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="flex items-center gap-6">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 语言选择 */}
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-2xl">🇨🇳</span>
            <span className="text-sm text-gray-700">中文</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* 通知铃铛 */}
          <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 用户信息 */}
          <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="用户"
              className="w-9 h-9 rounded-full"
            />
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">张明</div>
              <div className="text-xs text-gray-500">管理员</div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
