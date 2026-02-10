import { useState } from 'react';
import { GrapeMindMap } from '@/app/components/GrapeMindMap';
import { AcceptanceRadarChart, AllocationDonutChart, TimeDistributionBarChart } from '@/app/components/DashboardCharts';
import { GanttChart } from '@/app/components/GanttChart';
import { ProjectList } from '@/app/components/ProjectList';
import { PBIManagement } from '@/app/components/PBIManagement';
import DailyStandupPage from '@/app/components/DailyStandupPage';
import TaskBoard from '@/app/components/TaskBoard';
import SprintReviewPage from '@/app/components/SprintReviewPage';
import DocumentManagementPage from '@/app/components/DocumentManagementPage';
import UserPermissionPage from '@/app/components/UserPermissionPage';
import { pbis, userStories, tasks, UserStory, Task } from '@/app/data/mockData';
import { LayoutDashboard, GitPullRequest, Layers, FolderOpen, BarChart3, Play, CheckSquare, BookOpen, Kanban, Users, MessageSquare, FileText, Settings, ChevronDown, ChevronRight } from 'lucide-react';
export default function App() {
  const [selectedPbiId, setSelectedPbiId] = useState<string | null>(pbis[0].id);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(userStories[0].id);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState('用户故事与任务');
  const [sprintExpanded, setSprintExpanded] = useState(true);

  const renderMainContent = () => {
    if (activeNavItem === '项目列表') {
      return <ProjectList />;
    }
    
    if (activeNavItem === '产品待办项PBIs') {
      return <PBIManagement />;
    }
    
    if (activeNavItem === '每日站立会议') {
      return <DailyStandupPage />;
    }
    
    if (activeNavItem === '任务看板') {
      return <TaskBoard />;
    }
    
    if (activeNavItem === '迭代评审和回顾') {
      return <SprintReviewPage />;
    }
    
    if (activeNavItem === '文档管理') {
      return <DocumentManagementPage />;
    }
    
    if (activeNavItem === '用户与权限') {
      return <UserPermissionPage />;
    }
    
    // Default: Sprint Planning Dashboard
    return (
      <>
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-lg text-slate-800">Sprint 规划核心看板</h1>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-medium">Sprint 24</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="hidden md:flex items-center gap-1"><Layers size={14}/> <span>2 PBIs</span></div>
            <div className="hidden md:flex items-center gap-1"><GitPullRequest size={14}/> <span>4 Stories</span></div>
            <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm">
              启动 Sprint
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Top Section: Mind Map + Charts */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-y-auto lg:overflow-hidden">
            {/* Left: Grape Mind Map (Flexible Width) */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative z-0 min-w-0">
              <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center z-10 relative">
                <h2 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                  <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                  需求拆解全景图
                </h2>
                <span className="text-xs text-slate-400">按住拖拽 · 滚轮缩放</span>
              </div>
              <div className="flex-1 relative overflow-hidden">
                 <GrapeMindMap 
                   pbis={pbis}
                   stories={userStories}
                   tasks={tasks}
                   onSelectPbi={handlePbiSelect}
                   onSelectStory={handleStorySelect}
                   onSelectTask={handleTaskSelect}
                   selectedPbiId={selectedPbiId}
                   selectedStoryId={selectedStoryId}
                   selectedTaskId={selectedTaskId}
                 />
              </div>
            </div>

            {/* Right: Charts (Fixed Width 360px for stability) */}
            <div className="w-[360px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
              {/* Top: Radar */}
              <div className="flex-none bg-white rounded-xl shadow-sm border border-slate-200 p-2 min-h-[200px]">
                 <AcceptanceRadarChart story={selectedStory} />
              </div>
              
              {/* Middle: Donut - Increased height for Legend */}
              <div className="flex-none bg-white rounded-xl shadow-sm border border-slate-200 p-2 min-h-[220px]">
                 <AllocationDonutChart tasks={selectedStoryTasks} />
              </div>

              {/* Bottom: Bar */}
              <div className="flex-none bg-white rounded-xl shadow-sm border border-slate-200 p-2 min-h-[160px]">
                 <TimeDistributionBarChart tasks={selectedStoryTasks} />
              </div>
            </div>
          </div>

          {/* Bottom Section: Gantt (Fixed Height or remaining space) */}
          <div className="h-[250px] flex-shrink-0">
             <GanttChart 
               stories={userStories}
               tasks={tasks}
               selectedTaskId={selectedTaskId}
               onSelectTask={handleTaskSelect}
             />
          </div>
        </main>
      </>
    );
  };

  // Derived State for Charts
  const selectedStory = userStories.find(s => s.id === selectedStoryId) || null;
  const selectedStoryTasks = tasks.filter(t => t.storyId === selectedStoryId);

  // Handler Wrappers
  const handlePbiSelect = (id: string) => {
    setSelectedPbiId(id);
    // Auto-select first story of this PBI if available
    const story = userStories.find(s => s.pbiId === id);
    if (story) {
      setSelectedStoryId(story.id);
      setSelectedTaskId(null);
    }
  };

  const handleStorySelect = (id: string) => {
    setSelectedStoryId(id);
    const story = userStories.find(s => s.id === id);
    if (story && story.pbiId !== selectedPbiId) {
      setSelectedPbiId(story.pbiId);
    }
    setSelectedTaskId(null);
  };

  const handleTaskSelect = (id: string) => {
    setSelectedTaskId(id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (task.storyId !== selectedStoryId) {
        setSelectedStoryId(task.storyId);
        const story = userStories.find(s => s.id === task.storyId);
        if (story) setSelectedPbiId(story.pbiId);
      }
    }
  };

  const navItems = [
    { id: '项目列表', label: '项目列表', icon: FolderOpen },
    { id: '仪表盘', label: '仪表盘', icon: BarChart3 },
    {
      id: 'sprint启动',
      label: 'Sprint 启动',
      icon: Play,
      children: [
        { id: '产品待办项PBIs', label: '产品待办项 PBIs', icon: CheckSquare },
        { id: '用户故事与任务', label: '用户故事与任务', icon: BookOpen },
        { id: '任务看板', label: '任务看板', icon: Kanban }
      ]
    },
    { id: '每日站立会议', label: '每日站立会议', icon: MessageSquare },
    { id: '迭代评审和回顾', label: '迭代评审和回顾', icon: GitPullRequest },
    { id: '文档管理', label: '文档管理', icon: FileText },
    { id: '用户与权限', label: '用户与权限', icon: Users }
  ];

  return (
    <div className="h-screen w-full bg-slate-100 flex overflow-hidden text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-slate-200">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="ml-3 font-bold text-lg text-slate-800">Agile Hub</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => setSprintExpanded(!sprintExpanded)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center">
                        <item.icon size={18} className="text-slate-500 group-hover:text-slate-700" />
                        <span className="ml-3">{item.label}</span>
                      </div>
                      {sprintExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {sprintExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setActiveNavItem(child.id)}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              activeNavItem === child.id
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            <child.icon size={16} className={activeNavItem === child.id ? 'text-blue-600' : 'text-slate-400'} />
                            <span className="ml-3">{child.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveNavItem(item.id)}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      activeNavItem === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon size={18} className={activeNavItem === item.id ? 'text-blue-600' : 'text-slate-500'} />
                    <span className="ml-3">{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-slate-700">用户名</p>
              <p className="text-xs text-slate-500">产品经理</p>
            </div>
            <Settings size={16} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  );
}
