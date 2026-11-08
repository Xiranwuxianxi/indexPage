import sanitizeHtml from 'sanitize-html'

/**
 * 构建期 SEO HTML 处理工具
 *
 * 由 write-seo-pages.mjs（静态路由页）与 prerender-content.mjs（动态详情页）共用，
 * 保证两路输出的 meta 处理方式一致。
 */

export const escapeAttribute = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

export const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

/** Only allow a small set of semantic article markup in build-time HTML. */
export const sanitizeArticleHtml = (value) =>
  sanitizeHtml(String(value ?? ''), {
    allowedTags: [
      'a',
      'b',
      'blockquote',
      'br',
      'code',
      'del',
      'div',
      'em',
      'h2',
      'h3',
      'h4',
      'hr',
      'i',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      's',
      'strong',
      'table',
      'tbody',
      'td',
      'th',
      'thead',
      'tr',
      'u',
      'ul',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      code: ['class'],
      pre: ['class'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
  })

export const updateMeta = (html, selector, value) => {
  const escaped = escapeAttribute(value)
  const attributeName = selector.kind === 'name' ? 'name' : 'property'
  const pattern = new RegExp(`<meta(?=[^>]*${attributeName}="${selector.key}")[^>]*>`, 'i')
  const replacement = `<meta ${attributeName}="${selector.key}" content="${escaped}" />`

  return html.replace(pattern, replacement)
}

export const updatePageHtml = (template, seo) => {
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

  return html
}

/** 替换 #site-jsonld 脚本中的结构化数据 */
export const setJsonLd = (html, jsonLd) =>
  html.replace(
    /<script\s+id="site-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="site-jsonld" type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`,
  )

/** 修改 og:type（详情页用 article / website） */
export const setOgType = (html, type) =>
  html.replace(
    /<meta(?=[^>]*property="og:type")[^>]*>/i,
    `<meta property="og:type" content="${escapeAttribute(type)}" />`,
  )

/** HTML 转纯文本（用于生成摘要、JSON-LD 文本字段） */
export const stripHtml = (html) =>
  String(html ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

export const truncate = (text, max = 160) => {
  const value = String(text ?? '').trim()
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

/** 纯文本（可含换行）转段落 HTML */
export const textToHtml = (text) =>
  String(text ?? '')
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br />')}</p>`)
    .join('\n')

/** 后端时间字符串（yyyy-MM-dd HH:mm:ss，GMT+8）转 ISO 8601 */
export const toIsoDateTime = (value) => {
  if (!value) {
    return undefined
  }
  const normalized = String(value).trim().replace(' ', 'T')
  return normalized.includes('+') ? normalized : `${normalized}+08:00`
}

/** 相对路径转绝对 URL */
export const absoluteUrl = (url, siteBaseUrl) => {
  if (!url) {
    return undefined
  }
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  return `${siteBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}
