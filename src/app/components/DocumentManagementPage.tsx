'use client';

import { ProductBacklog } from "./ProductBacklog";
import { ScrumMaster } from "./ScrumMaster";
import { DepartmentSection } from "./DepartmentSection";
import ScrumDocCards from "./scrum-doc-card";
import { FolderKanban, ChevronDown, ChevronUp, FileText, Download, List, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function DocumentManagementPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [showDocList, setShowDocList] = useState(false);

  const sprintExecution = {
    name: "Sprint执行文档",
    role: "开发团队",
    color: "bg-green-600",
    bgColor: "bg-green-100",
    documents: [
      { name: "技术设计文档", type: "技术文档", tool: "Confluence" },
      { name: "API接口文档", type: "技术文档", tool: "Swagger" },
      { name: "数据库设计说明", type: "技术文档", tool: "dbdiagram.io" },
      { name: "Git提交规范", type: "代码文档", tool: "Git Wiki" },
      { name: "代码评审记录", type: "代码文档", tool: "GitHub" },
      { name: "测试用例文档", type: "代码文档", tool: "TestRail" }
    ],
    contact: "dev.team@project.com"
  };

  const dailyStandup = {
    name: "每日站会记录",
    role: "开发团队",
    color: "bg-amber-600",
    bgColor: "bg-amber-100",
    documents: [
      { name: "每日进度更新", type: "站会产出", tool: "Teams" },
      { name: "障碍与风险记录", type: "站会产出", tool: "Jira" },
      { name: "任务依赖关系", type: "站会产出", tool: "Miro" },
      { name: "协作平台看板", type: "协作平台", tool: "Teams/钉钉" }
    ],
    contact: "dev.team@project.com"
  };

  const departments = [
    {
      name: "Sprint评审文档",
      role: "所有相关方",
      color: "bg-indigo-600",
      bgColor: "bg-indigo-100",
      documents: [
        { name: "演示材料", type: "交付物文档", tool: "PowerPoint" },
        { name: "用户反馈记录", type: "交付物文档", tool: "Forms" },
        { name: "验收标准核对表", type: "交付物文档", tool: "Excel" },
        { name: "Sprint评审会纪要", type: "会议记录", tool: "OneNote" },
        { name: "决策记录", type: "会议记录", tool: "Confluence" }
      ],
      contact: "stakeholders@project.com"
    },
    {
      name: "Sprint回顾文档",
      role: "Scrum团队",
      color: "bg-rose-600",
      bgColor: "bg-rose-100",
      documents: [
        { name: "回顾会议纪要", type: "改进文档", tool: "Miro" },
        { name: "改进事项追踪表", type: "改进文档", tool: "Jira" },
        { name: "团队健康度检查", type: "改进文档", tool: "Survey" },
        { name: "Retro工具看板", type: "模板与工具", tool: "Retro Tool" },
        { name: "改进看板", type: "模板与工具", tool: "Kanban" }
      ],
      contact: "scrum.team@project.com"
    },
    {
      name: "技术架构文档",
      role: "架构师",
      color: "bg-cyan-600",
      bgColor: "bg-cyan-100",
      documents: [
        { name: "系统架构设计", type: "架构文档", tool: "Confluence" },
        { name: "技术选型文档", type: "架构文档", tool: "Wiki" },
        { name: "接口规范", type: "架构文档", tool: "Swagger" },
        { name: "部署架构图", type: "架构文档", tool: "Draw.io" }
      ],
      contact: "architect@project.com"
    },
    {
      name: "质量保证文档",
      role: "QA团队",
      color: "bg-teal-600",
      bgColor: "bg-teal-100",
      documents: [
        { name: "测试计划", type: "测试文档", tool: "TestRail" },
        { name: "测试报告", type: "测试文档", tool: "Jira" },
        { name: "Bug追踪", type: "测试文档", tool: "Jira" },
        { name: "自动化测试脚本", type: "测试文档", tool: "Git" }
      ],
      contact: "qa.team@project.com"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 overflow-y-auto">
      <div className="py-6 px-4">
        <div className="max-w-[1600px] mx-auto">
        {/* Header - Left Aligned */}
        <div className="mb-6 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200">
          {showDocList ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all"
              onClick={() => setShowDocList(false)}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              返回
            </Button>
          ) : (
            <>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <FolderKanban className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Scrum敏捷开发文档管理</h1>
            </div>
            <p className="text-sm text-slate-600 ml-11">Sprint导向 · 角色明确 · 工具集成</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">6</div>
                <div className="text-xs text-slate-600">文档类别</div>
              </div>
              <div className="text-center px-4 py-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-700 bg-clip-text text-transparent">28</div>
                <div className="text-xs text-slate-600">总文档数</div>
              </div>
              <div className="text-center px-4 py-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">5</div>
                <div className="text-xs text-slate-600">工具平台</div>
              </div>
            </div>
            
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all"
                onClick={() => setShowDocList(!showDocList)}
              >
                <List className="h-3.5 w-3.5 mr-1" />
                文档列表
              </Button>
              <Button variant="outline" size="sm" className="text-xs border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all">
                <FileText className="h-3.5 w-3.5 mr-1" />
                新建文档
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs shadow-md hover:shadow-lg transition-all">
                <Download className="h-3.5 w-3.5 mr-1" />
                导出清单
              </Button>
            </div>
          </div>
          </>
          )}
        </div>

        {/* Document List View */}
        {showDocList ? (
          <div className="flex justify-center">
            <ScrumDocCards />
          </div>
        ) : (
          <>
        {/* Document Management Structure */}
        <div className="flex flex-col items-center gap-4">
          {/* Product Backlog and Sprint Planning - Horizontal Layout */}
          <div className="flex gap-6 items-center">
            <ProductBacklog />
            <div className="h-0.5 w-8 bg-gray-300"></div>
            <ScrumMaster />
          </div>
          
          <div className="h-8 w-0.5 bg-gray-300"></div>

          {/* Document Categories - All at Same Level */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-8 justify-center min-w-max px-4">
              {/* Sprint Execution with Daily Standup extension */}
              <div className="flex gap-4 items-start">
                <DepartmentSection
                  departmentName={sprintExecution.name}
                  role={sprintExecution.role}
                  color={sprintExecution.color}
                  bgColor={sprintExecution.bgColor}
                  documents={sprintExecution.documents}
                  contact={sprintExecution.contact}
                />
                <div className="flex items-center pt-8">
                  <div className="h-0.5 w-8 bg-gray-300"></div>
                </div>
                <DepartmentSection
                  departmentName={dailyStandup.name}
                  role={dailyStandup.role}
                  color={dailyStandup.color}
                  bgColor={dailyStandup.bgColor}
                  documents={dailyStandup.documents}
                  contact={dailyStandup.contact}
                />
              </div>
              
              {departments.map((dept, index) => (
                <DepartmentSection
                  key={index}
                  departmentName={dept.name}
                  role={dept.role}
                  color={dept.color}
                  bgColor={dept.bgColor}
                  documents={dept.documents}
                  contact={dept.contact}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Details Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FileText className="h-5 w-5" />
            <span>{showDetails ? "隐藏详细信息" : "查看详细信息"}</span>
            {showDetails ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Detailed Information Sections */}
        {showDetails && (
          <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Sprint Document Types */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Sprint文档分类索引
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <h3 className="font-semibold text-blue-900 mb-3">每个Sprint固定文档</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Sprint规划文档</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Sprint待办列表</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>每日站会记录</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Sprint评审材料</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Sprint回顾记录</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
                  <h3 className="font-semibold text-green-900 mb-3">跨Sprint持续文档</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>产品待办列表</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>架构设计文档</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>技术规范文档</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>用户手册</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>项目仪表板</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-600">
                  <h3 className="font-semibold text-amber-900 mb-3">按需创建文档</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>特定功能设计文档</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>风险评估报告</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>性能测试报告</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>部署操作手册</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Document Management Tools Matrix */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">文档管理工具矩阵</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">文档类型</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">主要存储位置</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">备份位置</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">访问权限</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">产品需求</td>
                      <td className="py-3 px-4 text-gray-600">Confluence</td>
                      <td className="py-3 px-4 text-gray-600">Jira</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">产品团队</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">技术文档</td>
                      <td className="py-3 px-4 text-gray-600">Git Wiki</td>
                      <td className="py-3 px-4 text-gray-600">Confluence</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">技术团队</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">会议记录</td>
                      <td className="py-3 px-4 text-gray-600">Teams</td>
                      <td className="py-3 px-4 text-gray-600">OneNote</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">项目全员</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">交付物</td>
                      <td className="py-3 px-4 text-gray-600">SharePoint</td>
                      <td className="py-3 px-4 text-gray-600">共享硬盘</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">相关方</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">指标数据</td>
                      <td className="py-3 px-4 text-gray-600">Power BI</td>
                      <td className="py-3 px-4 text-gray-600">Excel</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 bg-rose-100 text-rose-800 rounded text-xs">管理层</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
      </div>
    </div>
  );
}
