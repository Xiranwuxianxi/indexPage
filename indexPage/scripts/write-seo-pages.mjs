import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildStructuredData, routeSeoMap } from '../src/config/seo.js'
import { setJsonLd, updatePageHtml } from './seo-html-utils.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = process.argv[2]
  ? path.resolve(rootDir, process.argv[2])
  : path.join(rootDir, 'dist')
const indexPath = path.join(distDir, 'index.html')

const withStructuredData = (template, seo) =>
  setJsonLd(template, buildStructuredData(seo))

const updateSeoPage = (template, seo) => withStructuredData(updatePageHtml(template, seo), seo)

const writeRoutePage = async (routePath, seo, template) => {
  const routeDir = path.join(distDir, routePath)

  await mkdir(routeDir, { recursive: true })
  await writeFile(path.join(routeDir, 'index.html'), updateSeoPage(template, seo), 'utf8')
}

const template = await readFile(indexPath, 'utf8')

// 为 routeSeoMap 中的每条路由生成独立静态 HTML
// home 覆盖 dist/index.html；notFound 输出到 404.html；其他输出到子目录
for (const [key, seo] of Object.entries(routeSeoMap)) {
  if (key === 'home') {
    await writeFile(indexPath, updateSeoPage(template, seo), 'utf8')
  } else if (key === 'notFound') {
    await writeFile(
      path.join(distDir, '404.html'),
      updateSeoPage(template, seo),
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
