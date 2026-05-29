# Xiran IndexPage

一个基于 Vue 3 + Vite 构建的个人数字主页。它收录在线工具、技术博客、开源主页，以及持续迭代中的技术方向。

## 在线预览

[http://xiranya.cn/](http://xiranya.cn/)

## 当前内容

- C-Sandbox 在线编译环境
- Halo 技术博客
- Gitee 开源主页
- 技术方向与学习原则展示
- Vue Router 站内导航：首页、项目、关于、站内 404
- 独立的 404/失效页面

## 本地运行

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

## 项目结构

```text
src/
├── assets/      # 全局样式
├── router/      # Vue Router 路由
├── stores/      # 站点数据与筛选状态
├── views/       # 页面视图
├── App.vue      # 站点外壳
└── main.js      # 应用入口

404.html         # 静态 404/失效页面
```

## 设计方向

整体风格偏向克制的数字实验室：清晰入口、网格背景、状态面板、项目卡片和响应式布局。文案与视觉都围绕“探索底层逻辑，用代码重构世界”展开。
