import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { routeSeoMap, stringifyStructuredData } from '../src/config/seo.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = process.argv[2]
  ? path.resolve(rootDir, process.argv[2])
  : path.join(rootDir, 'dist')
const indexPath = path.join(distDir, 'index.html')

const escapeAttribute = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const updateMeta = (html, selector, value) => {
  const escaped = escapeAttribute(value)
  const attributeName = selector.kind === 'name' ? 'name' : 'property'
  const pattern = new RegExp(`<meta(?=[^>]*${attributeName}="${selector.key}")[^>]*>`, 'i')
  const replacement = `<meta ${attributeName}="${selector.key}" content="${escaped}" />`

  return html.replace(pattern, replacement)
}

const updatePageHtml = (template, seo) => {
  let html = template

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(seo.title)}</title>`)
  html = updateMeta(html, { kind: 'name', key: 'description' }, seo.description)
  html = updateMeta(html, { kind: 'name', key: 'keywords' }, seo.keywords)
  html = updateMeta(html, { kind: 'name', key: 'robots' }, seo.robots)
  html = updateMeta(html, { kind: 'property', key: 'og:title' }, seo.title)
  html = updateMeta(html, { kind: 'property', key: 'og:description' }, seo.description)
  html = updateMeta(html, { kind: 'property', key: 'og:url' }, seo.canonical)
  html = updateMeta(html, { kind: 'name', key: 'twitter:title' }, seo.title)
  html = updateMeta(html, { kind: 'name', key: 'twitter:description' }, seo.description)
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttribute(seo.canonical)}" />`,
  )
  html = html.replace(
    /<script\s+id="site-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="site-jsonld" type="application/ld+json">\n${stringifyStructuredData(seo)}\n    </script>`,
  )

  return html
}

const writeRoutePage = async (routePath, seo, template) => {
  const routeDir = path.join(distDir, routePath)

  await mkdir(routeDir, { recursive: true })
  await writeFile(path.join(routeDir, 'index.html'), updatePageHtml(template, seo), 'utf8')
}

const template = await readFile(indexPath, 'utf8')

// 为 routeSeoMap 中的每条路由生成独立静态 HTML
// home 覆盖 dist/index.html；notFound 输出到 404.html；其他输出到子目录
for (const [key, seo] of Object.entries(routeSeoMap)) {
  if (key === 'home') {
    await writeFile(indexPath, updatePageHtml(template, seo), 'utf8')
  } else if (key === 'notFound') {
    await writeFile(
      path.join(distDir, '404.html'),
      updatePageHtml(template, seo),
      'utf8',
    )
  } else {
    const routePath = seo.canonical.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '')
    if (routePath) {
      await writeRoutePage(routePath, seo, template)
    }
  }
}

console.log('SEO static pages written from routeSeoMap')
