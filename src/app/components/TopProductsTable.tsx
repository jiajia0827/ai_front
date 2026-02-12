interface Product {
  rank: number;
  name: string;
  popularity: number;
  sales: string;
  color: string;
}

const products: Product[] = [
  { rank: 1, name: '用户认证模块', popularity: 85, sales: '88%', color: 'bg-blue-500' },
  { rank: 2, name: '数据看板功能', popularity: 70, sales: '76%', color: 'bg-cyan-500' },
  { rank: 3, name: '报表生成系统', popularity: 55, sales: '68%', color: 'bg-purple-500' },
  { rank: 4, name: '消息推送服务', popularity: 45, sales: '58%', color: 'bg-amber-500' },
];

export function TopProductsTable() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">核心功能模块</h3>
      <p className="text-sm text-gray-500 mb-6">开发进度排名</p>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 pb-2 border-b">
          <div className="col-span-1">#</div>
          <div className="col-span-5">名称</div>
          <div className="col-span-4">完成度</div>
          <div className="col-span-2 text-right">进度</div>
        </div>

        {products.map((product) => (
          <div key={product.rank} className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
            <div className="col-span-1 text-sm font-semibold text-gray-900">
              {product.rank < 10 ? `0${product.rank}` : product.rank}
            </div>
            <div className="col-span-5 text-sm text-gray-700">{product.name}</div>
            <div className="col-span-4">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${product.color} rounded-full transition-all duration-500`}
                  style={{ width: `${product.popularity}%` }}
                ></div>
              </div>
            </div>
            <div className="col-span-2 text-right">
              <span className={`text-xs font-semibold px-3 py-1 ${product.color} bg-opacity-10 rounded-full`}>
                {product.sales}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
