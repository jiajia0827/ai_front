import { Check, X, Shield, Users, Lock, UserCheck, Download, Upload, Settings, Filter, Search, Edit2, Save, BarChart3, Network } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie } from 'recharts';
import UserPersona from './UserPersona';
import MemberGraphView from './MemberGraphView';

interface Permission {
  id: string;
  name: string;
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleType: 'PO' | 'SM' | 'DEV' | 'QA' | 'UI' | 'ST';
  avatar: string;
  email: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

const roleColors = {
  PO: 'bg-blue-500',
  SM: 'bg-purple-500',
  DEV: 'bg-green-500',
  QA: 'bg-orange-500',
  UI: 'bg-pink-500',
  ST: 'bg-indigo-500',
};

const roleNames = {
  PO: 'Product Owner',
  SM: 'Scrum Master',
  DEV: '开发人员',
  QA: '测试人员',
  UI: 'UI/UX设计师',
  ST: '利益相关者',
};

export function PermissionMatrix() {
  const permissions: Permission[] = [
    { id: 'view_backlog', name: '查看待办', category: '产品管理' },
    { id: 'edit_backlog', name: '编辑待办', category: '产品管理' },
    { id: 'prioritize_backlog', name: '调整优先级', category: '产品管理' },
    { id: 'create_sprint', name: '创建Sprint', category: 'Sprint管理' },
    { id: 'edit_sprint', name: '编辑Sprint', category: 'Sprint管理' },
    { id: 'close_sprint', name: '关闭Sprint', category: 'Sprint管理' },
    { id: 'view_tasks', name: '查看任务', category: '任务管理' },
    { id: 'create_tasks', name: '创建任务', category: '任务管理' },
    { id: 'edit_tasks', name: '编辑任务', category: '任务管理' },
    { id: 'delete_tasks', name: '删除任务', category: '任务管理' },
    { id: 'assign_tasks', name: '分配任务', category: '任务管理' },
    { id: 'view_reports', name: '查看报告', category: '报告分析' },
    { id: 'export_reports', name: '导出报告', category: '报告分析' },
    { id: 'manage_team', name: '管理团队', category: '团队管理' },
    { id: 'manage_permissions', name: '权限管理', category: '团队管理' },
  ];

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: '张伟',
      role: 'Product Owner',
      roleType: 'PO',
      avatar: 'ZW',
      email: 'zhang.wei@company.com',
      status: 'active',
      permissions: ['view_backlog', 'edit_backlog', 'prioritize_backlog', 'view_tasks', 'create_tasks', 'view_reports', 'export_reports'],
    },
    {
      id: '2',
      name: '李娜',
      role: 'Scrum Master',
      roleType: 'SM',
      avatar: 'LN',
      email: 'li.na@company.com',
      status: 'active',
      permissions: ['view_backlog', 'create_sprint', 'edit_sprint', 'close_sprint', 'view_tasks', 'create_tasks', 'edit_tasks', 'assign_tasks', 'view_reports', 'export_reports', 'manage_team'],
    },
    {
      id: '3',
      name: '王强',
      role: '前端开发工程师',
      roleType: 'DEV',
      avatar: 'WQ',
      email: 'wang.qiang@company.com',
      status: 'active',
      permissions: ['view_backlog', 'view_tasks', 'create_tasks', 'edit_tasks', 'view_reports'],
    },
    {
      id: '4',
      name: '刘芳',
      role: '后端开发工程师',
      roleType: 'DEV',
      avatar: 'LF',
      email: 'liu.fang@company.com',
      status: 'active',
      permissions: ['view_backlog', 'view_tasks', 'create_tasks', 'edit_tasks', 'view_reports'],
    },
    {
      id: '5',
      name: '陈明',
      role: 'QA测试工程师',
      roleType: 'QA',
      avatar: 'CM',
      email: 'chen.ming@company.com',
      status: 'active',
      permissions: ['view_backlog', 'view_tasks', 'create_tasks', 'edit_tasks', 'view_reports'],
    },
    {
      id: '6',
      name: '赵敏',
      role: 'UI/UX设计师',
      roleType: 'UI',
      avatar: 'ZM',
      email: 'zhao.min@company.com',
      status: 'active',
      permissions: ['view_backlog', 'view_tasks', 'create_tasks', 'view_reports'],
    },
    {
      id: '7',
      name: '孙浩',
      role: '产品经理',
      roleType: 'ST',
      avatar: 'SH',
      email: 'sun.hao@company.com',
      status: 'active',
      permissions: ['view_backlog', 'view_tasks', 'view_reports'],
    },
    {
      id: '8',
      name: '周婷',
      role: '全栈开发工程师',
      roleType: 'DEV',
      avatar: 'ZT',
      email: 'zhou.ting@company.com',
      status: 'inactive',
      permissions: ['view_backlog', 'view_tasks', 'create_tasks', 'edit_tasks', 'view_reports'],
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['active', 'inactive']);
  const [showChart, setShowChart] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showGraphView, setShowGraphView] = useState(false);

  const togglePermission = (memberId: string, permissionId: string) => {
    if (!isEditing) return;
    
    setTeamMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const hasPermission = member.permissions.includes(permissionId);
        return {
          ...member,
          permissions: hasPermission 
            ? member.permissions.filter(p => p !== permissionId)
            : [...member.permissions, permissionId]
        };
      }
      return member;
    }));
  };

  const toggleRoleFilter = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(member.roleType);
    const matchesStatus = selectedStatus.includes(member.status);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (showGraphView) {
    return <MemberGraphView />;
  }

  if (selectedMember) {
    return <UserPersona 
      name={selectedMember.name}
      occupation={selectedMember.role}
      location="中国"
      quote="追求卓越，持续改进"
      story={`${selectedMember.name}是团队中的${selectedMember.role}，负责项目的关键工作。拥有丰富的经验和专业技能，致力于为团队创造价值。`}
      goals={["提升团队效率", "优化工作流程", "持续学习新技术"]}
      frustrations={["沟通不畅", "需求变更频繁", "时间压力大"]}
      personalityTags={["专业", "负责", "创新", "团队合作"]}
      roleType={selectedMember.roleType}
    />;
  }

  return (
    <div className="h-screen bg-[#EFF3F8] p-6 overflow-y-auto">
      <div className="max-w-[1800px] mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">权限管理矩阵</h1>
                <p className="text-sm text-gray-500">Scrum 团队成员与权限管理</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowGraphView(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
              >
                <Network className="w-4 h-4" />
                成员视图
              </button>
              <button 
                onClick={() => setShowChart(!showChart)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  showChart ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {showChart ? '表格视图' : '图表视图'}
              </button>
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  showFilter ? 'border-purple-300 bg-purple-50 text-purple-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                筛选
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                <Download className="w-4 h-4" />
                导出
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                导入
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  isEditing 
                    ? 'border-green-300 bg-green-50 text-green-600' 
                    : 'border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? '保存' : '编辑权限'}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索成员姓名、角色或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilter && (
            <div className="w-72 bg-white rounded-2xl shadow-sm p-6 h-fit">
              <h3 className="font-semibold text-gray-900 mb-4">筛选选项</h3>
              
              {/* Role Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">按角色筛选</label>
                <div className="space-y-2">
                  {Object.entries(roleNames).map(([key, name]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(key)}
                        onChange={() => toggleRoleFilter(key)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`w-3 h-3 ${roleColors[key as keyof typeof roleColors]} rounded-full`}></div>
                        <span className="text-sm text-gray-700">{name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {teamMembers.filter(m => m.roleType === key).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">按状态筛选</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes('active')}
                      onChange={() => toggleStatusFilter('active')}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">在职</span>
                    <span className="text-xs text-gray-400">
                      {teamMembers.filter(m => m.status === 'active').length}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes('inactive')}
                      onChange={() => toggleStatusFilter('inactive')}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">离职</span>
                    <span className="text-xs text-gray-400">
                      {teamMembers.filter(m => m.status === 'inactive').length}
                    </span>
                  </label>
                </div>
              </div>

              {/* Reset Button */}
              <button 
                onClick={() => {
                  setSelectedRoles([]);
                  setSelectedStatus(['active', 'inactive']);
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                重置筛选
              </button>
            </div>
          )}

          {/* Permission Matrix Table or Chart */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            {showChart ? (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">权限分布可视化</h3>
                
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">各角色权限数量分布</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(roleNames).map(([key, name]) => ({
                      name,
                      权限数: teamMembers.filter(m => m.roleType === key).reduce((sum, m) => sum + m.permissions.length, 0) / Math.max(teamMembers.filter(m => m.roleType === key).length, 1),
                      成员数: teamMembers.filter(m => m.roleType === key).length
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="权限数" fill="#8b5cf6" />
                      <Bar dataKey="成员数" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">权限使用雷达图</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={permissions.map(p => ({
                      permission: p.name,
                      使用人数: teamMembers.filter(m => m.permissions.includes(p.id)).length,
                      fullMark: teamMembers.length
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="permission" />
                      <PolarRadiusAxis />
                      <Radar name="使用人数" dataKey="使用人数" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">成员状态分布</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: '在职', value: teamMembers.filter(m => m.status === 'active').length, color: '#10b981' },
                          { name: '离职', value: teamMembers.filter(m => m.status === 'inactive').length, color: '#6b7280' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {[{ color: '#10b981' }, { color: '#6b7280' }].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <>
                {isEditing && (
                  <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
                    <p className="text-sm text-amber-800">
                      <strong>编辑模式：</strong> 点击权限格子来切换成员的权限状态
                    </p>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-8">#</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[220px]">成员信息</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">角色类型</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">状态</th>
                        {permissions.map((permission) => (
                          <th key={permission.id} className="px-3 py-4 text-center text-xs font-semibold text-gray-600 min-w-[70px]">
                            <div className="flex flex-col items-center gap-1">
                              <span className="whitespace-nowrap">{permission.name}</span>
                              <span className="text-[10px] font-normal text-gray-400">{permission.category}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredMembers.map((member, index) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setSelectedMember(member)}
                                className={`w-10 h-10 ${roleColors[member.roleType]} rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md cursor-pointer hover:scale-110 transition-transform`}
                              >
                                {member.avatar}
                              </button>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 ${roleColors[member.roleType]} rounded-full`}></div>
                              <span className="text-sm text-gray-700">{member.role}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {member.status === 'active' ? '在职' : '离职'}
                            </span>
                          </td>
                          {permissions.map((permission) => {
                            const hasAccess = member.permissions.includes(permission.id);
                            return (
                              <td key={permission.id} className="px-3 py-4 text-center">
                                <button
                                  onClick={() => togglePermission(member.id, permission.id)}
                                  disabled={!isEditing}
                                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                                    hasAccess ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                  {hasAccess ? '✓' : '—'}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    显示 {filteredMembers.length > 0 ? 1 : 0}-{filteredMembers.length} 条，共 {filteredMembers.length} 条记录
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">←</button>
                    <button className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium">1</button>
                    <button className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">→</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">✓</div>
            <span className="text-sm font-medium text-gray-700">拥有权限</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-semibold text-sm">—</div>
            <span className="text-sm font-medium text-gray-700">无权限</span>
          </div>
          {isEditing && (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-lg">
              <Edit2 className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">点击格子可编辑权限</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
