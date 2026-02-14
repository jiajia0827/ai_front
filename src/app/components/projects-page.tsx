"use client"

import { useState, useMemo } from "react"
import { projects } from "../../lib/project-data"
import { ProjectCard } from "@/app/components/project-card"
import { ProjectAnalytics } from "@/app/components/ProjectAnalytics"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination"
import { Grid3X3, PieChart, Search, Filter, BarChart3 } from "lucide-react"
import { GanttChart } from "@/app/components/gantt-chart"

const ITEMS_PER_PAGE = 6

export function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'analytics' | 'gantt'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'at-risk' | 'offtrack'>('all')

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || p.health === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [searchTerm, filterStatus])

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)

  const pagedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, filteredProjects])

  // Transform projects data for ProjectAnalytics
  const analyticsProjects = projects.map(p => {
    const status: 'healthy' | 'warning' | 'critical' | 'archived' = 
      p.status === 'archived' ? 'archived' :
      p.health === 'normal' ? 'healthy' : 
      p.health === 'at-risk' ? 'warning' : 'critical'
    
    return {
      id: p.id,
      name: p.name,
      isOwner: p.isMyResponsibility,
      status,
      progress: p.progress,
      completedPoints: p.completedStories,
      totalPoints: p.totalStories,
      teamSize: p.teamSize,
      daysLeft: p.remainingDays,
      velocity: p.velocity,
      quality: p.quality,
      risks: p.alerts.map(alert => ({
        type: (alert.includes('阻塞') ? 'blocked' : alert.includes('滞后') ? 'delayed' : 'quality') as 'blocked' | 'delayed' | 'quality',
        label: alert,
        severity: (alert.includes('阻塞') ? 'high' : 'medium') as 'high' | 'medium'
      })),
      isActive: p.status === 'active'
    }
  })

  if (viewMode === 'analytics') {
    return <ProjectAnalytics projects={analyticsProjects} onBackToGrid={() => setViewMode('grid')} />
  }

  if (viewMode === 'gantt') {
    return <GanttChart onBack={() => setViewMode('grid')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif italic text-foreground">项目列表</h1>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-md transition-colors bg-white shadow-sm text-blue-600"
                title="网格视图"
              >
                <Grid3X3 size={16} />
              </button>
              <button 
                onClick={() => setViewMode('analytics')}
                className="p-2 rounded-md transition-colors hover:bg-slate-200 text-slate-600"
                title="分析视图"
              >
                <PieChart size={16} />
              </button>
              <button 
                onClick={() => setViewMode('gantt')}
                className="p-2 rounded-md transition-colors hover:bg-slate-200 text-slate-600"
                title="项目横道图"
              >
                <BarChart3 size={16} />
              </button>
            </div>
            <button className="rounded-full bg-[hsl(var(--primary))] px-7 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
              创建
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索项目..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="normal">正常</option>
              <option value="at-risk">有风险</option>
              <option value="offtrack">脱轨</option>
            </select>
          </div>
        </div>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pagedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        className={
                          page === currentPage
                            ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 hover:text-[hsl(var(--primary-foreground))] cursor-pointer"
                            : "cursor-pointer"
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
