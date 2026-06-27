<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { id: 'dashboard', label: '仪表盘', to: '/admin/dashboard' },
  { id: 'articles', label: '文章', to: '/admin/articles' },
  { id: 'projects', label: '项目', to: '/admin/projects' },
  { id: 'tools', label: '工具', to: '/admin/tools' },
  { id: 'errors', label: '错误库', to: '/admin/errors' },
]
</script>

<template>
  <main class="page-view">
    <section class="content-panel admin-layout" aria-labelledby="admin-title">
      <h1 id="admin-title" class="page-title">管理后台</h1>

      <nav class="admin-nav" aria-label="管理后台导航">
        <RouterLink
          v-for="item in menuItems"
          :key="item.id"
          :to="item.to"
          :class="{ 'is-active': route.path.startsWith(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="admin-content">
        <RouterView />
      </div>
    </section>
  </main>
</template>

<style scoped>
.admin-layout {
  display: grid;
  gap: 24px;
}

.page-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 950;
}

.admin-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.admin-nav a {
  padding: 8px 16px;
  border-radius: 10px;
  color: var(--muted);
  font-weight: 800;
  text-decoration: none;
  transition:
    background 0.2s var(--ease-out),
    color 0.2s var(--ease-out);
}

.admin-nav a:hover,
.admin-nav a.is-active {
  color: var(--ink);
  background: rgba(0, 184, 255, 0.08);
}

.admin-content {
  min-height: 300px;
}
</style>
