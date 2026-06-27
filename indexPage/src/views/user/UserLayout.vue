<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { id: 'bookmarks', label: '收藏', to: '/user/bookmarks' },
  { id: 'history', label: '历史', to: '/user/history' },
  { id: 'saved-configs', label: '保存配置', to: '/user/saved-configs' },
  { id: 'settings', label: '设置', to: '/user/settings' },
]
</script>

<template>
  <main class="page-view">
    <section class="content-panel user-layout" aria-labelledby="user-title">
      <h1 id="user-title" class="page-title">用户中心</h1>

      <nav class="user-nav" aria-label="用户中心导航">
        <RouterLink
          v-for="item in menuItems"
          :key="item.id"
          :to="item.to"
          :class="{ 'is-active': route.path.startsWith(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="user-content">
        <RouterView />
      </div>
    </section>
  </main>
</template>

<style scoped>
.user-layout {
  display: grid;
  gap: 24px;
}

.page-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 950;
}

.user-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.user-nav a {
  padding: 8px 16px;
  border-radius: 10px;
  color: var(--muted);
  font-weight: 800;
  text-decoration: none;
  transition:
    background 0.2s var(--ease-out),
    color 0.2s var(--ease-out);
}

.user-nav a:hover,
.user-nav a.is-active {
  color: var(--ink);
  background: rgba(0, 184, 255, 0.08);
}

.user-content {
  min-height: 300px;
}
</style>
