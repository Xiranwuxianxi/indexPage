<script setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { siteNavigationLinks } from './config/seo'
import { useSiteStore } from './stores/site'

const route = useRoute()
const site = useSiteStore()
const { socialLinks } = storeToRefs(site)

const navItems = siteNavigationLinks.filter((link) => link.type === 'router')
const footerSiteLinks = siteNavigationLinks

const shellClass = computed(() => ({
  'is-error-page': route.name === 'not-found',
}))

const shellRef = ref(null)
let rafId = null
let pendingX = 0
let pendingY = 0

const updateCursorGlow = () => {
  if (!shellRef.value) return
  shellRef.value.style.setProperty('--cursor-x', `${pendingX}px`)
  shellRef.value.style.setProperty('--cursor-y', `${pendingY}px`)
  rafId = null
}

const handleMouseMove = (event) => {
  pendingX = event.clientX
  pendingY = event.clientY
  if (rafId) return
  rafId = requestAnimationFrame(updateCursorGlow)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="shellRef" class="site-shell" :class="shellClass">
    <div class="cursor-glow" aria-hidden="true"></div>
    <div class="particle particle-1" aria-hidden="true"></div>
    <div class="particle particle-2" aria-hidden="true"></div>
    <div class="particle particle-3" aria-hidden="true"></div>

    <header class="topbar" aria-label="站点导航">
      <RouterLink class="brand" to="/" aria-label="回到首页">
        <span class="brand-mark">希</span>
        <span class="brand-copy">
          <strong>希燃呐</strong>
          <small>Digital Lab</small>
        </span>
      </RouterLink>

      <nav class="nav-links" aria-label="主导航">
        <RouterLink v-for="item in navItems" :key="item.id" :to="item.href">
          {{ item.navLabel }}
        </RouterLink>
      </nav>
    </header>

    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="currentRoute.fullPath" />
      </Transition>
    </RouterView>

    <footer class="site-footer">
      <div class="footer-copy">
        <strong>希燃呐数字研发实验场</strong>
        <span>工具、日记、博客、开源项目和个人平台入口。</span>
      </div>

      <nav class="footer-nav" aria-label="站点入口">
        <template v-for="link in footerSiteLinks" :key="link.id">
          <RouterLink v-if="link.type === 'router'" :to="link.href">
            {{ link.label }}
          </RouterLink>
          <a v-else :href="link.href" target="_blank" rel="noreferrer">
            {{ link.label }}
          </a>
        </template>
      </nav>

      <div class="footer-links" aria-label="关注平台">
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
