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
import { Grid3X3, PieChart } from "lucide-react"

const ITEMS_PER_PAGE = 6

export function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'analytics'>('grid')

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE)

  const pagedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return projects.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage])

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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-serif italic text-foreground">Projects</h1>
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
            </div>
            <button className="rounded-full bg-[hsl(var(--primary))] px-7 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
              Create
            </button>
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
