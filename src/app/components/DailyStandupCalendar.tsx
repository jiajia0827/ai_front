'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  Calendar, ChevronLeft, ChevronRight, Users, Clock, 
  TrendingUp, BarChart3, Target, Activity, AlertTriangle,
  MessageCircle, CheckCircle, Play, Pause
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/separator';
import { generateMonthData, generateTimelineData, radarData, trendData, type DailyStats, type TimelineEvent } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function DailyStandupCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [activeTab, setActiveTab] = useState<'radar' | 'trend' | 'distribution'>('trend');

  const monthData = useMemo(() => generateMonthData(currentDate), [currentDate]);
  const timelineData = useMemo(() => selectedDate ? generateTimelineData(selectedDate) : [], [selectedDate]);

  const weekData = useMemo(() => {
    if (viewMode !== 'week') return [];
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    return days.map(day => monthData.find(d => isSameDay(d.date, day)) || {
      date: day,
      hasMeeting: false,
      progress: 0,
      tasks: { done: 0, inProgress: 0, blocked: 0 },
      blockingCount: 0,
      meetingDuration: 0
    });
  }, [currentDate, viewMode, monthData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getDayStats = (date: Date) => {
    return monthData.find(d => isSameDay(d.date, date));
  };

  const renderCalendarDay = (date: Date, stats?: DailyStats) => {
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);
    
    return (
      <motion.div
        key={date.toISOString()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedDate(date)}
        className={cn(
          "relative p-3 rounded-xl cursor-pointer transition-all duration-200 border",
          isSelected && "ring-2 ring-blue-400 bg-blue-50",
          isCurrentDay && !isSelected && "bg-blue-100 border-blue-300",
          stats?.hasMeeting && !isSelected && !isCurrentDay && "bg-white border-blue-200 shadow-sm",
          !stats?.hasMeeting && !isSelected && !isCurrentDay && "bg-slate-50 border-slate-200"
        )}
      >
        <div className="text-center">
          <div className={cn(
            "text-lg font-semibold mb-1",
            isCurrentDay ? "text-blue-700" : "text-slate-700"
          )}>
            {format(date, 'd')}
          </div>
          <div className="text-xs text-slate-500 mb-2">
            {format(date, 'EEE', { locale: zhCN })}
          </div>
          
          {stats?.hasMeeting && (
            <div className="space-y-1">
              {/* 进度环 */}
              <div className="flex justify-center">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16" cy="16" r="12"
                      fill="none" stroke="#e2e8f0" strokeWidth="3"
                    />
                    <circle
                      cx="16" cy="16" r="12"
                      fill="none" stroke="#3b82f6" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(stats.progress / 100) * 75.4} 75.4`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {stats.progress}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 任务状态点 */}
              <div className="flex justify-center gap-1">
                {Array.from({ length: stats.tasks.done }).map((_, i) => (
                  <div key={`done-${i}`} className="w-1.5 h-1.5 rounded-full bg-green-500" />
                ))}
                {Array.from({ length: stats.tasks.inProgress }).map((_, i) => (
                  <div key={`progress-${i}`} className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                ))}
                {Array.from({ length: stats.tasks.blocked }).map((_, i) => (
                  <div key={`blocked-${i}`} className="w-1.5 h-1.5 rounded-full bg-red-500" />
                ))}
              </div>
              
              {/* 阻塞和时长 */}
              <div className="text-xs space-y-0.5">
                {stats.blockingCount > 0 && (
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{stats.blockingCount}</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 text-slate-600">
                  <Clock className="w-3 h-3" />
                  <span>{stats.meetingDuration}min</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTimeline = () => {
    if (!selectedDate || !timelineData.length) return null;

    return (
      <Card className="h-full bg-gradient-to-br from-blue-50/50 to-slate-50/50 border-blue-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="w-5 h-5" />
            {format(selectedDate, 'yyyy-MM-dd EEEE', { locale: zhCN })} 站立会议
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>时间：9:00-9:18 (18分钟)</span>
            <span>参与：6人</span>
            <span>决策：3项</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
            <div className="space-y-4">
              {timelineData.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  <div className={cn(
                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                    event.type === 'start' && "bg-green-500",
                    event.type === 'end' && "bg-slate-500",
                    event.type === 'update' && "bg-blue-500",
                    event.type === 'blocker' && "bg-red-500",
                    event.type === 'discussion' && "bg-purple-500",
                    event.type === 'assignment' && "bg-orange-500"
                  )}>
                    {event.type === 'start' && <Play className="w-4 h-4" />}
                    {event.type === 'end' && <Pause className="w-4 h-4" />}
                    {event.type === 'update' && <TrendingUp className="w-4 h-4" />}
                    {event.type === 'blocker' && <AlertTriangle className="w-4 h-4" />}
                    {event.type === 'discussion' && <MessageCircle className="w-4 h-4" />}
                    {event.type === 'assignment' && <Target className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-500">{event.time}</span>
                      <span className="font-semibold text-slate-900">{event.title}</span>
                    </div>
                    
                    {event.speaker && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                          {event.speaker.name[0]}
                        </div>
                        <span className="text-sm text-slate-600">{event.speaker.name}</span>
                      </div>
                    )}
                    
                    {event.description && (
                      <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                    )}
                    
                    {event.progress && (
                      <div className="mb-2">
                        <Progress value={event.progress} className="h-2" />
                        <span className="text-xs text-slate-500">{event.progress}% 完成</span>
                      </div>
                    )}
                    
                    {event.decision && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                        <div className="flex items-center gap-1 text-blue-700 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          决策
                        </div>
                        <p className="text-sm text-blue-600 mt-1">{event.decision}</p>
                      </div>
                    )}
                    
                    {event.tags && (
                      <div className="flex gap-1">
                        {event.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50/30 to-slate-50/30">
      {/* 头部控制面板 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Scrum 每日站立会议看板
          </h1>
          
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              月视图
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              周视图
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-slate-700">
              {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>已完成</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>进行中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>阻塞</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* 日历区域 */}
        <div className="flex-1">
          <Card className="h-full bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6 h-full">
              {viewMode === 'month' ? (
                <div className="h-full flex flex-col">
                  {/* 星期标题 */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* 日历网格 */}
                  <div className="grid grid-cols-7 gap-2 flex-1">
                    {Array.from({ length: 42 }).map((_, index) => {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index - 6);
                      const stats = getDayStats(date);
                      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                      
                      return (
                        <div key={index} className={cn(!isCurrentMonth && "opacity-30")}>
                          {renderCalendarDay(date, stats)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      第{Math.ceil(currentDate.getDate() / 7)}周 ({format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MM/dd')}-{format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MM/dd')})
                    </h3>
                  </div>
                  <div className="grid grid-cols-7 gap-4 h-full">
                    {weekData.map((dayData, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="text-center mb-2">
                          <div className="font-medium text-slate-700">
                            {format(dayData.date, 'EEE', { locale: zhCN })}
                          </div>
                          <div className="text-sm text-slate-500">
                            {format(dayData.date, 'MM/dd')}
                          </div>
                        </div>
                        {renderCalendarDay(dayData.date, dayData)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 时间轴区域 */}
        <div className="w-96">
          {renderTimeline()}
        </div>
      </div>

      {/* 底部数据面板 */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-blue-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant={activeTab === 'trend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('trend')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            趋势分析
          </Button>
          <Button
            variant={activeTab === 'radar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('radar')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Target className="w-4 h-4 mr-2" />
            雷达图
          </Button>
          <Button
            variant={activeTab === 'distribution' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('distribution')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            分布图
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-48"
          >
            {activeTab === 'trend' && (
              <Card className="h-full bg-gradient-to-r from-blue-50/50 to-slate-50/50 border-blue-100">
                <CardContent className="p-4 h-full flex items-center justify-center">
                  <div className="text-center text-slate-600">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                    <p>7天任务完成率趋势图</p>
                    <p className="text-sm mt-1">数据可视化组件</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === 'radar' && (
              <Card className="h-full bg-gradient-to-r from-blue-50/50 to-slate-50/50 border-blue-100">
                <CardContent className="p-4 h-full flex items-center justify-center">
                  <div className="text-center text-slate-600">
                    <Target className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                    <p>团队综合能力雷达图</p>
                    <p className="text-sm mt-1">多维度评估分析</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === 'distribution' && (
              <Card className="h-full bg-gradient-to-r from-blue-50/50 to-slate-50/50 border-blue-100">
                <CardContent className="p-4 h-full flex items-center justify-center">
                  <div className="text-center text-slate-600">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                    <p>任务类型分布图</p>
                    <p className="text-sm mt-1">环形图和柱状图</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}