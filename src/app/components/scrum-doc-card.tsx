"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Clock,
  Download,
  Eye,
  Star,
  FileText,
  FileCode,
  FileSpreadsheet,
  LayoutList,
  ClipboardCheck,
  BookOpen,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"

type DocType =
  | "product-backlog"
  | "sprint-backlog"
  | "user-story"
  | "burndown"
  | "retrospective"
  | "definition-of-done"

type Priority = "P0" | "P1" | "P2" | "P3"

interface ScrumDocCardProps {
  title: string
  description: string
  docType: DocType
  priority: Priority
  readTime: number
  downloads: number
  rating: number
  tags: string[]
  sprint?: string
  index?: number
  onDownload?: () => void
  onPreview?: () => void
}

const DOC_TYPE_CONFIG: Record<
  DocType,
  {
    label: string
    color: string
    gradient: string
    icon: typeof FileText
  }
> = {
  "product-backlog": {
    label: "产品待办",
    color: "#f472b6",
    gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
    icon: LayoutList,
  },
  "sprint-backlog": {
    label: "冲刺待办",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    icon: ClipboardCheck,
  },
  "user-story": {
    label: "用户故事",
    color: "#34d399",
    gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    icon: BookOpen,
  },
  burndown: {
    label: "燃尽图",
    color: "#fb923c",
    gradient: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
    icon: FileSpreadsheet,
  },
  retrospective: {
    label: "回顾总结",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
    icon: FileText,
  },
  "definition-of-done": {
    label: "完成定义",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    icon: FileCode,
  },
}

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; dotColor: string }
> = {
  P0: { label: "紧急", color: "#fca5a5", dotColor: "#ef4444" },
  P1: { label: "高", color: "#fdba74", dotColor: "#f97316" },
  P2: { label: "中", color: "#fde68a", dotColor: "#eab308" },
  P3: { label: "低", color: "#86efac", dotColor: "#22c55e" },
}

function ScrumDocCard({
  title,
  description,
  docType,
  priority,
  readTime,
  downloads,
  rating,
  tags,
  sprint,
  index = 0,
  onDownload,
  onPreview,
}: ScrumDocCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const typeConfig = DOC_TYPE_CONFIG[docType]
  const priorityConfig = PRIORITY_CONFIG[priority]
  const TypeIcon = typeConfig.icon
  const visibleTags = tags.slice(0, 3)
  const extraCount = tags.length - 3

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    []
  )

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="scrum-card"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        borderRadius: 20,
        padding: 1,
        cursor: "pointer",
        transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
        transform: isVisible
          ? isHovered
            ? "translateY(-6px)"
            : "translateY(0)"
          : "translateY(24px)",
        opacity: isVisible ? 1 : 0,
        background: isHovered
          ? `linear-gradient(135deg, ${typeConfig.color}40 0%, transparent 50%, ${typeConfig.color}20 100%)`
          : "rgba(255,255,255,0.08)",
      }}
    >
      {/* Spotlight glow on hover */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 20,
            pointerEvents: "none",
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${typeConfig.color}15, transparent 60%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Card inner */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderRadius: 19,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(250,250,255,0.95) 100%)",
          padding: "22px 22px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflow: "hidden",
        }}
      >
        {/* Decorative corner glow */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `${typeConfig.color}08`,
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Icon container with gradient bg */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: typeConfig.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 4px 12px ${typeConfig.color}30`,
              transition: "transform 0.3s, box-shadow 0.3s",
              transform: isHovered ? "scale(1.08) rotate(-3deg)" : "scale(1)",
            }}
          >
            <TypeIcon size={18} color="#fff" strokeWidth={2.2} />
          </div>

          {/* Type label */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: typeConfig.color,
              backgroundColor: `${typeConfig.color}12`,
              padding: "4px 12px",
              borderRadius: 20,
              letterSpacing: "0.02em",
              border: `1px solid ${typeConfig.color}20`,
            }}
          >
            {typeConfig.label}
          </span>

          {/* Priority badge */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              color: priorityConfig.dotColor,
              backgroundColor: `${priorityConfig.dotColor}10`,
              padding: "4px 10px",
              borderRadius: 20,
              border: `1px solid ${priorityConfig.dotColor}20`,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: priorityConfig.dotColor,
                boxShadow: `0 0 6px ${priorityConfig.dotColor}60`,
                display: "inline-block",
              }}
            />
            {priorityConfig.label}
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.45,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.7,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Clock size={13} color="#94a3b8" />
            {readTime} 分钟
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Download size={13} color="#94a3b8" />
            {downloads.toLocaleString()}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Star size={13} color="#fbbf24" fill="#fbbf24" />
            <span style={{ color: "#64748b", fontWeight: 600 }}>{rating}</span>
          </span>
          {sprint && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "#94a3b8",
                backgroundColor: "#f1f5f9",
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 500,
              }}
            >
              {sprint}
            </span>
          )}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {visibleTags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                color: "#475569",
                backgroundColor: "#f8fafc",
                padding: "5px 10px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              {tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span
              style={{
                fontSize: 11,
                color: "#94a3b8",
                backgroundColor: "#f8fafc",
                padding: "5px 10px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontWeight: 500,
              }}
            >
              +{extraCount} 更多
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)",
          }}
        />

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDownload?.()
            }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.2)",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(15,23,42,0.3)"
              e.currentTarget.style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(15,23,42,0.2)"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <Download size={14} />
            下载文档
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPreview?.()
            }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 600,
              color: "#475569",
              backgroundColor: "rgba(241,245,249,0.8)",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9"
              e.currentTarget.style.borderColor = "#cbd5e1"
              e.currentTarget.style.color = "#0f172a"
              e.currentTarget.style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(241,245,249,0.8)"
              e.currentTarget.style.borderColor = "#e2e8f0"
              e.currentTarget.style.color = "#475569"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <Eye size={14} />
            预览
            <ArrowUpRight size={12} style={{ marginLeft: -2, opacity: 0.6 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

const DEMO_DOCS: ScrumDocCardProps[] = [
  {
    title: "Sprint 12 产品待办列表",
    description:
      "包含当前冲刺周期内所有待办事项的优先级排序，涵盖用户反馈、技术债务和新功能需求的详细拆解。",
    docType: "product-backlog",
    priority: "P0",
    readTime: 15,
    downloads: 342,
    rating: 4.8,
    tags: ["需求管理", "优先级排序", "产品规划", "用户反馈"],
    sprint: "Sprint 12",
  },
  {
    title: "用户故事: 订单追踪功能",
    description:
      "作为买家，我希望能够实时追踪订单状态，以便了解包裹的配送进度和预计到达时间。",
    docType: "user-story",
    priority: "P1",
    readTime: 8,
    downloads: 156,
    rating: 4.5,
    tags: ["用户体验", "物流", "实时追踪"],
    sprint: "Sprint 12",
  },
  {
    title: "Sprint 11 冲刺回顾报告",
    description:
      "对上一个冲刺周期的全面回顾，包括团队速率分析、障碍总结和持续改进建议。",
    docType: "retrospective",
    priority: "P2",
    readTime: 20,
    downloads: 678,
    rating: 4.6,
    tags: ["回顾分析", "团队协作", "持续改进", "速率追踪"],
    sprint: "Sprint 11",
  },
  {
    title: "Sprint 12 燃尽图分析",
    description:
      "展示当前冲刺进度的燃尽图及偏差分析，帮助团队识别风险并及时调整计划。",
    docType: "burndown",
    priority: "P1",
    readTime: 10,
    downloads: 234,
    rating: 4.3,
    tags: ["进度追踪", "风险管理", "数据分析"],
    sprint: "Sprint 12",
  },
  {
    title: "完成定义(DoD)标准 V3.0",
    description:
      "团队统一的完成定义标准，包含代码审查、测试覆盖率、文档更新等验收标准。",
    docType: "definition-of-done",
    priority: "P0",
    readTime: 12,
    downloads: 520,
    rating: 4.9,
    tags: ["质量标准", "代码审查", "测试覆盖"],
    sprint: "通用",
  },
  {
    title: "Sprint 12 冲刺待办任务",
    description:
      "本次冲刺的具体开发任务分解，包含各任务的估算工时、负责人和依赖关系。",
    docType: "sprint-backlog",
    priority: "P0",
    readTime: 18,
    downloads: 289,
    rating: 4.7,
    tags: ["任务拆解", "工时估算", "依赖管理", "团队分工"],
    sprint: "Sprint 12",
  },
]

export default function ScrumDocCards() {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 1160,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 32,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
            >
              <Sparkles size={16} color="#fff" />
            </div>
            <h2
              className="font-sans"
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Scrum 文档管理
            </h2>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            敏捷开发文档中心 -- 管理产品待办、用户故事、回顾报告等核心文档
          </p>
        </div>

        {/* Doc count badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#64748b",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: "6px 14px",
            borderRadius: 10,
            fontWeight: 500,
          }}
        >
          <FileText size={14} color="#94a3b8" />
          共 {DEMO_DOCS.length} 份文档
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
          gap: 20,
          justifyItems: "center",
        }}
      >
        {DEMO_DOCS.map((doc, i) => (
          <ScrumDocCard
            key={i}
            {...doc}
            index={i}
            onDownload={() => alert(`下载: ${doc.title}`)}
            onPreview={() => alert(`预览: ${doc.title}`)}
          />
        ))}
      </div>
    </section>
  )
}
