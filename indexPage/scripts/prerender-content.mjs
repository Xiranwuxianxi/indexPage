/**
 * 构建后动态详情页预渲染（postbuild 第二步）
 *
 * 从后端公开 API 拉取已发布的文章 / 错误方案 / 工具 / 项目，
 * 为每个条目生成 dist/<section>/<slug>/index.html（含完整正文与独立 SEO），
 * 同时生成 dist/llms-full.txt 供 AI 助手检索。
 *
 * - API 不可达时优雅降级：跳过动态页，仅输出静态 llms-full.txt，构建不失败。
 * - 客户端 Vue 挂载时会替换 #app 内容，不影响 SPA 正常运行。
 * - 可用 PRERENDER_API_BASE 覆盖后端地址，默认 http://127.0.0.1:8080。
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fetchAllRecords, getContentApiBase } from './content-api.mjs'
import {
  buildArticlePage,
  buildErrorPage,
  buildLlmsFullTxt,
  buildProjectPage,
  buildToolPage,
} from './content-pages.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = process.argv[2]
  ? path.resolve(rootDir, process.argv[2])
  : path.join(rootDir, 'dist')

const template = await readFile(path.join(distDir, 'index.html'), 'utf8')

console.log(`[seo] 预渲染内容源：${getContentApiBase()}`)

const [articles, errors, tools, projects] = await Promise.all([
  fetchAllRecords('/api/v1/articles'),
  fetchAllRecords('/api/v1/errors'),
  fetchAllRecords('/api/v1/tools'),
  fetchAllRecords('/api/v1/projects'),
])

/** 路由路径只允许安全字符，防止 API 返回的 slug 写出 dist 目录之外 */
const safeRoutePath = (value) => {
  const normalized = String(value ?? '').replace(/^\/+|\/+$/g, '')
  return /^[a-zA-Z0-9\-_/]+$/.test(normalized) ? normalized : null
}

const writePage = async (routePath, html) => {
  const dir = path.join(distDir, routePath)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html, 'utf8')
}

let written = 0
const writeItem = async (routePath, html) => {
  if (!routePath) {
    return
  }
  await writePage(routePath, html)
  written += 1
}

for (const article of articles) {
  const safe = article?.slug ? safeRoutePath(article.slug) : null
  await writeItem(safe ? `articles/${safe}` : null, buildArticlePage(template, article))
}

for (const error of errors) {
  const href = error?.href || `errors/${error?.category}/${error?.slug}`
  await writeItem(safeRoutePath(href), buildErrorPage(template, error))
}

for (const tool of tools) {
  const safe = tool?.slug ? safeRoutePath(tool.slug) : null
  await writeItem(safe ? `tools/${safe}` : null, buildToolPage(template, tool))
}

for (const project of projects) {
  const safe = project?.slug ? safeRoutePath(project.slug) : null
  await writeItem(safe ? `projects/${safe}` : null, buildProjectPage(template, project))
}

await writeFile(
  path.join(distDir, 'llms-full.txt'),
  buildLlmsFullTxt({ articles, errors, tools, projects }),
  'utf8',
)

console.log(
  `[seo] 动态详情页预渲染完成：文章 ${articles.length}、错误 ${errors.length}、工具 ${tools.length}、项目 ${projects.length}；写入 ${written} 个页面与 llms-full.txt`,
)
