export interface SideEffect {
  id: string;
  name: string;
  description: string;
  category: 'respiratory' | 'neurological' | 'cardiovascular' | 'digestive' | 'mental' | 'other';
  color: string;
  role?: 'PO' | 'SM' | 'Dev' | 'QA'; // 成员角色
  avatar?: string; // 成员头像缩写
  taskLoad?: number; // 任务负载
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  type: 'medication' | 'therapy' | 'lifestyle' | 'natural';
  sideEffectId: string;
  color: string;
  status?: '✅' | '🔄' | '🚫';
  priority?: 'high' | 'medium' | 'low';
  taskType?: 'pbi' | 'story' | 'task'; // 任务层级
  storyPoints?: number; // 故事点
  assignee?: string; // 负责人
}

// 团队成员（第一圈）
export const covidSideEffects: SideEffect[] = [
  // Product Owner
  {
    id: 'member-zhang-wei',
    name: '张伟',
    description: 'Product Owner - 5年产品经验，负责产品愿景和待办列表管理。擅长用户需求分析和优先级排序，与利益相关者保持紧密沟通。',
    category: 'other',
    color: '#E8A5A5', // 莫兰迪玫瑰粉
    role: 'PO',
    avatar: 'ZW',
    taskLoad: 8
  },
  
  // Scrum Master
  {
    id: 'member-li-na',
    name: '李娜',
    description: 'Scrum Master - 认证CSM，3年敏捷实践经验。擅长团队引导和障碍移除，确保团队高效协作，维护Scrum流程。',
    category: 'other',
    color: '#A5C4E8', // 莫兰迪蓝灰
    role: 'SM',
    avatar: 'LN',
    taskLoad: 6
  },
  
  // 开发人员
  {
    id: 'member-wang-qiang',
    name: '王强',
    description: '高级前端开发工程师 - 精通React/TypeScript，7年前端开发经验。负责核心功能模块开发和技术难点攻克。',
    category: 'respiratory',
    color: '#A8D5A8', // 莫兰迪薄荷绿
    role: 'Dev',
    avatar: 'WQ',
    taskLoad: 12
  },
  {
    id: 'member-chen-min',
    name: '陈敏',
    description: '前端开发工程师 - 3年React开发经验，擅长组件库开发和UI实现。注重代码质量和用户体验。',
    category: 'respiratory',
    color: '#B8E0B8', // 莫兰迪浅绿
    role: 'Dev',
    avatar: 'CM',
    taskLoad: 10
  },
  {
    id: 'member-liu-yang',
    name: '刘洋',
    description: '后端开发工程师 - 5年Java/Spring Boot经验，负责API设计和数据库架构。擅长微服务和分布式系统。',
    category: 'respiratory',
    color: '#A5D5C8', // 莫兰迪青绿
    role: 'Dev',
    avatar: 'LY',
    taskLoad: 13
  },
  {
    id: 'member-zhao-lei',
    name: '赵磊',
    description: '全栈开发工程师 - 4年全栈经验，熟悉前后端技术栈。能够独立完成功能模块的端到端开发。',
    category: 'respiratory',
    color: '#B0D8B8', // 莫兰迪鼠尾草绿
    role: 'Dev',
    avatar: 'ZL',
    taskLoad: 11
  },
  {
    id: 'member-huang-li',
    name: '黄丽',
    description: 'DevOps工程师 - 精通CI/CD和容器化技术，负责部署流程和基础设施管理。确保系统稳定运行。',
    category: 'cardiovascular',
    color: '#A5C8D5', // 莫兰迪灰绿
    role: 'Dev',
    avatar: 'HL',
    taskLoad: 9
  },
  
  // 测试人员
  {
    id: 'member-xu-fang',
    name: '徐芳',
    description: '高级测试工程师 - 6年测试经验，精通自动化测试。负责测试策略制定和质量把控，确保产品质量。',
    category: 'neurological',
    color: '#F5D8A5', // 莫兰迪米黄
    role: 'QA',
    avatar: 'XF',
    taskLoad: 10
  },
  {
    id: 'member-sun-bo',
    name: '孙波',
    description: '测试工程师 - 3年测试经验，擅长功能测试和性能测试。注重测试覆盖率和缺陷跟踪。',
    category: 'neurological',
    color: '#FFE5B8', // 莫兰迪浅驼
    role: 'QA',
    avatar: 'SB',
    taskLoad: 9
  },
  
  // 其他角色
  {
    id: 'member-zhou-jing',
    name: '周静',
    description: 'UX设计师 - 5年用户体验设计经验，负责原型设计和用户研究。确保产品易用性和美观性。',
    category: 'mental',
    color: '#D5B8E8', // 莫兰迪薰衣草紫
    role: 'Dev',
    avatar: 'ZJ',
    taskLoad: 7
  },
  {
    id: 'member-wu-jian',
    name: '吴健',
    description: '技术负责人 - 10年开发经验，负责技术架构和代码审查。指导团队技术方向，解决复杂技术问题。',
    category: 'cardiovascular',
    color: '#A5C8B8', // 莫兰迪深青
    role: 'Dev',
    avatar: 'WJ',
    taskLoad: 8
  },
  {
    id: 'member-ma-xue',
    name: '马雪',
    description: '数据分析师 - 4年数据分析经验，负责用户行为分析和数据可视化。为产品决策提供数据支持。',
    category: 'digestive',
    color: '#B8D8C8', // 莫兰迪水鸭绿
    role: 'Dev',
    avatar: 'MX',
    taskLoad: 6
  }
];

// 成员的任务和信息（第二圈）
export const treatments: Treatment[] = [
  // 张伟（PO）的任务
  {
    id: 'pbi-user-dashboard',
    name: 'PBI: 用户仪表板',
    description: '【产品待办事项】作为用户，我希望有一个可视化仪表板来查看我的关键数据指标，以便快速了解业务状况。优先级：高 | 故事点：21',
    type: 'medication',
    sideEffectId: 'member-zhang-wei',
    color: '#E8D4C8',
    status: '🔄',
    priority: 'high',
    taskType: 'pbi',
    storyPoints: 21,
    assignee: '张伟'
  },
  {
    id: 'story-backlog-refinement',
    name: '用户故事: 待办列表梳理',
    description: '【本周工作】组织3次待办列表梳理会议，评估20个PBI的优先级和故事点，与团队达成共识。已完成2次会议。',
    type: 'therapy',
    sideEffectId: 'member-zhang-wei',
    color: '#F0E4D8',
    status: '🔄',
    priority: 'high',
    taskType: 'story',
    storyPoints: 5,
    assignee: '张伟'
  },
  {
    id: 'task-stakeholder-meeting',
    name: '任务: 利益相关者评审',
    description: '【本周四】与管理层进行季度产品评审，演示已完成功能，收集反馈并调整产品路线图。准备PPT和Demo环境。',
    type: 'lifestyle',
    sideEffectId: 'member-zhang-wei',
    color: '#F5EDE5',
    status: '✅',
    priority: 'high',
    taskType: 'task',
    storyPoints: 3,
    assignee: '张伟'
  },

  // 李娜（SM）的任务
  {
    id: 'pbi-team-velocity',
    name: 'PBI: 提升团队速率',
    description: '【流程改进】通过优化工作流程、移除障碍和改善团队协作，将团队速率从35提升到45故事点/迭代。',
    type: 'therapy',
    sideEffectId: 'member-li-na',
    color: '#D4E0E8',
    status: '🔄',
    priority: 'medium',
    taskType: 'pbi',
    storyPoints: 13,
    assignee: '李娜'
  },
  {
    id: 'story-daily-standup',
    name: '用户故事: 每日站会优化',
    description: '【迭代目标】优化每日站会流程，控制在15分钟内，提高信息同步效率。引入看板可视化工具。',
    type: 'therapy',
    sideEffectId: 'member-li-na',
    color: '#E0EAF0',
    status: '✅',
    priority: 'medium',
    taskType: 'story',
    storyPoints: 3,
    assignee: '李娜'
  },
  {
    id: 'task-retrospective-prep',
    name: '任务: 准备回顾会议',
    description: '【本周五】准备Sprint回顾会议材料，收集团队反馈，设计互动环节（帆船隐喻法），总结改进行动项。',
    type: 'natural',
    sideEffectId: 'member-li-na',
    color: '#EDF4F8',
    status: '🔄',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 2,
    assignee: '李娜'
  },

  // 王强（高级前端）的任务
  {
    id: 'story-dashboard-charts',
    name: '用户故事: 仪表板图表组件',
    description: '【PBI分解】实现仪表板的数据可视化图表，包括折线图、柱状图、饼图。使用Recharts库，支持响应式和主题切换。',
    type: 'medication',
    sideEffectId: 'member-wang-qiang',
    color: '#D8E8D0',
    status: '🔄',
    priority: 'high',
    taskType: 'story',
    storyPoints: 8,
    assignee: '王强'
  },
  {
    id: 'task-chart-line',
    name: '任务: 开发折线图组件',
    description: '【开发中】使用Recharts实现动态折线图，支持多数据源、时间范围选择、数据点提示。已完成70%。',
    type: 'medication',
    sideEffectId: 'member-wang-qiang',
    color: '#C8DCC0',
    status: '🔄',
    priority: 'high',
    taskType: 'task',
    storyPoints: 3,
    assignee: '王强'
  },
  {
    id: 'task-performance-optimization',
    name: '任务: 前端性能优化',
    description: '【技术债】实施代码分割、懒加载和图片优化，目标：首屏加载时间<2秒。使用React.lazy和动态import。',
    type: 'lifestyle',
    sideEffectId: 'member-wang-qiang',
    color: '#E0ECD8',
    status: '✅',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 5,
    assignee: '王强'
  },

  // 陈敏（前端）的任务
  {
    id: 'story-component-library',
    name: '用户故事: 组件库标准化',
    description: '【技术改进】重构共享UI组件库，统一设计规范，提升代码复用率。使用Storybook进行文档化。',
    type: 'therapy',
    sideEffectId: 'member-chen-min',
    color: '#E8F0E0',
    status: '✅',
    priority: 'medium',
    taskType: 'story',
    storyPoints: 5,
    assignee: '陈敏'
  },
  {
    id: 'task-button-component',
    name: '任务: 优化Button组件',
    description: '【已完成】重构Button组件，支持多种样式变体、尺寸、图标、加载状态。编写Storybook文档和单元测试。',
    type: 'medication',
    sideEffectId: 'member-chen-min',
    color: '#D8E8D0',
    status: '✅',
    priority: 'low',
    taskType: 'task',
    storyPoints: 2,
    assignee: '陈敏'
  },
  {
    id: 'task-form-validation',
    name: '任务: 表单验证增强',
    description: '【开发中】实现复杂表单验证逻辑，支持异步验证、自定义规则、实时错误提示。使用react-hook-form。',
    type: 'natural',
    sideEffectId: 'member-chen-min',
    color: '#E8F0D8',
    status: '🔄',
    priority: 'high',
    taskType: 'task',
    storyPoints: 3,
    assignee: '陈敏'
  },

  // 刘洋（后端）的任务
  {
    id: 'story-api-development',
    name: '用户故事: 用户管理API',
    description: '【核心功能】开发用户管理模块的RESTful API，包括注册、登录、权限验证、用户信息CRUD操作。',
    type: 'medication',
    sideEffectId: 'member-liu-yang',
    color: '#e0f2f1',
    status: '✅',
    priority: 'high',
    taskType: 'story',
    storyPoints: 13,
    assignee: '刘洋'
  },
  {
    id: 'task-database-optimization',
    name: '任务: 数据库查询优化',
    description: '【性能优化】分析慢查询日志，添加索引，优化SQL语句。查询性能提升60%，响应时间降至<100ms。',
    type: 'therapy',
    sideEffectId: 'member-liu-yang',
    color: '#b2dfdb',
    status: '🔄',
    priority: 'high',
    taskType: 'task',
    storyPoints: 5,
    assignee: '刘洋'
  },
  {
    id: 'task-api-documentation',
    name: '任务: API文档编写',
    description: '【文档工作】使用Swagger生成API文档，包含所有端点的请求/响应示例、参数说明、错误码定义。',
    type: 'lifestyle',
    sideEffectId: 'member-liu-yang',
    color: '#c8e6c9',
    status: '✅',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 3,
    assignee: '刘洋'
  },

  // 赵磊（全栈）的任务
  {
    id: 'story-payment-integration',
    name: '用户故事: 支付功能集成',
    description: '【新功能】集成第三方支付系统（支付宝/微信支付），实现订单支付、退款、支付状态查询功能。',
    type: 'medication',
    sideEffectId: 'member-zhao-lei',
    color: '#dcedc8',
    status: '🔄',
    priority: 'high',
    taskType: 'story',
    storyPoints: 13,
    assignee: '赵磊'
  },
  {
    id: 'task-payment-frontend',
    name: '任务: 支付前端页面',
    description: '【前端开发】开发支付收银台页面，展示订单信息、支付方式选择、支付结果反馈。集成支付SDK。',
    type: 'therapy',
    sideEffectId: 'member-zhao-lei',
    color: '#c5e1a5',
    status: '🔄',
    priority: 'high',
    taskType: 'task',
    storyPoints: 5,
    assignee: '赵磊'
  },
  {
    id: 'task-payment-callback',
    name: '任务: 支付回调处理',
    description: '【后端开发】实现支付异步回调接口，验证签名、更新订单状态、发送支付通知。确保幂等性和安全性。',
    type: 'natural',
    sideEffectId: 'member-zhao-lei',
    color: '#aed581',
    status: '✅',
    priority: 'high',
    taskType: 'task',
    storyPoints: 3,
    assignee: '赵磊'
  },

  // 黄丽（DevOps）的任务
  {
    id: 'story-cicd-pipeline',
    name: '用户故事: CI/CD自动化',
    description: '【基础设施】搭建完整的CI/CD流水线，实现代码提交后自动构建、测试、部署。减少手动操作和部署时间。',
    type: 'medication',
    sideEffectId: 'member-huang-li',
    color: '#d4e6f1',
    status: '✅',
    priority: 'high',
    taskType: 'story',
    storyPoints: 8,
    assignee: '黄丽'
  },
  {
    id: 'task-docker-compose',
    name: '任务: Docker环境配置',
    description: '【已完成】编写Docker Compose配置文件，包含所有服务容器。简化本地开发环境搭建，5分钟即可启动。',
    type: 'therapy',
    sideEffectId: 'member-huang-li',
    color: '#aed6f1',
    status: '✅',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 3,
    assignee: '黄丽'
  },
  {
    id: 'task-monitoring-setup',
    name: '任务: 监控系统部署',
    description: '【进行中】部署Prometheus+Grafana监控栈，配置关键指标告警（CPU、内存、响应时间）。已完成60%。',
    type: 'lifestyle',
    sideEffectId: 'member-huang-li',
    color: '#85c1e9',
    status: '🔄',
    priority: 'high',
    taskType: 'task',
    storyPoints: 5,
    assignee: '黄丽'
  },

  // 徐芳（高级QA）的任务
  {
    id: 'story-automation-framework',
    name: '用户故事: 自动化测试框架',
    description: '【质量保障】搭建E2E自动化测试框架，使用Playwright覆盖核心用户流程。目标：测试覆盖率达75%。',
    type: 'therapy',
    sideEffectId: 'member-xu-fang',
    color: '#fff9c4',
    status: '✅',
    priority: 'high',
    taskType: 'story',
    storyPoints: 13,
    assignee: '徐芳'
  },
  {
    id: 'task-test-cases',
    name: '任务: 编写测试用例',
    description: '【测试工作】针对用户仪表板功能编写30个测试用例，覆盖正常流程、异常场景、边界条件。已完成25个。',
    type: 'medication',
    sideEffectId: 'member-xu-fang',
    color: '#fff59d',
    status: '🔄',
    priority: 'high',
    taskType: 'task',
    storyPoints: 5,
    assignee: '徐芳'
  },
  {
    id: 'task-performance-test',
    name: '任务: 性能测试执行',
    description: '【待开始】使用JMeter进行负载测试，模拟1000并发用户场景，验证系统稳定性和响应时间。计划周五执行。',
    type: 'natural',
    sideEffectId: 'member-xu-fang',
    color: '#ffee58',
    status: '✅',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 3,
    assignee: '徐芳'
  },

  // 孙波（QA）的任务
  {
    id: 'story-regression-testing',
    name: '用户故事: 回归测试',
    description: '【质量把控】对新版本进行全面回归测试，确保新功能没有破坏现有功能。测试300+功能点。',
    type: 'therapy',
    sideEffectId: 'member-sun-bo',
    color: '#fff9c4',
    status: '🔄',
    priority: 'high',
    taskType: 'story',
    storyPoints: 8,
    assignee: '孙波'
  },
  {
    id: 'task-bug-tracking',
    name: '任务: Bug跟踪管理',
    description: '【日常工作】本周发现12个Bug，已修复9个，3个待开发修复。优先级分布：高3个、中6个、低3个。',
    type: 'medication',
    sideEffectId: 'member-sun-bo',
    color: '#ffeb3b',
    status: '🔄',
    priority: 'high',
    taskType: 'task',
    storyPoints: 3,
    assignee: '孙波'
  },
  {
    id: 'task-exploratory-testing',
    name: '任务: 探索性测试',
    description: '【测试活动】对支付模块进行探索性测试，发现潜在问题和边界场景。记录测试路径和发现的问题。',
    type: 'natural',
    sideEffectId: 'member-sun-bo',
    color: '#ffee58',
    status: '🔄',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 2,
    assignee: '孙波'
  },

  // 周静（UX设计师）的任务
  {
    id: 'story-user-research',
    name: '用户故事: 用户研究',
    description: '【设计研究】开展用户访谈和可用性测试，了解用户痛点和需求，产出用户旅程地图和设计洞察报告。',
    type: 'therapy',
    sideEffectId: 'member-zhou-jing',
    color: '#f3e5f5',
    status: '✅',
    priority: 'medium',
    taskType: 'story',
    storyPoints: 8,
    assignee: '周静'
  },
  {
    id: 'task-prototype-design',
    name: '任务: 高保真原型设计',
    description: '【设计交付】在Figma中完成仪表板高保真原型，包含所有交互细节、动效说明。已完成3轮设计迭代。',
    type: 'natural',
    sideEffectId: 'member-zhou-jing',
    color: '#e1bee7',
    status: '✅',
    priority: 'high',
    taskType: 'task',
    storyPoints: 5,
    assignee: '周静'
  },
  {
    id: 'task-design-system',
    name: '任务: 设计系统维护',
    description: '【设计规范】更新设计系统文档，新增10个组件规范，确保设计与开发实现的一致性。',
    type: 'lifestyle',
    sideEffectId: 'member-zhou-jing',
    color: '#ce93d8',
    status: '🔄',
    priority: 'low',
    taskType: 'task',
    storyPoints: 2,
    assignee: '周静'
  },

  // 吴健（技术负责人）的任务
  {
    id: 'story-architecture-design',
    name: '用户故事: 微前端架构',
    description: '【技术架构】设计并实施微前端架构方案，实现多团队并行开发，提升系统可维护性和扩展性。',
    type: 'medication',
    sideEffectId: 'member-wu-jian',
    color: '#b2dfdb',
    status: '🔄',
    priority: 'medium',
    taskType: 'story',
    storyPoints: 21,
    assignee: '吴健'
  },
  {
    id: 'task-code-review',
    name: '任务: 代码审查',
    description: '【日常工作】本周审查42个Pull Request，确保代码质量、安全性和一致性。提供技术指导和最佳实践建议。',
    type: 'therapy',
    sideEffectId: 'member-wu-jian',
    color: '#80cbc4',
    status: '✅',
    priority: 'high',
    taskType: 'task',
    storyPoints: 3,
    assignee: '吴健'
  },
  {
    id: 'task-tech-sharing',
    name: '任务: 技术分享会',
    description: '【团队建设】本周五主持技术分享会，主题：《微前端架构实践与思考》。准备PPT和Demo代码。',
    type: 'natural',
    sideEffectId: 'member-wu-jian',
    color: '#4db6ac',
    status: '✅',
    priority: 'low',
    taskType: 'task',
    storyPoints: 2,
    assignee: '吴健'
  },

  // 马雪（数据分析师）的任务
  {
    id: 'story-data-dashboard',
    name: '用户故事: 数据看板搭建',
    description: '【数据产品】构建业务数据看板，可视化展示用户增长、留存率、转化漏斗等关键指标，支持每日自动更新。',
    type: 'therapy',
    sideEffectId: 'member-ma-xue',
    color: '#c8e6c9',
    status: '✅',
    priority: 'high',
    taskType: 'story',
    storyPoints: 8,
    assignee: '马雪'
  },
  {
    id: 'task-user-behavior-analysis',
    name: '任务: 用户行为分析',
    description: '【数据分析】分析用户点击流数据，识别用户使用路径和流失节点。使用SQL和Python进行数据挖掘。',
    type: 'medication',
    sideEffectId: 'member-ma-xue',
    color: '#a5d6a7',
    status: '🔄',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 5,
    assignee: '马雪'
  },
  {
    id: 'task-ab-test-design',
    name: '任务: A/B测试方案',
    description: '【实验设计】为新功能设计A/B测试方案，定义实验假设、样本量、评估指标（CTR、转化率）。计划下周上线。',
    type: 'natural',
    sideEffectId: 'member-ma-xue',
    color: '#81c784',
    status: '✅',
    priority: 'medium',
    taskType: 'task',
    storyPoints: 3,
    assignee: '马雪'
  }
];

export const mainNode = {
  id: 'scrum-project',
  name: '电商平台重构 V2.0',
  description: 'Sprint 8 | 团队12人 | 速率40SP | 已完成65% | 使用Scrum敏捷方法论重构电商平台，采用PBI→用户故事→任务三层分解，提升用户体验、系统性能和代码质量。当前聚焦：用户仪表板、支付集成、自动化测试。',
  color: '#6c5ce7'
};
