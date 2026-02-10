import { FileText, Wrench, TrendingUp, Eye, Heart, User, Calendar, Edit, Download, Trash2, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { useState } from "react";

interface DocumentNodeProps {
  name: string;
  type: string;
  tool: string;
  color: string;
}

export function DocumentNode({ name, type, tool, color }: DocumentNodeProps) {
  const [open, setOpen] = useState(false);
  
  // 模拟数据
  const docData = {
    favorites: 24,
    views: 156,
    creator: "张三",
    createDate: "2024-01-15",
    modifier: "李四",
    modifyDate: "2024-01-20",
    size: "2.4 MB",
    version: "v3.2",
    weeklyViews: [12, 18, 25, 32, 28, 35, 42],
    contributors: ["张三", "李四", "王五"],
    status: "active"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="p-3 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4" style={{ borderLeftColor: color.replace('bg-', '#') }}>
          <div className="flex items-start gap-3">
            <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <FileText className="h-4 w-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-800 mb-1.5 line-clamp-1">{name}</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {type}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Wrench className="h-3 w-3" />
                  <span>{tool}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-[75vw] w-[75vw] max-h-[75vh] overflow-y-auto sm:max-w-[75vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
              <FileText className="h-5 w-5 text-white" />
            </div>
            {name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <TrendingUp className="h-4 w-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-600">{docData.favorites}</div>
              <div className="text-xs text-gray-600">收藏量</div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{docData.views}</div>
              <div className="text-xs text-gray-600">浏览次数</div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <User className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-lg font-bold text-purple-600">{docData.contributors.length}</div>
              <div className="text-xs text-gray-600">协作者</div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-lg font-bold text-green-600">{docData.version}</div>
              <div className="text-xs text-gray-600">当前版本</div>
            </Card>
          </div>

          {/* 7天浏览趋势 - 全宽显示 */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                7天浏览趋势分析
              </h3>
              <Badge variant="outline" className="text-xs">
                总计: {docData.weeklyViews.reduce((a, b) => a + b, 0)} 次
              </Badge>
            </div>
            
            <div className="relative h-64 bg-white rounded-lg p-6 border border-blue-100">
              {/* Y轴刻度 */}
              <div className="absolute left-2 top-6 bottom-12 flex flex-col justify-between text-xs text-gray-400 w-8">
                {[50, 40, 30, 20, 10, 0].map((val, idx) => (
                  <div key={idx} className="relative h-0">
                    <span className="absolute right-0 -translate-y-1/2">{val}</span>
                  </div>
                ))}
              </div>
              
              {/* 网格线 */}
              <div className="absolute left-12 right-6 top-6 bottom-12 flex flex-col justify-between">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="w-full h-px bg-gray-100"></div>
                ))}
              </div>
              
              {/* 图表区域 */}
              <div className="ml-12 mr-6 h-full flex items-end justify-between gap-4 relative pb-8">
                {/* 折线图 SVG */}
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: 'calc(100% - 2rem)' }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <polyline
                    points={docData.weeklyViews.map((views, idx) => {
                      const maxViews = 50;
                      const x = (idx / (docData.weeklyViews.length - 1)) * 100;
                      const y = 100 - (views / maxViews) * 90;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />
                  {/* 数据点 */}
                  {docData.weeklyViews.map((views, idx) => {
                    const maxViews = 50;
                    const x = (idx / (docData.weeklyViews.length - 1)) * 100;
                    const y = 100 - (views / maxViews) * 90;
                    return (
                      <circle
                        key={idx}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="5"
                        fill="white"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        className="drop-shadow-md"
                      />
                    );
                  })}
                </svg>
                
                {/* 柱状图 */}
                {docData.weeklyViews.map((views, idx) => {
                  const maxViews = 50;
                  const height = (views / maxViews) * 90;
                  const isHighest = views === Math.max(...docData.weeklyViews);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative group">
                      {/* Tooltip */}
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap">
                          {views} 次浏览
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                        </div>
                      </div>
                      
                      <div className="text-sm font-bold text-blue-600 mb-1">{views}</div>
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 cursor-pointer ${
                          isHighest 
                            ? 'bg-gradient-to-t from-purple-500 via-blue-500 to-blue-400 shadow-lg' 
                            : 'bg-gradient-to-t from-blue-400 to-blue-300'
                        }`}
                        style={{ height: `${height}%`, minHeight: '30px' }}
                      >
                      </div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Day {idx + 1}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 统计摘要 */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <div className="text-xs text-gray-600 mb-1">平均浏览</div>
                <div className="text-xl font-bold text-blue-600">
                  {Math.round(docData.weeklyViews.reduce((a, b) => a + b, 0) / docData.weeklyViews.length)}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                <div className="text-xs text-gray-600 mb-1">峰值</div>
                <div className="text-xl font-bold text-green-600">
                  {Math.max(...docData.weeklyViews)}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
                <div className="text-xs text-gray-600 mb-1">增长率</div>
                <div className="text-xl font-bold text-purple-600">
                  +{Math.round(((docData.weeklyViews[6] - docData.weeklyViews[0]) / docData.weeklyViews[0]) * 100)}%
                </div>
              </div>
            </div>
          </Card>

          {/* 文档活跃度和热度分析 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">文档活跃度</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">编辑频率</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">协作参与度</span>
                    <span className="font-semibold text-blue-600">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">更新及时性</span>
                    <span className="font-semibold text-purple-600">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">热度指数</h3>
              <div className="flex items-center justify-center h-32">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(78 / 100) * 351.86} 351.86`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-orange-600">78</div>
                    <div className="text-xs text-gray-600">热度分</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 文档信息 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">创建信息</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">创建者</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">{docData.creator[0]}</span>
                    </div>
                    <span className="font-medium text-gray-800">{docData.creator}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">创建日期</span>
                  <span className="font-medium text-gray-800">{docData.createDate}</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">修改信息</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">修改者</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-green-600">{docData.modifier[0]}</span>
                    </div>
                    <span className="font-medium text-gray-800">{docData.modifier}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">修改日期</span>
                  <span className="font-medium text-gray-800">{docData.modifyDate}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* 协作者列表 */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">协作者</h3>
            <div className="flex items-center gap-2">
              {docData.contributors.map((contributor, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">{contributor[0]}</span>
                  </div>
                  <span className="text-sm text-gray-700">{contributor}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 文档属性 */}
          <Card className="p-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">文件大小</span>
                <div className="font-semibold text-gray-800 mt-1">{docData.size}</div>
              </div>
              <div>
                <span className="text-gray-600">文档类型</span>
                <div className="font-semibold text-gray-800 mt-1">{type}</div>
              </div>
              <div>
                <span className="text-gray-600">管理工具</span>
                <div className="font-semibold text-gray-800 mt-1">{tool}</div>
              </div>
            </div>
          </Card>

          <Separator />

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                编辑
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                下载
              </Button>
            </div>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              删除
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}