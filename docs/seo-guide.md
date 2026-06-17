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

### 2. 打包后生成路由静态页

文件：

- `scripts/write-seo-pages.mjs`
- `package.json`

本项目在 `npm run build` 后会自动执行 `postbuild`，把首页模板写成多份带独立 SEO 的静态 HTML：

- `dist/index.html`
- `dist/projects/index.html`
- `dist/about/index.html`
- `dist/404.html`

这样即使机器人不执行 JavaScript，也能在 `/projects/`、`/about/` 看到独立的 `title`、`description`、`canonical`、`robots` 和 JSON-LD。

### 3. 路由级 SEO

文件：

- `src/router/index.js`
- `src/utils/seo.js`
- `src/config/seo.js`

每个路由在 `meta` 中配置自己的标题、描述和 canonical：

```js
{
  path: '/projects',
  name: 'projects',
  meta: {
    title: '项目索引 | 希燃呐',
    description: '集中浏览希燃呐的在线工具、日记空间、技术博客和开源项目入口。',
    canonical: 'http://xiranya.cn/projects/',
  },
}
```

路由切换后，`router.afterEach` 会调用 `applyRouteSeo`，更新浏览器里的标题和相关 meta 标签。

### 4. 站点链接信号

搜索结果里主结果下面展开的多条入口，一般叫“站点链接”。它不是某个 meta 标签可以强制写出来的，而是搜索引擎根据站点结构自动生成。

本项目为了提高出现站点链接的概率，做了这些信号：

- 页头主导航保持清晰：首页、项目、关于。
- 页脚提供完整站点入口：首页、项目索引、关于希燃呐、C-Sandbox、日记空间、技术博客。
- JSON-LD 使用 `WebSite`、`WebPage`、`BreadcrumbList`、`ItemList`、`SiteNavigationElement` 描述核心入口。
- sitemap 中列出重要公开页面。
- `/projects/`、`/about/` 打包后有独立静态 HTML。

上线后还需要在搜索引擎站长平台提交 sitemap，并等待重新抓取和重新评估。站点链接展示由搜索引擎决定，代码只能提高概率，不能保证一定出现。

### 5. robots.txt

文件：`public/robots.txt`

它告诉搜索引擎哪些页面可以抓取，并声明 sitemap 地址。

### 6. sitemap.xml

文件：`public/sitemap.xml`（由 `scripts/generate-sitemap.mjs` 在构建时自动生成）

它列出希望搜索引擎发现的重要 URL。脚本会根据 `src/config/seo.js` 中 `type: 'router'` 的 `siteNavigationLinks` 自动生成，默认包含首页、项目索引、关于页。

## 新增页面时要做什么

1. 在 `src/config/seo.js` 给页面添加标题、描述、canonical、keywords 和核心入口信息。
2. 在 `src/router/index.js` 给路由引用对应的 SEO 配置。
3. 如果页面是重要公开入口，在 `src/config/seo.js` 的 `siteNavigationLinks` 中添加一条 `type: 'router'` 记录，构建时会自动生成到 `public/sitemap.xml`。
4. 如果页面不应该被索引，比如后台、登录页、错误页，设置 `noindex` 或不要放进 sitemap。
5. 页面正文里要有清晰的标题、真实内容和可访问链接，不要只堆关键词。
6. 如果希望打包后生成独立静态 HTML，把路由加入 `scripts/write-seo-pages.mjs`。

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
