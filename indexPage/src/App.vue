<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { siteNavigationLinks } from './config/seo'
import { useTheme } from './composables/useTheme'
import { useUserStore } from './stores/user'

const route = useRoute()
const userStore = useUserStore()
const { user, isLoggedIn } = storeToRefs(userStore)
const { isDark, toggleTheme } = useTheme()

// 顶部导航：隐藏「文章」「错误」入口（文章统一由简单博客引导），保留简单博客外链
const navItems = siteNavigationLinks.filter(
  (link) =>
    (link.type === 'router' && !['articles', 'errors'].includes(link.id)) || link.showInNav,
)
const footerSiteLinks = siteNavigationLinks

const shellClass = computed(() => ({
  'is-error-page': route.name === 'not-found',
  'is-admin-page': route.path.startsWith('/admin'),
}))
</script>

<template>
  <div class="site-shell" :class="shellClass">
    <header class="topbar" aria-label="站点导航">
      <RouterLink class="brand" to="/" aria-label="回到首页">
        <span class="brand-mark">希</span>
        <span class="brand-copy">
          <strong>希燃呀</strong>
          <small>Developer Platform</small>
        </span>
      </RouterLink>

      <nav class="nav-links" aria-label="主导航">
        <template v-for="item in navItems" :key="item.id">
          <a
            v-if="item.type === 'external'"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.navLabel }}
          </a>
          <RouterLink
            v-else
            :to="item.href"
            :aria-current="route.name === item.id ? 'page' : undefined"
          >
            {{ item.navLabel }}
          </RouterLink>
        </template>
      </nav>

      <div class="topbar-actions">
        <a
          class="rss-trigger"
          href="https://halo.xiranya.cn/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RSS 订阅"
          title="RSS 订阅"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <RouterLink class="search-trigger" to="/search" aria-label="搜索">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </RouterLink>

        <button
          class="theme-toggle"
          type="button"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
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
.rss-trigger,
.theme-toggle,
.user-avatar,
.login-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--soft);
  background: var(--paper);
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out),
    color 0.2s var(--ease-out),
    background 0.2s var(--ease-out);
}

.search-trigger:hover,
.rss-trigger:hover,
.theme-toggle:hover,
.user-avatar:hover,
.login-link:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--brand-rgb), 0.25);
  background: rgba(var(--brand-rgb), 0.08);
}

html.dark .search-trigger,
html.dark .rss-trigger,
html.dark .theme-toggle,
html.dark .login-link {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(var(--brand-rgb), 0.2);
  color: var(--ink);
}

html.dark .search-trigger:hover,
html.dark .rss-trigger:hover,
html.dark .theme-toggle:hover,
html.dark .login-link:hover {
  background: rgba(var(--brand-rgb), 0.15);
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
.rss-trigger:focus-visible,
.theme-toggle:focus-visible,
.user-avatar:focus-visible,
.login-link:focus-visible {
  outline: 3px solid rgba(var(--brand-rgb), 0.35);
  outline-offset: 3px;
}
</style>
