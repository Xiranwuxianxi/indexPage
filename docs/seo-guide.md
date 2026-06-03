# Vue 项目 SEO 指南

这份文档说明本项目如何做 SEO，也给想复用这个开源项目的人一套可落地的检查清单。

## 先理解 Vue SPA 的 SEO 边界

普通 Vue + Vite 项目默认是 SPA，也就是打包后主要输出一个 `index.html` 和一组 JS/CSS 资源。

这意味着：

- `index.html` 里的 `title`、`description`、Open Graph、结构化数据等内容，打包后会直接存在。
- 用户进入不同 Vue Router 路由时，页面标题和描述可以通过 JavaScript 动态更新。
- 但如果爬虫、社交平台或机器人不执行 JavaScript，它看到的通常还是同一份 `index.html`。

所以 SPA 可以做基础 SEO，但如果你希望 `/projects`、`/about`、`/blog/xxx` 每个地址都有独立 HTML，应该考虑 SSR、SSG 或预渲染。

## 本项目已经做了什么

### 1. 静态基础 SEO

文件：`index.html`

这里放的是构建后立刻可见的全站 SEO 信息：

- `<title>`
- `<meta name="description">`
- `<meta name="keywords">`
- `<meta name="author">`
- `<meta name="robots">`
- `<link rel="canonical">`
- Open Graph 分享信息
- Twitter Card 分享信息
- JSON-LD 结构化数据
- JSON-LD `sameAs` 身份关联链接，比如 GitHub、B 站、抖音

这些内容在执行 `npm run build` 后会进入 `dist/index.html`。

### 2. 路由级 SEO

文件：

- `src/router/index.js`
- `src/utils/seo.js`

每个路由在 `meta` 中配置自己的标题、描述和 canonical：

```js
{
  path: '/projects',
  name: 'projects',
  meta: {
    title: '项目索引 | 希燃呐',
    description: '集中浏览希燃呐的在线工具、日记空间、技术博客和开源项目入口。',
    canonical: 'http://xiranya.cn/projects',
  },
}
```

路由切换后，`router.afterEach` 会调用 `applyRouteSeo`，更新浏览器里的标题和相关 meta 标签。

### 3. robots.txt

文件：`public/robots.txt`

它告诉搜索引擎哪些页面可以抓取，并声明 sitemap 地址。

### 4. sitemap.xml

文件：`public/sitemap.xml`

它列出希望搜索引擎发现的重要 URL，比如首页、项目页、关于页、C-Sandbox 和日记空间。

## 新增页面时要做什么

1. 在 `src/router/index.js` 给路由添加 `meta.title`、`meta.description` 和 `meta.canonical`。
2. 如果页面是重要公开入口，把 URL 加进 `public/sitemap.xml`。
3. 如果页面不应该被索引，比如后台、登录页、错误页，设置 `noindex` 或不要放进 sitemap。
4. 页面正文里要有清晰的标题、真实内容和可访问链接，不要只堆关键词。

## 如果要做更强 SEO

SPA 的基础 SEO 适合个人主页、项目索引和轻量展示站。如果项目变成文章站、商品站或大量详情页，建议升级为：

- SSR：服务端为每个请求返回完整 HTML。
- SSG：构建时提前生成每个路由的静态 HTML。
- 预渲染：构建后用浏览器渲染路由，再保存为静态 HTML。

这些方案可以让每个 URL 在不执行 JavaScript 时也有自己的标题、描述和正文内容。

## 发布前检查清单

- `npm run build` 能正常通过。
- `dist/index.html` 里有正确的 title 和 description。
- `dist/robots.txt` 存在。
- `dist/sitemap.xml` 存在。
- sitemap 中的 URL 能正常访问。
- 重要页面标题不要重复。
- description 用自然语言概括页面，不要堆关键词。
- 404 页面建议 `noindex`，避免错误页被搜索引擎收录。
