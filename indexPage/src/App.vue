<script setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { siteNavigationLinks } from './config/seo'
import { useTheme } from './composables/useTheme'
import { useUserStore } from './stores/user'

const route = useRoute()
const userStore = useUserStore()
const { user, isLoggedIn } = storeToRefs(userStore)
const { isDark, toggleTheme } = useTheme()

const navItems = siteNavigationLinks.filter((link) => link.type === 'router')
const footerSiteLinks = siteNavigationLinks

const shellClass = computed(() => ({
  'is-error-page': route.name === 'not-found',
  'is-admin-page': route.path.startsWith('/admin'),
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
  userStore.fetchProfile()
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
          <strong>希燃呀</strong>
          <small>Developer Platform</small>
        </span>
      </RouterLink>

      <nav class="nav-links" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.id"
          :to="item.href"
          :aria-current="route.name === item.id ? 'page' : undefined"
        >
          {{ item.navLabel }}
        </RouterLink>
      </nav>

      <div class="topbar-actions">
        <RouterLink class="search-trigger" to="/search" aria-label="搜索">
          <span aria-hidden="true">🔍</span>
        </RouterLink>

        <button
          class="theme-toggle"
          type="button"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          @click="toggleTheme"
        >
          <span aria-hidden="true">{{ isDark ? '☀️' : '🌙' }}</span>
        </button>

        <template v-if="isLoggedIn">
          <RouterLink class="user-avatar" to="/user" aria-label="用户中心">
            <img :src="user?.avatar || '/avatar.png'" alt="" width="32" height="32" />
          </RouterLink>
        </template>
        <RouterLink v-else class="login-link" to="/login">登录</RouterLink>
      </div>
    </header>

    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="currentRoute.fullPath" />
      </Transition>
    </RouterView>

    <footer class="site-footer">
      <div class="footer-copy">
        <strong>希燃呀开发者平台</strong>
        <span>在线工具、报错解决方案、技术文章与工程实验。</span>
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
        <a href="https://github.com/Xiranwuxianxi" target="_blank" rel="me noopener noreferrer">
          GitHub
        </a>
        <a href="mailto:hello@xiranya.cn" rel="noopener noreferrer">邮箱</a>
        <a href="https://halo.xiranya.cn/rss.xml" target="_blank" rel="noopener noreferrer">
          RSS
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.topbar-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.search-trigger,
.theme-toggle,
.user-avatar,
.login-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border: 1px solid rgba(34, 116, 165, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.62);
  font-size: 1rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out),
    background 0.2s var(--ease-out);
}

.search-trigger:hover,
.theme-toggle:hover,
.user-avatar:hover,
.login-link:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 184, 255, 0.22);
  background: rgba(255, 255, 255, 0.88);
}

html.dark .search-trigger,
html.dark .theme-toggle,
html.dark .login-link {
  background: rgba(0, 0, 0, 0.25);
  border-color: rgba(0, 184, 255, 0.2);
  color: var(--ink);
}

html.dark .search-trigger:hover,
html.dark .theme-toggle:hover,
html.dark .login-link:hover {
  background: rgba(0, 0, 0, 0.4);
}

.user-avatar {
  padding: 2px;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.search-trigger:focus-visible,
.theme-toggle:focus-visible,
.user-avatar:focus-visible,
.login-link:focus-visible {
  outline: 3px solid rgba(0, 184, 255, 0.32);
  outline-offset: 3px;
}
</style>
