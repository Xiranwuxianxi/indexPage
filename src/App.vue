<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { useSiteStore } from './stores/site'

const route = useRoute()
const site = useSiteStore()
const { socialLinks } = storeToRefs(site)

const navItems = [
  { label: '首页', to: '/' },
  { label: '项目', to: '/projects' },
  { label: '关于', to: '/about' },
]

const shellClass = computed(() => ({
  'is-error-page': route.name === 'not-found',
}))
</script>

<template>
  <div class="site-shell" :class="shellClass">
    <header class="topbar" aria-label="站点导航">
      <RouterLink class="brand" to="/" aria-label="回到首页">
        <span class="brand-mark">希</span>
        <span class="brand-copy">
          <strong>希燃呐</strong>
          <small>Digital Lab</small>
        </span>
      </RouterLink>

      <nav class="nav-links" aria-label="主导航">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>

    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="currentRoute.fullPath" />
      </Transition>
    </RouterView>

    <footer class="site-footer">
      <span>更多硬核模块与奇思妙想正在孵化中</span>
      <div class="footer-links" aria-label="个人平台">
        <a
          v-for="link in socialLinks"
          :key="link.id"
          :href="link.href"
          target="_blank"
          rel="me noopener noreferrer"
        >
          {{ link.label }}
        </a>
      </div>
    </footer>
  </div>
</template>
