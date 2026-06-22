# AGENTS.md

本文件面向 AI 编码助手。如果你要修改、扩展或维护这个项目，请先阅读本文档，了解项目结构、构建流程和约定。

---

## 项目概述

**希燃呐数字研发实验场**（项目名 `indexpage`）是一个基于 **Vue 3 + Vite** 的中文个人主页/数字门户站点，部署在 `http://xiranya.cn/`。

站点聚合了作者的多个数字入口：C-Sandbox 在线 C 语言编译、日记空间、Halo 技术博客、Gitee/GitHub 开源主页，以及 B 站、抖音等社交媒体链接。

项目定位是**精致的个人展示型 SPA**，采用数据驱动的方式组织内容，并针对搜索引擎做了多层 SEO 处理。

---

## 技术栈

| 类别 | 技术/工具 | 说明 |
|------|-----------|------|
| 前端框架 | Vue `^3.5.30` | 使用 `<script setup>` 语法，组合式 API |
| 路由 | Vue Router `^5.1.0` | `createWebHistory` 模式 |
| 状态管理 | Pinia `^3.0.4` | 站点数据、筛选状态集中在 `src/stores/site.js` |
| 构建工具 | Vite `^7.3.1` | 开发服务器、生产打包 |
| Vue 插件 | `@vitejs/plugin-vue` | 编译 `.vue` 单文件组件 |
| 开发工具 | `vite-plugin-vue-devtools` | 浏览器 Vue DevTools 增强 |
| 代码格式化 | Prettier `3.8.1` | 无 ESLint，无 TypeScript |
| 运行时 | Node.js `^20.19.0 \|\| >=22.12.0` | `package.json` 中声明的引擎 |

**注意**：本项目**没有** TypeScript、ESLint、单元测试、E2E 测试或 UI 组件库。所有代码都是原生 JavaScript + Vue SFC。

---

## 构建与开发命令

所有命令都通过 npm 执行：

```bash
# 安装依赖
npm install

# 本地开发，默认启动 Vite 开发服务器
npm run dev

# 生产构建，输出到 dist/
npm run build

# 构建后会自动执行 postbuild 钩子，生成 SEO 静态子页面
# 等价于：vite build && node scripts/write-seo-pages.mjs

# 本地预览生产构建产物
npm run preview

# 使用 Prettier 格式化 src/ 目录
npm run format
```

### 构建产物说明

- `npm run build` 会先执行 `prebuild` 钩子：`npm run sitemap`，调用 `scripts/generate-sitemap.mjs` 生成 `public/sitemap.xml`。
- 随后 `vite build` 生成 `dist/`，包含 `index.html`、打包后的 JS/CSS 资源以及从 `public/` 复制过来的 `robots.txt`、`sitemap.xml`、`favicon.ico`。
- 最后 `postbuild` 钩子执行 `scripts/write-seo-pages.mjs`，基于 `dist/index.html` 模板，根据 `src/config/seo.js` 中的 `routeSeoMap` 自动生成：
  - `dist/index.html`（首页 SEO 内容被覆盖写入）
  - `dist/projects/index.html`
  - `dist/about/index.html`
  - `dist/404.html`
- 如果 `dist/` 目录看起来缺少 `projects/`、`about/` 子目录，说明 `postbuild` 没有执行，应重新运行 `npm run build`。

---

## 代码组织

```text
src/
├── assets/
│   └── main.css              # 全局唯一样式文件，约 1000+ 行，含 CSS 变量、响应式、动画
├── components/
│   └── icons/                # 当前为空，预留图标组件目录
├── config/
│   └── seo.js                # 站点元数据、导航链接、路由 SEO 配置、JSON-LD 结构化数据
├── router/
│   └── index.js              # 4 条路由：home / projects / about / not-found
├── stores/
│   └── site.js               # Pinia store：项目列表、社交平台、技术方向、筛选状态
├── utils/
│   └── seo.js                # 运行时动态更新 <title> / meta / canonical / JSON-LD
├── views/
│   ├── HomeView.vue          # 首页：Hero + 项目卡片 + 技术方向
│   ├── ProjectsView.vue      # 项目索引，支持按类型筛选
│   ├── AboutView.vue         # 关于页面
│   └── NotFoundView.vue      # 站内 404
├── App.vue                   # 站点外壳：顶栏、RouterView、页脚
└── main.js                   # 应用入口：创建 Pinia + Router + 挂载 App + 全局样式

public/
├── favicon.ico
├── robots.txt                # 搜索引擎抓取规则
└── sitemap.xml               # 站点地图（由 scripts/generate-sitemap.mjs 自动生成）

scripts/
└── write-seo-pages.mjs       # 构建后生成 SEO 静态子页面的 Node 脚本

404.html                      # 根目录静态 404，用于部署平台兜底
index.html                    # SPA 入口 HTML，内含完整 SEO meta 和 JSON-LD
```

### 数据驱动模式

视图层主要负责渲染，业务内容集中在两处：

- `src/stores/site.js`：项目、社交平台、技术方向、时间线、筛选状态。
- `src/config/seo.js`：站点品牌、导航链接、各路由 SEO 信息、结构化数据。

修改站点内容时，优先改这两个文件，而不是在视图里硬编码。

---

## 路由与页面

Vue Router 配置在 `src/router/index.js`：

| 路径 | 名称 | 对应视图 | 说明 |
|------|------|----------|------|
| `/` | `home` | `HomeView.vue` | 首页 |
| `/projects`（别名 `/projects/`） | `projects` | `ProjectsView.vue` | 项目索引 |
| `/about`（别名 `/about/`） | `about` | `AboutView.vue` | 关于页面 |
| `/:pathMatch(.*)*` | `not-found` | `NotFoundView.vue` | 站内 404 |

每条路由的 `meta` 字段引用 `src/config/seo.js` 中的 `routeSeoMap`。路由切换后，`router.afterEach` 会调用 `applyRouteSeo()` 更新页面标题和相关 meta 标签。

---

## SEO 与静态生成策略

本项目是 Vue SPA，但针对 SEO 做了三层处理：

### 1. 基础静态 SEO

`index.html` 内置完整的：

- `<title>`、`<meta name="description">`、`<meta name="keywords">`
- `<meta name="author">`、`<meta name="robots">`、`<meta name="theme-color">`
- Open Graph 分享信息
- Twitter Card 分享信息
- JSON-LD 结构化数据（Schema.org：`Person`、`WebSite`、`WebPage`、`BreadcrumbList`、`ItemList`、`SiteNavigationElement`）

### 2. 运行时 SEO

进入不同路由后，`src/utils/seo.js` 会动态更新：

- `document.title`
- `description`、`keywords`、`robots`
- `og:title`、`og:description`、`og:url`
- `twitter:title`、`twitter:description`
- `link rel="canonical"`
- `script#site-jsonld` 中的 JSON-LD 数据

### 3. 构建后静态页生成

`scripts/write-seo-pages.mjs` 在 `postbuild` 阶段执行，读取 `dist/index.html` 模板，替换 SEO 内容后输出：

- `dist/index.html`
- `dist/projects/index.html`
- `dist/about/index.html`
- `dist/404.html`

这样即使爬虫/社交平台不执行 JavaScript，也能在 `/projects/`、`/about/` 等地址看到独立的 HTML 内容。

### 新增页面时的 SEO 清单

1. 在 `src/config/seo.js` 中添加页面标题、描述、canonical、keywords 和入口信息。
2. 在 `src/router/index.js` 中给新路由引用对应的 SEO 配置（`meta: routeSeoMap.xxx`）。
3. 如果页面是重要公开入口，把它加入 `src/config/seo.js` 的 `siteNavigationLinks` 且 `type` 为 `'router'`；`scripts/generate-sitemap.mjs` 会在构建时自动生成到 `public/sitemap.xml`。
4. 如果页面不希望被索引，设置 `robots: 'noindex,follow'` 且不要把它放进 `siteNavigationLinks`（或将其 `type` 设为 `'external'`）。
5. 如果希望构建后生成独立静态 HTML，在 `scripts/write-seo-pages.mjs` 中新增 `writeRoutePage(...)` 调用。

---

## 代码风格指南

### 格式化

- 使用 Prettier 统一格式化。
- 配置见 `.prettierrc.json`：
  - `semi: false`（省略分号）
  - `singleQuote: true`（单引号）
  - `printWidth: 100`
- 提交前建议运行 `npm run format`。

### VS Code 推荐

`.vscode/extensions.json` 推荐安装：

- `Vue.volar`（Vue 官方语言支持）
- `esbenp.prettier-vscode`（Prettier 插件）

`.vscode/settings.json` 中已开启保存时自动格式化。

### JavaScript / Vue 约定

- 不使用 TypeScript，所有文件是 `.js` 和 `.vue`。
- Vue 组件使用 `<script setup>` 组合式 API。
- 字符串使用单引号，语句末尾不加分号。
- 路径别名 `@/` 映射到 `./src`，在 `vite.config.js` 和 `jsconfig.json` 中配置。
- 外部链接统一使用 `target="_blank"`，并视情况添加 `rel="noreferrer"` 或 `rel="me noopener noreferrer"`。

### CSS 约定

- 全局样式集中在 `src/assets/main.css`，使用 CSS 变量定义设计令牌。
- 不使用 CSS 预处理器（Sass/Less 等）。
- 视觉风格：数字实验室感、网格背景、玻璃拟态、响应式布局。
- 无障碍：视图已使用 `aria-label`、`aria-labelledby`、`aria-live` 等属性。

---

## 测试说明

**本项目目前没有测试框架和测试文件。**

没有安装 Vitest、Jest、Cypress、Playwright 或 `@vue/test-utils`。`.gitignore` 中虽然预留了 `coverage`、`__screenshots__`、`/cypress/videos/` 等目录，但实际没有任何测试代码。

如果你需要新增测试，请先与维护者确认方案，再引入对应依赖。

---

## 部署流程

通过 `.github/workflows/deploy.yml` 自动部署到私有服务器：

- **触发条件**：`main` 分支发生 `push`
- **Runner**：`ubuntu-latest`，Node.js 22
- **流程**：
  1. `actions/checkout@v4` 检出代码
  2. `actions/setup-node@v4` 设置 Node.js 22
  3. `npm ci` 安装依赖
  4. `npm run build` 构建（含 `postbuild` 静态页生成）
  5. 配置 SSH 私钥并添加服务器到 `known_hosts`
  6. `rsync -avz dist/ <user>@<host>:<deploy_path>/` 同步到服务器

### 部署 Secrets

以下 Secrets 需要在 GitHub 仓库中配置：

- `DEPLOY_KEY`：SSH 私钥
- `DEPLOY_HOST`：服务器地址
- `DEPLOY_PORT`：SSH 端口
- `DEPLOY_USER`：SSH 用户名
- `DEPLOY_PATH`：服务器上的部署目录

**注意**：工作流中没有使用 `--delete` 参数，因此服务器上已有的旧文件不会被自动删除。如果希望严格同步，需要评估风险后再添加该参数。

---

## 安全注意事项

1. **部署密钥**：`DEPLOY_KEY` 是服务器 SSH 私钥，不要在代码中泄露，也不要在日志中打印。
2. **外部链接安全**：所有 `target="_blank"` 的外部链接应配合 `rel="noopener noreferrer"`，避免标签页通过 `window.opener` 操纵原页面。社交平台/身份认证链接可额外使用 `rel="me"`。
3. **用户输入**：本项目目前没有表单或用户输入功能，如果未来添加，必须做 XSS 过滤和校验。
4. **依赖安全**：定期检查 `npm audit`，及时升级 Vue、Vite 等核心依赖。
5. **robots 与 noindex**：404 和错误页应使用 `noindex,follow`，避免被搜索引擎收录。
6. **构建产物**：`dist/` 和 `dist-seo-check/` 是构建输出，已加入 `.gitignore`，不要提交到仓库。

---

## 常见任务速查

### 添加一个新页面

1. 在 `src/config/seo.js` 的 `routeSeoMap` 中添加页面 SEO 配置。
2. 在 `src/views/` 下创建新的 `.vue` 视图组件。
3. 在 `src/router/index.js` 中添加路由，并设置 `meta: routeSeoMap.xxx`。
4. 独立静态 HTML 会自动生成：`scripts/write-seo-pages.mjs` 会遍历 `routeSeoMap` 中的所有路由，无需手动添加 `writeRoutePage` 调用。
5. 如果页面是公开入口，在 `src/config/seo.js` 的 `siteNavigationLinks` 中添加一条 `type: 'router'` 记录，`prebuild` 阶段会自动生成到 `public/sitemap.xml`。

### 修改站点导航

编辑 `src/config/seo.js` 中的 `siteNavigationLinks` 数组。`type: 'router'` 表示站内路由（使用 `RouterLink`），`type: 'external'` 表示外部链接（使用 `<a>`）。

### 修改项目/社交平台/技术方向内容

编辑 `src/stores/site.js` 中的 `state`，视图会自动响应。

### 修改全局样式

编辑 `src/assets/main.css`。该文件由 `src/main.js` 全局引入。

---

## 参考文档

- `README.md`：项目简介、本地运行、生产构建、项目结构、SEO 说明。
- `docs/seo-guide.md`：更详细的 Vue SPA SEO 指南、新增页面检查清单、发布前检查清单。
- `vite.config.js`：Vite 配置、路径别名。
- `.prettierrc.json`：Prettier 格式化规则。
