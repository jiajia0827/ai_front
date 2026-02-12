export function RewardSection() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-600 mb-2">本周完成任务数</div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          <span className="text-green-600">23</span> 个任务
        </div>
        <button className="text-xs text-blue-500 hover:text-blue-600 mt-2">
          查看详情 →
        </button>
      </div>
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L28 20L44 24L28 28L24 44L20 28L4 24L20 20L24 4Z" fill="#FFF" opacity="0.9"/>
          </svg>
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
          <span className="text-xl">🎉</span>
        </div>
      </div>
    </div>
  );
}
