/**
 * 站点 SEO 与导航配置
 *
 * Phase 2 扩展：
 * - 新增工具、错误、文章、搜索、登录、用户、后台等路由 SEO 配置。
 * - 导航结构从个人主页升级为开发者平台入口。
 * - 所有动态页面（/articles/:slug 等）在 Phase 6 接入预渲染/SSG 后补充独立 SEO。
 */

export const siteBaseUrl = 'https://xiranya.cn'

export const siteBrand = '希燃呀'

export const siteName = '希燃呀开发者平台'

export const siteTagline = '面向开发者的在线工具、报错解决方案与工程实验平台。'

export const socialProfiles = [
  'https://github.com/Xiranwuxianxi',
  'https://space.bilibili.com/3494360370907205',
  'https://www.douyin.com/user/MS4wLjABAAAAlQ6nUTklviASd3lZjc8bQC04lgBcw6YN0MYNxwmhhBVH4tUSZFcDc6cqxpSAupm8',
]

/**
 * 站点导航链接
 * type: 'router' 使用 RouterLink；'external' 使用 <a> 外部链接。
 */
export const siteNavigationLinks = [
  {
    id: 'home',
    label: '首页',
    navLabel: '首页',
    href: '/',
    url: `${siteBaseUrl}/`,
    type: 'router',
    description: '希燃呀开发者平台首页，聚合在线工具、报错解决方案、技术文章与开源项目。',
  },
  {
    id: 'tools',
    label: '在线工具',
    navLabel: '工具',
    href: '/tools',
    url: `${siteBaseUrl}/tools/`,
    type: 'router',
    description: 'Nginx 配置生成器、配置检查器、CORS 生成器、JWT 解析器等开发者在线工具。',
  },
  {
    id: 'errors',
    label: '错误知识库',
    navLabel: '错误',
    href: '/errors',
    url: `${siteBaseUrl}/errors/`,
    type: 'router',
    description: '收录 Nginx、Spring Boot、Vue、Docker、Linux 常见开发错误与完整解决方案。',
  },
  {
    id: 'articles',
    label: '技术文章',
    navLabel: '文章',
    href: '/articles',
    url: `${siteBaseUrl}/articles/`,
    type: 'router',
    description: 'Java、Vue、Nginx、Docker、AI 工程化等技术文章与实战教程。',
  },
  {
    id: 'projects',
    label: '项目索引',
    navLabel: '项目',
    href: '/projects',
    url: `${siteBaseUrl}/projects/`,
    type: 'router',
    description: '集中浏览希燃呀的在线工具、开源项目与技术实验。',
  },
  {
    id: 'about',
    label: '关于',
    navLabel: '关于',
    href: '/about',
    url: `${siteBaseUrl}/about/`,
    type: 'router',
    description: '了解希燃呀开发者平台的建设方向、技术实践与内容计划。',
  },
  {
    id: 'csandbox',
    label: 'C-Sandbox',
    navLabel: 'C-Sandbox',
    href: `${siteBaseUrl}/csandbox/`,
    url: `${siteBaseUrl}/csandbox/`,
    type: 'external',
    description: '轻量级 C 语言在线编译环境。',
  },
  {
    id: 'blog',
    label: '技术博客',
    navLabel: '博客',
    href: 'https://halo.xiranya.cn/',
    url: 'https://halo.xiranya.cn/',
    type: 'external',
    description: '基于 Halo 构建的个人技术博客。',
  },
]

/**
 * 路由级 SEO 配置
 * 用于 router meta 与构建后静态页生成。
 */
export const routeSeoMap = {
  home: {
    routeName: 'home',
    title: '希燃呀 | 面向开发者的工具、报错解决方案与工程实验平台',
    description:
      '希燃呀开发者平台提供 Nginx 配置生成器、配置检查器、CORS 生成器、JWT 解析器等在线工具，以及报错解决方案、技术文章和开源项目。',
    keywords:
      '希燃呀,开发者平台,Nginx配置生成器,Vue部署,Spring Boot,CORS,JWT,在线工具,错误解决方案',
    canonical: `${siteBaseUrl}/`,
    robots: 'index,follow',
  },
  tools: {
    routeName: 'tools',
    title: '在线工具 | 希燃呀开发者平台',
    description:
      '免费开发者在线工具集合：Nginx 配置生成器、Nginx 配置检查器、CORS 配置生成器、JWT 解析器、Sitemap 检查器、Cron 表达式生成器。',
    keywords: 'Nginx配置生成器,Nginx检查器,CORS生成器,JWT解析器,Sitemap检查器,Cron生成器',
    canonical: `${siteBaseUrl}/tools/`,
    robots: 'index,follow',
  },
  errors: {
    routeName: 'errors',
    title: '错误知识库 | 希燃呀开发者平台',
    description:
      '收录 Nginx、Spring Boot、Vue、Docker、Linux 常见开发错误，提供错误原因、配置示例与完整解决方案。',
    keywords: 'Nginx错误,Spring Boot错误,Vue错误,Docker错误,Linux错误,错误解决方案',
    canonical: `${siteBaseUrl}/errors/`,
    robots: 'index,follow',
  },
  articles: {
    routeName: 'articles',
    title: '技术文章 | 希燃呀开发者平台',
    description:
      'Java 后端、Vue 前端、Nginx/OpenResty、Docker、AI 工程化等技术文章与实战教程。',
    keywords: '技术文章,Vue教程,Spring Boot教程,Nginx教程,Docker教程,AI工程化',
    canonical: `${siteBaseUrl}/articles/`,
    robots: 'index,follow',
  },
  tutorials: {
    routeName: 'tutorials',
    title: '教程中心 | 希燃呀开发者平台',
    description:
      '按主题整理的系统教程：部署与服务器、Java 后端、Vue 前端、AI 工程化、Linux 与运维。',
    keywords: '教程,部署教程,Java教程,Vue教程,AI教程,Linux教程',
    canonical: `${siteBaseUrl}/tutorials/`,
    robots: 'index,follow',
  },
  projects: {
    routeName: 'projects',
    title: '项目索引 | 希燃呀',
    description:
      '集中浏览希燃呀的在线工具、技术实验和开源项目入口，包括 C-Sandbox 在线编译、日记空间、Halo 博客等。',
    keywords: '希燃呀项目,C-Sandbox,在线编译,日记空间,Halo博客,开源项目',
    canonical: `${siteBaseUrl}/projects/`,
    robots: 'index,follow',
  },
  about: {
    routeName: 'about',
    title: '关于希燃呀 | 开发者平台',
    description:
      '了解希燃呀开发者平台的建设方向、技术实践、内容创作和 GitHub、B 站、抖音等个人平台入口。',
    keywords: '关于希燃呀,开发者平台,技术实践,内容创作,GitHub,B站,抖音',
    canonical: `${siteBaseUrl}/about/`,
    robots: 'index,follow',
  },
  search: {
    routeName: 'search',
    title: '搜索 | 希燃呀开发者平台',
    description: '搜索希燃呀开发者平台的工具、错误解决方案、技术文章和开源项目。',
    keywords: '搜索,开发者工具,错误解决方案,技术文章',
    canonical: `${siteBaseUrl}/search/`,
    robots: 'noindex,follow',
  },
  login: {
    routeName: 'login',
    title: '登录 | 希燃呀开发者平台',
    description: '使用 GitHub 或邮箱登录希燃呀开发者平台，收藏文章、保存配置、管理个人中心。',
    keywords: '登录,GitHub登录,开发者平台',
    canonical: `${siteBaseUrl}/login/`,
    robots: 'noindex,nofollow',
  },
  user: {
    routeName: 'user',
    title: '用户中心 | 希燃呀开发者平台',
    description: '管理你的收藏、历史记录、保存的配置和账号设置。',
    keywords: '用户中心,收藏,历史记录',
    canonical: `${siteBaseUrl}/user/`,
    robots: 'noindex,nofollow',
  },
  admin: {
    routeName: 'admin',
    title: '管理后台 | 希燃呀开发者平台',
    description: '希燃呀开发者平台管理后台。',
    keywords: '管理后台',
    canonical: `${siteBaseUrl}/admin/`,
    robots: 'noindex,nofollow',
  },
  notFound: {
    routeName: 'not-found',
    title: '页面未找到 | 希燃呀',
    description: '当前站内路径没有匹配到页面，可以回到首页或项目索引继续浏览。',
    keywords: '希燃呀,404,页面未找到',
    canonical: `${siteBaseUrl}/`,
    robots: 'noindex,follow',
  },
}

const getBreadcrumbItems = (pageSeo) => {
  if (pageSeo.routeName === 'home') {
    return [{ name: '首页', url: `${siteBaseUrl}/` }]
  }

  const current = siteNavigationLinks.find((link) => link.url === pageSeo.canonical)

  return [
    { name: '首页', url: `${siteBaseUrl}/` },
    { name: current?.label || pageSeo.title, url: pageSeo.canonical },
  ]
}

export const buildStructuredData = (pageSeo = routeSeoMap.home) => {
  const personId = `${siteBaseUrl}/#person`
  const websiteId = `${siteBaseUrl}/#website`
  const pageId = `${pageSeo.canonical}#webpage`
  const breadcrumbId = `${pageSeo.canonical}#breadcrumb`
  const navigationId = `${siteBaseUrl}/#site-navigation`
  const breadcrumbItems = getBreadcrumbItems(pageSeo)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: siteBrand,
        url: `${siteBaseUrl}/`,
        sameAs: socialProfiles,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteName,
        alternateName: ['希燃呀', '希燃呐', 'XIRAN DIGITAL LAB'],
        url: `${siteBaseUrl}/`,
        description: routeSeoMap.home.description,
        inLanguage: 'zh-CN',
        publisher: {
          '@id': personId,
        },
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: pageSeo.canonical,
        name: pageSeo.title,
        description: pageSeo.description,
        inLanguage: 'zh-CN',
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': personId,
        },
        breadcrumb: {
          '@id': breadcrumbId,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': navigationId,
        name: '希燃呀站内核心入口',
        itemListElement: siteNavigationLinks
          .filter((link) => link.type === 'router')
          .map((link, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: link.label,
            url: link.url,
            description: link.description,
          })),
      },
      ...siteNavigationLinks
        .filter((link) => link.type === 'router')
        .map((link) => ({
          '@type': 'SiteNavigationElement',
          '@id': `${link.url}#navigation`,
          name: link.label,
          url: link.url,
          description: link.description,
        })),
    ],
  }
}

export const stringifyStructuredData = (pageSeo = routeSeoMap.home) =>
  JSON.stringify(buildStructuredData(pageSeo), null, 2)
