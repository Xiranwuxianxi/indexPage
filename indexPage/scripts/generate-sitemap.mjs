import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Readable } from 'node:stream'
import { SitemapStream, streamToPromise } from 'sitemap'

import { routeSeoMap, siteBaseUrl, siteNavigationLinks } from '../src/config/seo.js'
import { fetchAllRecords } from './content-api.mjs'

const now = new Date().toISOString().split('T')[0]

const dateOnly = (value) => (value ? String(value).split(' ')[0] : now)

/* ---------- 静态路由 URL ---------- */

const staticEntries = []
const seenUrls = new Set()
const pushStatic = (url, priority) => {
  if (seenUrls.has(url)) {
    return
  }
  seenUrls.add(url)
  staticEntries.push({ url, lastmod: now, changefreq: 'weekly', priority })
}

siteNavigationLinks
  .filter((link) => link.url.startsWith(siteBaseUrl))
  .forEach((link) => pushStatic(link.url, link.url === `${siteBaseUrl}/` ? 1.0 : 0.8))

// routeSeoMap 中允许收录的静态路由（补充 siteNavigationLinks 未覆盖的，如 /tutorials/）
Object.values(routeSeoMap)
  .filter((seo) => seo.robots?.startsWith('index'))
  .forEach((seo) => pushStatic(seo.canonical, 0.7))

/* ---------- 动态内容 URL（构建期从后端拉取，API 不可达时降级为仅静态） ---------- */

const [articles, errors, tools, projects] = await Promise.all([
  fetchAllRecords('/api/v1/articles'),
  fetchAllRecords('/api/v1/errors'),
  fetchAllRecords('/api/v1/tools'),
  fetchAllRecords('/api/v1/projects'),
])

const dynamicEntries = [
  ...articles
    .filter((a) => a?.slug)
    .map((a) => ({
      url: `${siteBaseUrl}/articles/${a.slug}/`,
      lastmod: dateOnly(a.updatedAt || a.publishedAt),
      changefreq: 'monthly',
      priority: 0.7,
    })),
  ...errors
    .filter((e) => e?.slug)
    .map((e) => ({
      url: `${siteBaseUrl}${(e.href || `/errors/${e.category}/${e.slug}`).replace(/\/+$/, '')}/`,
      lastmod: dateOnly(e.updatedAt),
      changefreq: 'monthly',
      priority: 0.7,
    })),
  ...tools
    .filter((t) => t?.slug)
    .map((t) => ({
      url: `${siteBaseUrl}/tools/${t.slug}/`,
      lastmod: dateOnly(t.updatedAt),
      changefreq: 'monthly',
      priority: 0.8,
    })),
  ...projects
    .filter((p) => p?.slug)
    .map((p) => ({
      url: `${siteBaseUrl}/projects/${p.slug}/`,
      lastmod: dateOnly(p.updatedAt),
      changefreq: 'monthly',
      priority: 0.6,
    })),
]

const sitemapEntries = [...staticEntries, ...dynamicEntries]

/* ---------- 输出 ---------- */

const stream = new SitemapStream({
  hostname: siteBaseUrl,
  lastmodDateOnly: true,
  xmlns: {
    news: false,
    xhtml: false,
    image: false,
    video: false,
  },
})

const xml = await streamToPromise(Readable.from(sitemapEntries).pipe(stream))
const prettyXml = xml
  .toString()
  .replace(/(<\/?urlset[^>]*>)/g, '$1\n')
  .replace(/(<url>)/g, '  $1\n')
  .replace(/(<\/url>)/g, '  $1\n')
  .replace(/(<loc>.*<\/loc>)/g, '    $1\n')
  .replace(/(<lastmod>.*<\/lastmod>)/g, '    $1\n')
  .replace(/(<changefreq>.*<\/changefreq>)/g, '    $1\n')
  .replace(/(<priority>.*<\/priority>)/g, '    $1\n')
  .replace(/\n\n+/g, '\n')

const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml')
writeFileSync(outputPath, prettyXml)

console.log(
  `Sitemap generated with ${sitemapEntries.length} URLs (static ${staticEntries.length}, dynamic ${dynamicEntries.length}): ${outputPath}`,
)
