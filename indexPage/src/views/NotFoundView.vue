<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="page-view">
    <section class="content-panel not-found-panel" aria-labelledby="not-found-title">
      <div>
        <p class="eyebrow reveal reveal-1">ROUTER 404</p>
        <div class="not-found-code reveal reveal-2">404</div>
        <h1 id="not-found-title" class="reveal reveal-3">站内路径没有匹配到页面</h1>
        <p class="page-lead reveal reveal-4">
          这个地址没有对应的 Vue Router 视图。可以回到首页重新进入，也可以直接查看项目索引。
        </p>
        <div class="hero-actions reveal reveal-5">
          <RouterLink class="action primary" to="/">回到首页</RouterLink>
          <RouterLink class="action secondary" to="/projects">查看项目</RouterLink>
        </div>
      </div>

      <aside class="route-card reveal reveal-4">
        <h2>已启用 Vue Router</h2>
        <p>
          首页、项目、关于和站内 404 都由路由控制；根目录的静态 404.html 仍保留，用于部署平台兜底。
        </p>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.not-found-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  gap: 24px;
  align-items: center;
  min-height: calc(100vh - 190px);
}

.not-found-code {
  color: var(--cyan);
  font-size: clamp(4.8rem, 16vw, 11rem);
  font-weight: 950;
  line-height: 0.9;
  text-shadow: 0 0 28px rgba(var(--brand-rgb), 0.2);
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.route-card {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
}

.route-card h2 {
  font-size: 1.1rem;
  font-weight: 950;
}

.route-card p {
  margin-top: 12px;
  color: var(--muted);
  line-height: 1.8;
}

@media (max-width: 980px) {
  .not-found-panel {
    grid-template-columns: 1fr;
  }
}
</style>
