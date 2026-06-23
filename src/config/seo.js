export const siteBaseUrl = 'https://xiranya.cn'

export const siteBrand = '希燃呀'

export const siteName = '希燃呀数字研发实验场'

export const siteTagline = '探索底层逻辑，用代码重构世界。'

export const socialProfiles = [
  'https://github.com/Xiranwuxianxi',
  'https://space.bilibili.com/3494360370907205',
  'https://www.douyin.com/user/MS4wLjABAAAAlQ6nUTklviASd3lZjc8bQC04lgBcw6YN0MYNxwmhhBVH4tUSZFcDc6cqxpSAupm8',
]

export const siteNavigationLinks = [
  {
    id: 'home',
    label: '首页',
    navLabel: '首页',
    href: '/',
    url: `${siteBaseUrl}/`,
    type: 'router',
    description: '希燃呀的个人数字主页，聚合工具、日记、博客、开源项目和个人平台入口。',
  },
  {
    id: 'projects',
    label: '项目索引',
    navLabel: '项目',
    href: '/projects',
    url: `${siteBaseUrl}/projects/`,
    type: 'router',
    description: '集中浏览希燃呀的在线工具、日记空间、技术博客和开源项目入口。',
  },
  {
    id: 'about',
    label: '关于希燃呀',
    navLabel: '关于',
    href: '/about',
    url: `${siteBaseUrl}/about/`,
    type: 'router',
    description: '了解希燃呀的建设方向、技术实践、内容平台和长期记录计划。',
  },
  {
    id: 'csandbox',
    label: 'C-Sandbox 在线编译',
    navLabel: 'C-Sandbox',
    href: `${siteBaseUrl}/csandbox/`,
    url: `${siteBaseUrl}/csandbox/`,
    type: 'external',
    description: '轻量级 C 语言在线编译环境，适合快速验证想法、调试片段和记录实验结果。',
  },
  {
    id: 'diaries',
    label: '日记空间',
    navLabel: '日记',
    href: `${siteBaseUrl}/diaries/`,
    url: `${siteBaseUrl}/diaries/`,
    type: 'external',
    description: '可以写日记、记录想法和沉淀生活片段的私人写作空间。',
  },
  {
    id: 'blog',
    label: '技术博客',
    navLabel: '博客',
    href: 'https://halo.xiranya.cn/',
    url: 'https://halo.xiranya.cn/',
    type: 'external',
    description: '记录编译器、前后端工程、系统优化和持续学习过程的技术博客。',
  },
  {
    id: 'rss',
    label: 'RSS 订阅',
    navLabel: 'RSS',
    href: 'https://halo.xiranya.cn/rss.xml',
    url: 'https://halo.xiranya.cn/rss.xml',
    type: 'external',
    description: '订阅博客更新，通过 RSS 阅读器获取最新文章。',
  },
]

export const routeSeoMap = {
  home: {
    routeName: 'home',
    title: '希燃呀 | 数字研发实验场',
    description:
      '希燃呀的个人数字主页，收录 C-Sandbox 在线编译、日记空间、技术博客、开源项目，并关联 GitHub、B 站、抖音等个人平台。',
    keywords:
      '希燃呀,Xiran,C-Sandbox,在线编译,日记空间,技术博客,开源项目,GitHub,B站,抖音,Vue,Vite,个人主页',
    canonical: `${siteBaseUrl}/`,
    robots: 'index,follow',
  },
  projects: {
    routeName: 'projects',
    title: '项目索引 | 希燃呀',
    description:
      '集中浏览希燃呀的在线工具、日记空间、技术博客和开源项目入口，包括 C-Sandbox 在线编译、个人日记、Halo 博客和 Gitee 开源主页。',
    keywords: '希燃呀项目,C-Sandbox,在线编译,日记空间,Halo博客,Gitee开源,个人项目索引',
    canonical: `${siteBaseUrl}/projects/`,
    robots: 'index,follow',
  },
  about: {
    routeName: 'about',
    title: '关于希燃呀 | 数字研发实验场',
    description:
      '了解希燃呀数字研发实验场的建设方向、技术实践、内容创作和 GitHub、B 站、抖音等个人平台入口。',
    keywords: '关于希燃呀,数字研发实验场,技术实践,内容创作,GitHub,B站,抖音',
    canonical: `${siteBaseUrl}/about/`,
    robots: 'index,follow',
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
        itemListElement: siteNavigationLinks.map((link, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: link.label,
          url: link.url,
          description: link.description,
        })),
      },
      ...siteNavigationLinks.map((link) => ({
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
