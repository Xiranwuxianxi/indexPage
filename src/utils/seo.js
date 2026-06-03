const defaultSeo = {
  title: '希燃呐 | 数字研发实验场',
  description:
    '希燃呐的个人数字主页，收录 C-Sandbox 在线编译、日记空间、技术博客、开源项目，并关联 GitHub、B 站、抖音等个人平台。',
  keywords:
    '希燃呐,Xiran,C-Sandbox,在线编译,日记,技术博客,开源项目,GitHub,B站,抖音,Vue,Vite,个人主页',
  canonical: 'http://xiranya.cn/',
  robots: 'index,follow',
}

const setMeta = (selector, attribute, value) => {
  if (!value) {
    return
  }

  const element = document.head.querySelector(selector)

  if (element) {
    element.setAttribute(attribute, value)
  }
}

const setCanonical = (href) => {
  let canonical = document.head.querySelector('link[rel="canonical"]')

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.append(canonical)
  }

  canonical.setAttribute('href', href)
}

export const applyRouteSeo = (routeMeta = {}) => {
  const seo = {
    ...defaultSeo,
    ...routeMeta,
  }

  document.title = seo.title
  setMeta('meta[name="description"]', 'content', seo.description)
  setMeta('meta[name="keywords"]', 'content', seo.keywords)
  setMeta('meta[name="robots"]', 'content', seo.robots)
  setMeta('meta[property="og:title"]', 'content', seo.title)
  setMeta('meta[property="og:description"]', 'content', seo.description)
  setMeta('meta[property="og:url"]', 'content', seo.canonical)
  setMeta('meta[name="twitter:title"]', 'content', seo.title)
  setMeta('meta[name="twitter:description"]', 'content', seo.description)
  setCanonical(seo.canonical)
}
