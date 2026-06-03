# Xiran IndexPage

一个基于 Vue 3 + Vite 构建的个人数字主页。它收录在线工具、日记空间、技术博客、开源主页，以及持续迭代中的技术方向。

## 在线预览

[http://xiranya.cn/](http://xiranya.cn/)

## 当前内容

- C-Sandbox 在线编译环境
- 日记空间：用于写日记、记录想法与生活片段
- Halo 技术博客
- Gitee 开源主页
- GitHub、B 站、抖音个人平台入口
- 技术方向与学习原则展示
- Vue Router 站内导航：首页、项目、关于、站内 404
- 独立的 404/失效页面
- 基础 SEO：标题、描述、关键词、Canonical、Open Graph、Twitter Card、结构化数据、sameAs、robots.txt、sitemap.xml

## 本地运行

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

构建产物会输出到 `dist/`。`index.html` 中的基础 SEO 信息会被 Vite 带进构建结果；`public/robots.txt` 和 `public/sitemap.xml` 也会被复制到 `dist/` 根目录。

## 项目结构

```text
src/
├── assets/      # 全局样式
├── router/      # Vue Router 路由与页面 SEO 元信息
├── stores/      # 站点数据与筛选状态
├── utils/       # SEO 等工具函数
├── views/       # 页面视图
├── App.vue      # 站点外壳
└── main.js      # 应用入口

public/
├── robots.txt   # 搜索引擎抓取规则
└── sitemap.xml  # 站点地图

404.html         # 静态 404/失效页面
```

## SEO 说明

这个项目是 Vue SPA。当前实现做了两层 SEO：

- 构建后静态可见：`index.html` 内的 title、description、keywords、canonical、Open Graph、Twitter Card 和 JSON-LD。
- 运行时更新：进入 `/projects`、`/about` 等路由后，`src/router/index.js` 会调用 `src/utils/seo.js` 更新页面标题和描述。

如果需要让每个路由在“不执行 JavaScript”的情况下也拥有独立 HTML，需要继续引入 SSR、SSG 或预渲染方案。详细说明见 [Vue 项目 SEO 指南](docs/seo-guide.md)。

## 设计方向

整体风格偏向克制的数字实验室：清晰入口、网格背景、状态面板、项目卡片和响应式布局。文案与视觉都围绕“探索底层逻辑，用代码重构世界”展开。
