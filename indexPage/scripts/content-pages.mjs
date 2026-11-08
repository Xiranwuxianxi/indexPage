/**
 * 动态详情页静态 HTML 生成器（纯函数，便于测试）
 *
 * 构建期把后端返回的文章 / 错误方案 / 工具 / 项目内容注入 <div id="app">，
 * 并为每页输出独立 title/description/keywords/canonical 与细粒度 JSON-LD
 * （Article / FAQPage / SoftwareApplication / CreativeWork）。
 *
 * 客户端 Vue 挂载时会替换 #app 内容，不影响 SPA 正常运行；
 * 但 AI 爬虫与禁 JS 环境能直接读到完整正文。
 */

import { routeSeoMap, siteBaseUrl, siteBrand, siteName, socialProfiles } from '../src/config/seo.js'
import {
  absoluteUrl,
  escapeHtml,
  sanitizeArticleHtml,
  setJsonLd,
  setOgType,
  stripHtml,
  textToHtml,
  toIsoDateTime,
  truncate,
  updatePageHtml,
} from './seo-html-utils.mjs'

const personId = `${siteBaseUrl}/#person`
const websiteId = `${siteBaseUrl}/#website`

/* ---------- JSON-LD 基础节点 ---------- */

const personNode = () => ({
  '@type': 'Person',
  '@id': personId,
  name: siteBrand,
  url: `${siteBaseUrl}/`,
  sameAs: socialProfiles,
})

const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': websiteId,
  name: siteName,
  url: `${siteBaseUrl}/`,
  inLanguage: 'zh-CN',
  publisher: { '@id': personId },
})

const breadcrumbNode = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

const buildJsonLd = (mainNode, breadcrumbItems) => ({
  '@context': 'https://schema.org',
  '@graph': [personNode(), websiteNode(), mainNode, breadcrumbNode(breadcrumbItems)],
})

/* ---------- 正文外壳 ---------- */

const siteNavHtml = `
      <nav aria-label="站点导航">
        <a href="${siteBaseUrl}/">首页</a> ·
        <a href="${siteBaseUrl}/tools/">在线工具</a> ·
        <a href="${siteBaseUrl}/errors/">错误知识库</a> ·
        <a href="${siteBaseUrl}/articles/">技术文章</a> ·
        <a href="${siteBaseUrl}/projects/">项目索引</a> ·
        <a href="${siteBaseUrl}/about/">关于</a>
      </nav>`

const prerenderStyle = `
    <style data-prerender="seo">
      .prerender-seo { max-width: 820px; margin: 0 auto; padding: 48px 20px 64px; font-family: system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; line-height: 1.85; color: #1f2328; }
      .prerender-seo nav { margin-bottom: 28px; font-size: 0.92rem; }
      .prerender-seo a { color: #2563eb; text-decoration: none; }
      .prerender-seo h1 { margin: 0 0 16px; font-size: 1.9rem; line-height: 1.35; }
      .prerender-seo h2 { margin: 36px 0 12px; font-size: 1.25rem; }
      .prerender-seo .meta { margin: 0 0 24px; color: #6b7280; font-size: 0.9rem; }
      .prerender-seo .summary { padding: 14px 18px; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; background: #f8fafc; color: #374151; }
      .prerender-seo pre { padding: 14px 16px; border-radius: 8px; background: #f6f8fa; font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap; word-break: break-all; overflow-x: auto; }
      .prerender-seo pre.error { background: #fff1f2; color: #9f1239; }
      .prerender-seo pre.ok { background: #f0fdf4; }
      .prerender-seo code { font-family: 'JetBrains Mono', Consolas, monospace; }
      .prerender-seo img { max-width: 100%; height: auto; border-radius: 10px; }
      .prerender-seo .article-body pre { margin: 16px 0; }
      .prerender-seo ul { padding-left: 22px; }
      .prerender-seo footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.88rem; }
    </style>`

const breadcrumbHtml = (sectionLabel, sectionPath, title) =>
  `<a href="${siteBaseUrl}/">首页</a> &gt; <a href="${siteBaseUrl}${sectionPath}">${escapeHtml(
    sectionLabel,
  )}</a> &gt; <span>${escapeHtml(title)}</span>`

const wrapContent = (crumbs, bodyHtml) => `
    <div class="prerender-seo" data-prerender="seo">
${siteNavHtml}
      <p aria-label="面包屑">${crumbs}</p>
      <main>
${bodyHtml}
      </main>
      <footer>
        <p>内容由 ${siteBrand} 发布于 <a href="${siteBaseUrl}/">${siteName}</a>。站点导览：<a href="${siteBaseUrl}/sitemap.xml">sitemap.xml</a> ・ <a href="${siteBaseUrl}/llms.txt">llms.txt</a></p>
      </footer>
    </div>`

const renderPage = (template, { seo, jsonLd, ogType = 'website', crumbs, bodyHtml }) => {
  let html = updatePageHtml(template, seo)
  html = setJsonLd(html, jsonLd)

  if (ogType !== 'website') {
    html = setOgType(html, ogType)
  }

  html = html.replace('</head>', `${prerenderStyle}\n  </head>`)
  html = html.replace(
    /<div id="app">[\s\S]*?<\/div>/,
    `<div id="app">${wrapContent(crumbs, bodyHtml)}</div>`,
  )

  return html
}

const metaLine = (parts) => {
  const text = parts.filter(Boolean).join(' ・ ')
  return text ? `<p class="meta">${escapeHtml(text)}</p>` : ''
}

/* ---------- 文章 ---------- */

export const buildArticlePage = (template, article) => {
  const canonical = `${siteBaseUrl}/articles/${article.slug}/`
  const description = truncate(article.summary || stripHtml(article.htmlContent))
  const keywords =
    [article.category, ...(article.tags || [])].filter(Boolean).join(',') ||
    routeSeoMap.articles.keywords

  const seo = {
    title: `${article.title} | ${siteName}`,
    description,
    keywords,
    canonical,
    robots: 'index,follow',
  }

  const jsonLd = buildJsonLd(
    {
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: article.title,
      description,
      inLanguage: 'zh-CN',
      ...(article.cover ? { image: absoluteUrl(article.cover, siteBaseUrl) } : {}),
      author: { '@id': personId },
      publisher: { '@id': personId },
      ...(article.publishedAt ? { datePublished: toIsoDateTime(article.publishedAt) } : {}),
      dateModified: toIsoDateTime(article.updatedAt || article.publishedAt),
      mainEntityOfPage: canonical,
      keywords,
    },
    [
      { name: '首页', url: `${siteBaseUrl}/` },
      { name: '技术文章', url: `${siteBaseUrl}/articles/` },
      { name: article.title, url: canonical },
    ],
  )

  const bodyHtml = `        <article>
          <h1>${escapeHtml(article.title)}</h1>
          ${metaLine([
            article.category,
            article.author && `作者：${article.author}`,
            article.publishedAt && `发布于 ${article.publishedAt}`,
            article.viewCount != null && `阅读 ${Number(article.viewCount).toLocaleString()}`,
          ])}
          ${
            article.cover
              ? `<p><img src="${escapeHtml(absoluteUrl(article.cover, siteBaseUrl))}" alt="${escapeHtml(
                  article.title,
                )}" width="1200" height="630" /></p>`
              : ''
          }
          ${article.summary ? `<p class="summary">${escapeHtml(article.summary)}</p>` : ''}
          <div class="article-body">
${sanitizeArticleHtml(article.htmlContent)}
          </div>
        </article>`

  return renderPage(template, {
    seo,
    jsonLd,
    ogType: 'article',
    crumbs: breadcrumbHtml('技术文章', '/articles/', article.title),
    bodyHtml,
  })
}

/* ---------- 错误解决方案 ---------- */

export const buildErrorPage = (template, error) => {
  const href = error.href || `/errors/${error.category}/${error.slug}`
  const canonical = `${siteBaseUrl}${href.replace(/\/+$/, '')}/`
  const description = truncate(error.summary || error.solution || error.original)
  const keywords = [error.category && `${error.category}错误`, error.title, '错误解决方案']
    .filter(Boolean)
    .join(',')

  const seo = {
    title: `${error.title} - 原因与解决方案 | ${siteName}`,
    description,
    keywords,
    canonical,
    robots: 'index,follow',
  }

  const answerText = truncate(
    String(error.solution || error.summary || error.original || '').trim(),
    500,
  )

  const jsonLd = buildJsonLd(
    {
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      mainEntity: {
        '@type': 'Question',
        name: `如何解决：${error.title}`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerText,
        },
      },
    },
    [
      { name: '首页', url: `${siteBaseUrl}/` },
      { name: '错误知识库', url: `${siteBaseUrl}/errors/` },
      { name: error.title, url: canonical },
    ],
  )

  const block = (heading, content, kind) => {
    if (!content) {
      return ''
    }
    if (kind === 'pre-error') {
      return `          <section><h2>${heading}</h2><pre class="error">${escapeHtml(content)}</pre></section>`
    }
    if (kind === 'pre-ok') {
      return `          <section><h2>${heading}</h2><pre class="ok">${escapeHtml(content)}</pre></section>`
    }
    return `          <section><h2>${heading}</h2>${textToHtml(content)}</section>`
  }

  const bodyHtml = `        <article>
          <h1>${escapeHtml(error.title)}</h1>
          ${metaLine([
            error.category && `分类：${error.category}`,
            error.updatedAt && `更新于 ${error.updatedAt}`,
          ])}
${block('错误原文', error.original, 'pre-error')}
${block('问题概述', error.summary)}
${block('产生原因', error.cause)}
${block('常见场景', error.scenario)}
${block('错误示例', error.wrongExample, 'pre-error')}
${block('正确示例', error.correctExample, 'pre-ok')}
${block('解决方案', error.solution)}
${block('验证命令', error.verifyCommand, 'pre-ok')}
${block('常见误区', error.misunderstanding)}
        </article>`

  return renderPage(template, {
    seo,
    jsonLd,
    crumbs: breadcrumbHtml('错误知识库', '/errors/', error.title),
    bodyHtml,
  })
}

/* ---------- 在线工具 ---------- */

export const buildToolPage = (template, tool) => {
  const canonical = `${siteBaseUrl}/tools/${tool.slug}/`
  const description = truncate(tool.summary || tool.description)
  const keywords = [tool.name, tool.category, '在线工具', '免费使用'].filter(Boolean).join(',')

  const seo = {
    title: `${tool.name} - 免费在线使用 | ${siteName}`,
    description,
    keywords,
    canonical,
    robots: 'index,follow',
  }

  const jsonLd = buildJsonLd(
    {
      '@type': 'SoftwareApplication',
      '@id': `${canonical}#tool`,
      name: tool.name,
      description,
      url: canonical,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      inLanguage: 'zh-CN',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
      author: { '@id': personId },
      dateModified: toIsoDateTime(tool.updatedAt),
    },
    [
      { name: '首页', url: `${siteBaseUrl}/` },
      { name: '在线工具', url: `${siteBaseUrl}/tools/` },
      { name: tool.name, url: canonical },
    ],
  )

  const bodyHtml = `        <article>
          <h1>${escapeHtml(tool.name)}</h1>
          ${metaLine([tool.category && `分类：${tool.category}`, tool.updatedAt && `更新于 ${tool.updatedAt}`])}
          ${tool.summary ? `<p class="summary">${escapeHtml(tool.summary)}</p>` : ''}
          ${tool.description ? `<div>${textToHtml(tool.description)}</div>` : ''}
          <p>在浏览器中访问 <a href="${canonical}">${canonical}</a> 即可免费在线使用该工具。</p>
        </article>`

  return renderPage(template, {
    seo,
    jsonLd,
    crumbs: breadcrumbHtml('在线工具', '/tools/', tool.name),
    bodyHtml,
  })
}

/* ---------- 项目 ---------- */

export const buildProjectPage = (template, project) => {
  const canonical = `${siteBaseUrl}/projects/${project.slug}/`
  const description = truncate(project.summary || project.description)
  const techStack = Array.isArray(project.techStack) ? project.techStack : []

  const seo = {
    title: `${project.name} | 项目 | ${siteBrand}`,
    description,
    keywords: [project.name, project.type, ...techStack].filter(Boolean).join(','),
    canonical,
    robots: 'index,follow',
  }

  const jsonLd = buildJsonLd(
    {
      '@type': 'CreativeWork',
      '@id': `${canonical}#project`,
      name: project.name,
      description,
      url: canonical,
      inLanguage: 'zh-CN',
      author: { '@id': personId },
      ...(techStack.length ? { keywords: techStack.join(',') } : {}),
      ...(project.repoUrl ? { sameAs: project.repoUrl } : {}),
      dateModified: toIsoDateTime(project.updatedAt),
    },
    [
      { name: '首页', url: `${siteBaseUrl}/` },
      { name: '项目索引', url: `${siteBaseUrl}/projects/` },
      { name: project.name, url: canonical },
    ],
  )

  const links = [
    project.demoUrl ? `<li><a href="${escapeHtml(project.demoUrl)}">在线体验</a></li>` : '',
    project.repoUrl ? `<li><a href="${escapeHtml(project.repoUrl)}">GitHub 仓库</a></li>` : '',
  ]
    .filter(Boolean)
    .join('')

  const bodyHtml = `        <article>
          <h1>${escapeHtml(project.name)}</h1>
          ${metaLine([
            project.type,
            project.statusText,
            project.updatedAt && `更新于 ${project.updatedAt}`,
          ])}
          ${
            project.cover
              ? `<p><img src="${escapeHtml(absoluteUrl(project.cover, siteBaseUrl))}" alt="${escapeHtml(
                  project.name,
                )}" width="1200" height="630" /></p>`
              : ''
          }
          ${project.summary ? `<p class="summary">${escapeHtml(project.summary)}</p>` : ''}
          ${project.description ? `<div>${textToHtml(project.description)}</div>` : ''}
          ${
            techStack.length
              ? `          <section><h2>核心技术</h2><ul>${techStack
                  .map((tech) => `<li>${escapeHtml(tech)}</li>`)
                  .join('')}</ul></section>`
              : ''
          }
          ${links ? `          <section><h2>相关链接</h2><ul>${links}</ul></section>` : ''}
        </article>`

  return renderPage(template, {
    seo,
    jsonLd,
    crumbs: breadcrumbHtml('项目索引', '/projects/', project.name),
    bodyHtml,
  })
}

/* ---------- llms-full.txt ---------- */

const plainText = (value) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()

export const buildLlmsFullTxt = ({ articles = [], errors = [], tools = [], projects = [] }) => {
  const lines = []

  lines.push('# 希燃呀开发者平台 — 全站内容索引')
  lines.push('')
  lines.push(
    '> 本文件在构建时自动生成，汇总站点全部公开内容（文章、错误解决方案、工具、项目），供 AI 助手与搜索引擎检索引用。站点首页：https://xiranya.cn/',
  )
  lines.push('')

  lines.push('## 技术文章')
  lines.push('')
  for (const article of articles) {
    if (!article?.slug) continue
    lines.push(`### ${article.title}`)
    lines.push(`- 链接：${siteBaseUrl}/articles/${article.slug}/`)
    const meta = [
      article.category,
      article.author && `作者：${article.author}`,
      article.publishedAt && `发布于 ${article.publishedAt}`,
    ]
      .filter(Boolean)
      .join(' | ')
    if (meta) lines.push(`- 信息：${meta}`)
    if (article.tags?.length) lines.push(`- 标签：${article.tags.join('、')}`)
    if (article.summary) lines.push(`- 摘要：${article.summary}`)
    lines.push('')
    const body = stripHtml(article.htmlContent)
    if (body) {
      lines.push(body)
      lines.push('')
    }
  }

  lines.push('## 错误解决方案')
  lines.push('')
  for (const error of errors) {
    if (!error?.slug) continue
    const href = error.href || `/errors/${error.category}/${error.slug}`
    lines.push(`### ${error.title}`)
    lines.push(`- 链接：${siteBaseUrl}${href.replace(/\/+$/, '')}/`)
    if (error.category) lines.push(`- 分类：${error.category}`)
    if (error.summary) lines.push(`- 摘要：${error.summary}`)
    lines.push('')
    const fields = [
      ['错误原文', error.original],
      ['产生原因', error.cause],
      ['常见场景', error.scenario],
      ['错误示例', error.wrongExample],
      ['正确示例', error.correctExample],
      ['解决方案', error.solution],
      ['验证命令', error.verifyCommand],
      ['常见误区', error.misunderstanding],
    ]
    for (const [label, value] of fields) {
      if (!value) continue
      lines.push(`**${label}**`)
      lines.push('')
      lines.push(plainText(value))
      lines.push('')
    }
  }

  lines.push('## 在线工具')
  lines.push('')
  for (const tool of tools) {
    if (!tool?.slug) continue
    lines.push(`### ${tool.name}`)
    lines.push(`- 链接：${siteBaseUrl}/tools/${tool.slug}/`)
    if (tool.summary) lines.push(`- 简介：${tool.summary}`)
    if (tool.description) lines.push(`- 说明：${plainText(tool.description)}`)
    lines.push('')
  }

  lines.push('## 项目')
  lines.push('')
  for (const project of projects) {
    if (!project?.slug) continue
    lines.push(`### ${project.name}`)
    lines.push(`- 链接：${siteBaseUrl}/projects/${project.slug}/`)
    if (project.summary) lines.push(`- 简介：${project.summary}`)
    if (project.techStack?.length) lines.push(`- 技术栈：${project.techStack.join('、')}`)
    if (project.demoUrl) lines.push(`- 在线体验：${project.demoUrl}`)
    if (project.repoUrl) lines.push(`- 仓库：${project.repoUrl}`)
    lines.push('')
  }

  lines.push('---')
  lines.push(`本文件由 ${siteName} 构建流程自动生成。更新时间与内容以站点实际发布为准。`)

  return `${lines.join('\n')}\n`
}
