/* global AbortSignal: readonly */

/**
 * 构建期内容 API 拉取工具
 *
 * 在服务器上执行 npm run build 时，从本机后端拉取已发布内容，
 * 供 sitemap 生成（prebuild）与详情页预渲染（postbuild）使用。
 * API 不可达时打印警告并返回空列表，构建不会失败（优雅降级）。
 *
 * 可用环境变量 PRERENDER_API_BASE 覆盖后端地址，默认 http://127.0.0.1:8080。
 */

const apiBase = (process.env.PRERENDER_API_BASE || 'http://127.0.0.1:8080').replace(/\/+$/, '')

export const getContentApiBase = () => apiBase

/**
 * 分页拉取某个公开列表接口的全部记录。
 * 后端统一返回 { code, data: { records, pages, ... } }，且仅包含已发布内容。
 */
export const fetchAllRecords = async (
  endpoint,
  { pageSize = 200, maxPages = 50, timeoutMs = 8000 } = {},
) => {
  const records = []

  try {
    for (let page = 1; page <= maxPages; page += 1) {
      const url = `${apiBase}${endpoint}?page=${page}&size=${pageSize}`
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const payload = await response.json()
      const data = payload?.data
      const pageRecords = Array.isArray(data?.records) ? data.records : []

      records.push(...pageRecords)

      const totalPages = Number(data?.pages) || 0
      if (pageRecords.length < pageSize || (totalPages > 0 && page >= totalPages)) {
        break
      }
    }
  } catch (error) {
    console.warn(`[seo] 内容 API 不可达（${endpoint}），跳过该动态内容：${error.message}`)
    return []
  }

  return records
}
