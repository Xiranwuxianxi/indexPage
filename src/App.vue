<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

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
      <a href="https://gitee.com/litinyana" target="_blank" rel="noreferrer">查看开源主页</a>
    </footer>
  </div>
</template>
