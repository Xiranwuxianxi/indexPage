import { createRouter, createWebHistory } from 'vue-router'

import { applyRouteSeo } from '../utils/seo'

const siteUrl = 'http://xiranya.cn'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: '希燃呐 | 数字研发实验场',
        description:
          '希燃呐的个人数字主页，收录 C-Sandbox 在线编译、日记空间、技术博客、开源项目和持续生长的研发实验。',
        canonical: `${siteUrl}/`,
      },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: {
        title: '项目索引 | 希燃呐',
        description: '集中浏览希燃呐的在线工具、日记空间、技术博客和开源项目入口，按类型快速筛选。',
        canonical: `${siteUrl}/projects`,
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: '关于这个空间 | 希燃呐',
        description:
          '了解希燃呐数字研发实验场的建设方向：工具、文章、开源项目和持续记录的技术实践。',
        canonical: `${siteUrl}/about`,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: '页面未找到 | 希燃呐',
        description: '当前站内路径没有匹配到页面，可以回到首页或项目索引继续浏览。',
        canonical: `${siteUrl}/`,
        robots: 'noindex,follow',
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  applyRouteSeo(to.meta)
})

export default router
