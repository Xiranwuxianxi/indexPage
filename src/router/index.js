import { createRouter, createWebHistory } from 'vue-router'

import { routeSeoMap } from '../config/seo'
import { applyRouteSeo } from '../utils/seo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: routeSeoMap.home,
    },
    {
      path: '/projects',
      alias: '/projects/',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
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

router.afterEach((to) => {
  applyRouteSeo(to.meta)
})

export default router
