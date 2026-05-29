<script setup>
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useSiteStore } from '../stores/site'

const site = useSiteStore()
const { avatarUrl, focusAreas, metrics, projects, signals } = storeToRefs(site)

const handleAvatarError = (event) => {
  event.target.style.opacity = '0'
  event.target.style.visibility = 'hidden'
}
</script>

<template>
  <main class="page-view">
    <section class="hero-panel" aria-labelledby="site-title">
      <div class="hero-copy">
        <p class="eyebrow">XIRAN DIGITAL LAB</p>
        <h1 id="site-title" class="hero-title">希燃呐</h1>
        <p class="intro">
          探索底层逻辑，用代码重构世界。这里收纳我的工具、文章、开源轨迹与持续长出来的新想法。
        </p>

        <div class="hero-actions" aria-label="主要入口">
          <RouterLink class="action primary" to="/projects">浏览项目索引</RouterLink>
          <a
            class="action secondary"
            href="http://halo.xiranya.cn/"
            target="_blank"
            rel="noreferrer"
          >
            去技术博客
          </a>
        </div>

        <dl class="metrics" aria-label="站点概览">
          <div v-for="metric in metrics" :key="metric.label">
            <dt>{{ metric.value }}</dt>
            <dd>{{ metric.label }}</dd>
          </div>
        </dl>
      </div>

      <aside class="profile-board" aria-label="个人状态面板">
        <div class="avatar-frame">
          <img :src="avatarUrl" alt="希燃呐的头像" @error="handleAvatarError" />
          <span class="avatar-mark">希</span>
        </div>

        <div class="identity">
          <span>Current Mode</span>
          <strong>Build & Think</strong>
        </div>

        <div class="signal-board">
          <div v-for="signal in signals" :key="signal" class="signal-row">
            <span class="signal-dot"></span>
            <span>{{ signal }}</span>
          </div>
        </div>

        <div class="route-map" aria-hidden="true">
          <span class="node start"></span>
          <span class="track one"></span>
          <span class="track two"></span>
          <span class="track three"></span>
          <span class="node end a"></span>
          <span class="node end b"></span>
          <span class="node end c"></span>
        </div>
      </aside>
    </section>

    <section class="section-heading" aria-labelledby="home-project-title">
      <p class="eyebrow">PROJECT INDEX</p>
      <h2 id="home-project-title">常用入口</h2>
    </section>

    <section class="project-grid" aria-label="项目列表">
      <a
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        :href="project.href"
        target="_blank"
        rel="noreferrer"
      >
        <span class="project-type">{{ project.type }}</span>
        <h3>{{ project.name }}</h3>
        <p>{{ project.summary }}</p>
        <span class="project-status">
          <span class="status-light"></span>
          {{ project.status }}
        </span>
      </a>
    </section>

    <section class="focus-grid" aria-label="技术方向">
      <article v-for="area in focusAreas" :key="area.title" class="focus-card">
        <h3>{{ area.title }}</h3>
        <ul>
          <li v-for="item in area.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>
  </main>
</template>
