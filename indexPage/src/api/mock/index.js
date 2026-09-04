/**
 * Phase 2 集中式 Mock 数据层
 *
 * 说明：
 * - 本文件为所有新页面提供 Mock 数据，便于独立验证前端信息架构。
 * - 每个数据对象都标注了后续对应的真实后端表/接口。
 * - Phase 4 联调时，只需在 src/api/client.js 中切换 useMock = false，
 *   并保持本文件数据结构不变，即可逐步替换为后端接口。
 */

// 工具数据 -> 对应后端表：tool, tool_category, tool_execution
export const mockTools = [
  {
    id: 1,
    slug: 'nginx-generator',
    name: 'Nginx 配置生成器',
    category: '部署',
    summary: '根据域名、HTTPS、反向代理、静态资源等选项，一键生成生产级 Nginx 配置。',
    usageCount: 1247,
    updatedAt: '2026-06-20T10:00:00Z',
    href: '/tools/nginx-generator',
    icon: '⚙️',
    tags: ['Nginx', 'OpenResty', 'Deployment'],
  },
  {
    id: 2,
    slug: 'nginx-checker',
    name: 'Nginx 配置检查器',
    category: '部署',
    summary: '粘贴 Nginx 配置，自动识别 proxy_pass 斜杠、location 优先级、WebSocket 头缺失等常见问题。',
    usageCount: 856,
    updatedAt: '2026-06-21T14:30:00Z',
    href: '/tools/nginx-checker',
    icon: '🔍',
    tags: ['Nginx', 'Diagnostic'],
  },
  {
    id: 3,
    slug: 'cors-generator',
    name: 'CORS 配置生成器',
    category: '后端',
    summary: '为 Spring Boot、Nginx、Node.js 生成跨域配置，支持预检缓存与凭证选项。',
    usageCount: 632,
    updatedAt: '2026-06-18T09:15:00Z',
    href: '/tools/cors-generator',
    icon: '🌐',
    tags: ['CORS', 'Spring Boot', 'Nginx'],
  },
  {
    id: 4,
    slug: 'jwt-parser',
    name: 'JWT 解析器',
    category: '安全',
    summary: '安全地解析 JWT Header、Payload 与 Signature，支持本地校验与过期提示。',
    usageCount: 921,
    updatedAt: '2026-06-19T16:45:00Z',
    href: '/tools/jwt-parser',
    icon: '🔑',
    tags: ['JWT', 'Security'],
  },
  {
    id: 5,
    slug: 'sitemap-checker',
    name: 'Sitemap 检查器',
    category: 'SEO',
    summary: '检查 sitemap.xml 格式、URL 可访问性、lastmod 有效性与重复条目。',
    usageCount: 445,
    updatedAt: '2026-06-17T11:20:00Z',
    href: '/tools/sitemap-checker',
    icon: '🗺️',
    tags: ['SEO', 'Sitemap'],
  },
  {
    id: 6,
    slug: 'cron-generator',
    name: 'Cron 表达式生成器',
    category: '运维',
    summary: '用自然语言或可视化选择生成 Cron 表达式，并给出最近 5 次执行时间。',
    usageCount: 718,
    updatedAt: '2026-06-22T08:00:00Z',
    href: '/tools/cron-generator',
    icon: '⏰',
    tags: ['Cron', 'Linux', 'DevOps'],
  },
]

// 错误知识库 -> 对应后端表：error_solution（扩展）
export const mockErrors = [
  {
    id: 1,
    slug: 'plain-http-sent-to-https-port',
    original: 'The plain HTTP request was sent to HTTPS port',
    title: 'Nginx：HTTP 请求发送到 HTTPS 端口',
    category: 'nginx',
    summary: 'Nginx 监听 HTTPS 端口，但客户端却以 HTTP 协议访问，导致返回 400 Bad Request。',
    updatedAt: '2026-06-20T10:00:00Z',
    href: '/errors/nginx/plain-http-sent-to-https-port',
  },
  {
    id: 2,
    slug: 'shared-memory-zone-conflicts',
    original: 'the size of shared memory zone conflicts with already declared size',
    title: 'Nginx：共享内存区大小冲突',
    category: 'nginx',
    summary: 'limit_req_zone 或 limit_conn_zone 被重复声明且 size 不一致。',
    updatedAt: '2026-06-19T12:00:00Z',
    href: '/errors/nginx/shared-memory-zone-conflicts',
  },
  {
    id: 3,
    slug: 'mime-type-text-html-for-script',
    original: 'Refused to execute script because its MIME type is text/html',
    title: '浏览器：脚本 MIME 类型为 text/html',
    category: 'vue',
    summary: '前端资源路径错误，服务器对 .js 文件返回了 HTML（通常是 404 或路由回退导致）。',
    updatedAt: '2026-06-18T15:30:00Z',
    href: '/errors/vue/mime-type-text-html-for-script',
  },
]

// 文章数据 -> 对应后端表：article, category, tag, article_tag
export const mockArticles = [
  {
    id: 1,
    slug: 'vue-history-mode-nginx-404',
    title: 'Vue Router History 模式下 Nginx 刷新 404 的完整解决',
    summary: '从 try_files 到 location 匹配优先级，彻底解决 Vue 项目部署后刷新 404。',
    cover: '/avatar.png',
    category: '部署',
    tags: ['Vue', 'Nginx', 'History Mode'],
    author: '希燃呀',
    publishedAt: '2026-06-20T10:00:00Z',
    updatedAt: '2026-06-21T09:00:00Z',
    viewCount: 2341,
    href: '/articles/vue-history-mode-nginx-404',
  },
  {
    id: 2,
    slug: 'spring-boot-cors-guide',
    title: 'Spring Boot 3 CORS 配置避坑指南',
    summary: '从 @CrossOrigin 到 CorsFilter，梳理前后端分离下的跨域实战方案。',
    cover: '/avatar.png',
    category: 'Java',
    tags: ['Spring Boot', 'CORS', 'Security'],
    author: '希燃呀',
    publishedAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-06-16T10:00:00Z',
    viewCount: 1892,
    href: '/articles/spring-boot-cors-guide',
  },
  {
    id: 3,
    slug: 'nginx-websocket-proxy-headers',
    title: 'Nginx 反向代理 WebSocket 时容易遗漏的三个请求头',
    summary: 'Upgrade、Connection、X-Forwarded-For，以及为何 proxy_http_version 1.1 必不可少。',
    cover: '/avatar.png',
    category: '部署',
    tags: ['Nginx', 'WebSocket', 'OpenResty'],
    author: '希燃呀',
    publishedAt: '2026-06-10T14:00:00Z',
    updatedAt: '2026-06-12T11:00:00Z',
    viewCount: 1567,
    href: '/articles/nginx-websocket-proxy-headers',
  },
]

// 项目数据 -> 对应后端表：project, project_tag
export const mockProjects = [
  {
    id: 'csandbox',
    slug: 'csandbox',
    name: 'C-Sandbox 在线编译',
    href: 'https://xiranya.cn/csandbox/',
    demoUrl: 'https://xiranya.cn/csandbox/',
    repoUrl: 'https://github.com/Xiranwuxianxi',
    type: '工具',
    status: 'online',
    statusText: '运行中',
    icon: '⚡',
    tags: ['C', 'WebAssembly', 'Compiler'],
    summary: '轻量级 C 语言在线编译环境，打开即写，适合快速验证想法、调试片段和记录实验结果。',
    cover: '/avatar.png',
    techStack: ['Vue 3', 'Vite', 'WebAssembly', 'Docker'],
    updatedAt: '2026-06-20T10:00:00Z',
  },
  {
    id: 'diaries',
    slug: 'diaries',
    name: '日记空间',
    href: 'https://xiranya.cn/diaries/',
    demoUrl: 'https://xiranya.cn/diaries/',
    repoUrl: null,
    type: '日记',
    status: 'active',
    statusText: '持续更新',
    icon: '📓',
    tags: ['Halo', 'Writing', 'Personal'],
    summary: '一个可以随手写日记、记录想法和沉淀生活片段的私人写作空间。',
    cover: '/avatar.png',
    techStack: ['Halo', 'MySQL', 'Nginx'],
    updatedAt: '2026-06-18T09:00:00Z',
  },
  {
    id: 'blog',
    slug: 'xiran-blog',
    name: '博客小栈',
    href: 'https://halo.xiranya.cn/',
    demoUrl: 'https://halo.xiranya.cn/',
    repoUrl: null,
    type: '文章',
    status: 'active',
    statusText: '持续更新',
    icon: '📚',
    tags: ['Halo', 'Java', 'Vue'],
    summary: '基于 Halo 构建的个人技术博客，记录编译器、前后端工程、系统优化和持续学习的过程。',
    cover: '/avatar.png',
    techStack: ['Spring Boot', 'Halo', 'Vue 3'],
    updatedAt: '2026-06-19T11:00:00Z',
  },
]

// 教程分类 -> 对应后端表：tutorial_category
export const mockTutorialCategories = [
  { id: 'deployment', name: '部署与服务器', slug: 'deployment', count: 12 },
  { id: 'java', name: 'Java 后端', slug: 'java', count: 8 },
  { id: 'frontend', name: 'Vue 前端', slug: 'frontend', count: 10 },
  { id: 'ai', name: 'AI 工程化', slug: 'ai', count: 6 },
  { id: 'server', name: 'Linux 与运维', slug: 'server', count: 9 },
]

// 热门搜索 -> 对应后端表：search_history 聚合
export const mockHotSearches = [
  'nginx 404',
  'Vue history mode',
  'Spring Boot CORS',
  'JWT 解析',
  'Docker Compose 部署',
  'HTTPS 强制跳转',
]

// 用户数据 -> 对应后端表：user, oauth_account
export const mockUser = {
  id: 1,
  username: 'xiran',
  nickname: '希燃呀',
  email: 'hello@xiranya.cn',
  avatar: '/avatar.png',
  role: 'ADMIN',
  bio: '探索底层逻辑，用代码重构世界。',
  github: 'https://github.com/Xiranwuxianxi',
  createdAt: '2025-03-01T00:00:00Z',
}

// 首页聚合数据 -> 对应后端接口：GET /api/v1/home
export const mockHomeData = {
  hero: {
    eyebrow: 'XIRAN DEVELOPER PLATFORM',
    title: '希燃呀',
    subtitle: '面向开发者的在线工具、报错解决方案与工程实验平台',
    description:
      '当你遇到 Nginx、Spring Boot、Vue、Docker 或 AI 工程化问题时，在这里搜索错误、使用工具、阅读解决方案，并把配置保存下来。',
    primaryAction: { text: '使用在线工具', href: '/tools' },
    secondaryAction: { text: '搜索错误', href: '/errors' },
    tertiaryAction: { text: '浏览项目', href: '/projects' },
  },
  hotTools: mockTools.slice(0, 6),
  commonErrors: mockErrors.slice(0, 3),
  featuredProjects: mockProjects.slice(0, 3),
  latestArticles: mockArticles.slice(0, 3),
  focusAreas: [
    {
      title: '部署与服务器',
      items: ['Nginx', 'OpenResty', 'Linux', 'HTTPS', 'Docker', 'GitHub Actions'],
    },
    {
      title: 'Java 后端',
      items: ['Spring Boot', 'Spring Security', 'JWT', 'MyBatis Plus', 'Redis', 'MinIO'],
    },
    {
      title: 'Vue 前端',
      items: ['Vue 3', 'Vite', 'Vue Router', 'Axios', '性能优化', 'SEO'],
    },
    {
      title: 'AI 工程化',
      items: ['Spring AI', 'LangChain4j', 'MCP', 'Agent', 'RAG', 'n8n'],
    },
  ],
}

// 模拟分页响应结构
const buildPageResponse = (list, page = 1, size = 10) => ({
  list: list.slice((page - 1) * size, page * size),
  page,
  size,
  total: list.length,
  pages: Math.ceil(list.length / size),
})

// 平台入口 -> 对应后端接口：GET /api/v1/widgets
export const mockPlatforms = [
  {
    key: 'csandbox',
    name: '代码运行平台',
    subtitle: 'C-Sandbox',
    description: '轻量级 C 语言在线编译环境，打开即写，适合快速验证想法、调试片段和记录实验结果。',
    href: 'https://xiranya.cn/csandbox/',
    icon: '⚡',
  },
  {
    key: 'halo',
    name: 'Halo 博客',
    subtitle: '技术博客',
    description: '基于 Halo 构建的个人技术博客，记录编译器、前后端工程、系统优化和持续学习的过程。',
    href: 'https://halo.xiranya.cn/',
    icon: '📚',
  },
  {
    key: 'myblogs',
    name: '简单博客',
    subtitle: '随笔小站',
    description: '一个可以随手写日记、记录想法和沉淀生活片段的私人写作空间。',
    href: 'https://xiranya.cn/myblogs/',
    icon: '✍️',
  },
]

// 实用工具 -> 对应后端接口：GET /api/v1/widgets
export const mockUtilities = [
  { key: 'timestamp', name: '时间戳转换', description: 'Unix 时间戳与日期时间互转', icon: '⏱️' },
  { key: 'base64', name: 'Base64 编解码', description: '文本与 Base64 字符串互转', icon: '🔤' },
  { key: 'json', name: 'JSON 格式化', description: '压缩 JSON 美化排版并校验合法性', icon: '🧩' },
  { key: 'password', name: '随机密码', description: '一键生成高强度随机密码', icon: '🔑' },
  { key: 'color', name: '颜色转换', description: 'HEX / RGB / HSL 颜色格式互转', icon: '🎨' },
]

// 世界时间 -> 对应后端接口：GET /api/v1/widgets/world-clock
export const mockWorldClock = {
  updatedAt: Date.now(),
  cities: [
    { key: 'beijing', city: '北京', country: '中国', timezone: 'Asia/Shanghai', localTime: '2026-08-30 20:15:00', utcOffset: '+08:00' },
    { key: 'london', city: '伦敦', country: '英国', timezone: 'Europe/London', localTime: '2026-08-30 13:15:00', utcOffset: '+01:00' },
    { key: 'newyork', city: '纽约', country: '美国', timezone: 'America/New_York', localTime: '2026-08-30 08:15:00', utcOffset: '-04:00' },
  ],
}

// 天气 -> 对应后端接口：GET /api/v1/widgets/weather?city=
export const mockWeather = {
  beijing: { city: 'beijing', cityName: '北京', country: '中国', temperature: 26.0, unit: '°C', weatherCode: 0, description: '晴', icon: '☀️', windSpeed: 8.0, source: 'mock', observedAt: '2026-08-30 20:00:00' },
  london: { city: 'london', cityName: '伦敦', country: '英国', temperature: 15.0, unit: '°C', weatherCode: 2, description: '局部多云', icon: '⛅', windSpeed: 12.0, source: 'mock', observedAt: '2026-08-30 20:00:00' },
  newyork: { city: 'newyork', cityName: '纽约', country: '美国', temperature: 22.0, unit: '°C', weatherCode: 1, description: '基本晴朗', icon: '🌤️', windSpeed: 10.0, source: 'mock', observedAt: '2026-08-30 20:00:00' },
}

/**
 * Mock API 客户端
 * 每个方法返回 Promise，结构与后端统一响应格式一致。
 */
export const mockApi = {
  // 首页
  getHome: () => Promise.resolve({ code: 200, message: 'success', data: mockHomeData }),

  // 工具
  getTools: (params = {}) =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: buildPageResponse(mockTools, params.page, params.size),
    }),
  getTool: (slug) => {
    const tool = mockTools.find((t) => t.slug === slug)
    return tool
      ? Promise.resolve({ code: 200, message: 'success', data: tool })
      : Promise.reject({ code: 404, message: '工具不存在' })
  },

  // 错误
  getErrors: (params = {}) =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: buildPageResponse(mockErrors, params.page, params.size),
    }),
  getError: (slug) => {
    const error = mockErrors.find((e) => e.slug === slug)
    return error
      ? Promise.resolve({ code: 200, message: 'success', data: error })
      : Promise.reject({ code: 404, message: '错误条目不存在' })
  },

  // 文章
  getArticles: (params = {}) =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: buildPageResponse(mockArticles, params.page, params.size),
    }),
  getArticle: (slug) => {
    const article = mockArticles.find((a) => a.slug === slug)
    return article
      ? Promise.resolve({ code: 200, message: 'success', data: article })
      : Promise.reject({ code: 404, message: '文章不存在' })
  },

  // 项目
  getProjects: (params = {}) =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: buildPageResponse(mockProjects, params.page, params.size),
    }),
  getProject: (slug) => {
    const project = mockProjects.find((p) => p.slug === slug)
    return project
      ? Promise.resolve({ code: 200, message: 'success', data: project })
      : Promise.reject({ code: 404, message: '项目不存在' })
  },

  // 搜索
  search: (params = {}) => {
    const q = (params.q || '').toLowerCase()
    const results = [
      ...mockArticles.map((a) => ({ ...a, type: 'article' })),
      ...mockErrors.map((e) => ({ ...e, type: 'error' })),
      ...mockTools.map((t) => ({ ...t, type: 'tool' })),
      ...mockProjects.map((p) => ({ ...p, type: 'project' })),
    ].filter((item) =>
      [item.title, item.summary, item.tags?.join(' ')].join(' ').toLowerCase().includes(q),
    )
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: buildPageResponse(results, params.page, params.size),
    })
  },
  getHotSearches: () =>
    Promise.resolve({ code: 200, message: 'success', data: mockHotSearches }),

  // 首页小组件
  getWidgets: () =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: { platforms: mockPlatforms, utilities: mockUtilities },
    }),
  getWorldClock: () =>
    Promise.resolve({ code: 200, message: 'success', data: mockWorldClock }),
  getWeather: (city) =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: mockWeather[city] || mockWeather.beijing,
    }),

  // 认证
  login: () =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresIn: 2592000,
        user: mockUser,
      },
    }),
  register: (data) =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresIn: 2592000,
        user: {
          ...mockUser,
          username: data.username,
          email: data.email,
          nickname: data.nickname || data.username,
          role: 'USER',
        },
      },
    }),
  getMe: () => Promise.resolve({ code: 200, message: 'success', data: mockUser }),
  logout: () => Promise.resolve({ code: 200, message: 'success', data: null }),

  // 用户
  getBookmarks: () =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: mockArticles.map((a) => ({ ...a, bookmarkId: a.id, type: 'article' })),
    }),
  getHistory: () =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: mockTools.map((t) => ({ ...t, visitedAt: '2026-06-22T10:00:00Z', type: 'tool' })),
    }),
  getSavedConfigs: () =>
    Promise.resolve({
      code: 200,
      message: 'success',
      data: [
        {
          id: 1,
          name: 'Vue + Spring Boot 生产配置',
          toolSlug: 'nginx-generator',
          toolName: 'Nginx 配置生成器',
          createdAt: '2026-06-21T16:00:00Z',
        },
      ],
    }),
}
