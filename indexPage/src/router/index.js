import { createRouter, createWebHistory } from 'vue-router'

import { routeSeoMap } from '../config/seo'
import { applyRouteSeo } from '../utils/seo'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: routeSeoMap.home,
    },
    {
      path: '/tools',
      alias: '/tools/',
      name: 'tools',
      component: () => import('../views/tools/ToolsIndexView.vue'),
      meta: routeSeoMap.tools,
    },
    {
      path: '/tools/:slug',
      name: 'tool-detail',
      component: () => import('../views/tools/ToolDetailView.vue'),
      meta: routeSeoMap.tools,
    },
    {
      path: '/errors',
      alias: '/errors/',
      name: 'errors',
      component: () => import('../views/errors/ErrorsIndexView.vue'),
      meta: routeSeoMap.errors,
    },
    {
      path: '/errors/:category/:slug',
      name: 'error-detail',
      component: () => import('../views/errors/ErrorDetailView.vue'),
      meta: routeSeoMap.errors,
    },
    {
      path: '/articles',
      alias: '/articles/',
      name: 'articles',
      component: () => import('../views/articles/ArticlesIndexView.vue'),
      meta: routeSeoMap.articles,
    },
    {
      path: '/articles/:slug',
      name: 'article-detail',
      component: () => import('../views/articles/ArticleDetailView.vue'),
      meta: routeSeoMap.articles,
    },
    {
      path: '/tutorials',
      alias: '/tutorials/',
      name: 'tutorials',
      component: () => import('../views/tutorials/TutorialsIndexView.vue'),
      meta: routeSeoMap.tutorials,
    },
    {
      path: '/tutorials/:category',
      name: 'tutorial-category',
      component: () => import('../views/tutorials/TutorialsIndexView.vue'),
      meta: routeSeoMap.tutorials,
    },
    {
      path: '/projects',
      alias: '/projects/',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: routeSeoMap.projects,
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: () => import('../views/projects/ProjectDetailView.vue'),
      meta: routeSeoMap.projects,
    },
    {
      path: '/about',
      alias: '/about/',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: routeSeoMap.about,
    },
    {
      path: '/search',
      alias: '/search/',
      name: 'search',
      component: () => import('../views/search/SearchView.vue'),
      meta: routeSeoMap.search,
    },
    {
      path: '/login',
      alias: '/login/',
      name: 'login',
      component: () => import('../views/login/LoginView.vue'),
      meta: routeSeoMap.login,
    },
    {
      path: '/register',
      alias: '/register/',
      name: 'register',
      component: () => import('../views/login/RegisterView.vue'),
      meta: routeSeoMap.register,
    },
    {
      path: '/user',
      alias: '/user/',
      name: 'user',
      component: () => import('../views/user/UserLayout.vue'),
      meta: routeSeoMap.user,
      redirect: '/user/bookmarks',
      children: [
        {
          path: 'bookmarks',
          name: 'user-bookmarks',
          component: () => import('../views/user/BookmarksView.vue'),
        },
        {
          path: 'history',
          name: 'user-history',
          component: () => import('../views/user/HistoryView.vue'),
        },
        {
          path: 'saved-configs',
          name: 'user-saved-configs',
          component: () => import('../views/user/SavedConfigsView.vue'),
        },
        {
          path: 'settings',
          name: 'user-settings',
          component: () => import('../views/user/SettingsView.vue'),
        },
      ],
    },
    {
      path: '/admin',
      alias: '/admin/',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: routeSeoMap.admin,
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/DashboardView.vue'),
        },
        {
          path: 'articles',
          name: 'admin-articles',
          component: () => import('../views/admin/ArticlesManageView.vue'),
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('../views/admin/ProjectsManageView.vue'),
        },
        {
          path: 'tools',
          name: 'admin-tools',
          component: () => import('../views/admin/ToolsManageView.vue'),
        },
        {
          path: 'errors',
          name: 'admin-errors',
          component: () => import('../views/admin/ErrorsManageView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: routeSeoMap.notFound,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 受保护页面：若本地有 token 但用户信息尚未加载，先拉取资料再判断，
  // 避免刷新 /user、/admin 页面时被误判为未登录。
  if (
    (to.path.startsWith('/user') || to.path.startsWith('/admin')) &&
    userStore.token &&
    !userStore.user
  ) {
    await userStore.fetchProfile()
  }

  // 用户中心需要登录
  if (to.path.startsWith('/user')) {
    if (!userStore.isLoggedIn) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath },
        replace: true,
      })
    }
    return next()
  }

  // 管理后台需要 ADMIN / EDITOR 角色
  if (to.path.startsWith('/admin')) {
    if (!userStore.isLoggedIn) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath },
        replace: true,
      })
    }
    if (!userStore.isAdmin && !userStore.isEditor) {
      return next({ name: 'home', replace: true })
    }
    return next()
  }

  // 公开页面直接放行
  next()
})

router.afterEach((to) => {
  applyRouteSeo(to.meta)
})

export default router
