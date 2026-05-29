<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="page-view">
    <section class="content-panel not-found-panel" aria-labelledby="not-found-title">
      <div>
        <p class="eyebrow">ROUTER 404</p>
        <div class="not-found-code">404</div>
        <h1 id="not-found-title">站内路径没有匹配到页面</h1>
        <p class="page-lead">
          这个地址没有对应的 Vue Router 视图。可以回到首页重新进入，也可以直接查看项目索引。
        </p>
        <div class="hero-actions">
          <RouterLink class="action primary" to="/">回到首页</RouterLink>
          <RouterLink class="action secondary" to="/projects">查看项目</RouterLink>
        </div>
      </div>

      <aside class="route-card">
        <h2>已启用 Vue Router</h2>
        <p>
          首页、项目、关于和站内 404 都由路由控制；根目录的静态 404.html 仍保留，用于部署平台兜底。
        </p>
      </aside>
    </section>
  </main>
</template>
