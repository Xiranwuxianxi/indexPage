<script setup>
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import ProjectCard from '../components/ProjectCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { useSiteStore } from '../stores/site'

const site = useSiteStore()
const { avatarUrl, focusAreas, metrics, projects, signals, socialLinks } = storeToRefs(site)

const handleAvatarError = (event) => {
  event.target.style.opacity = '0'
  event.target.style.visibility = 'hidden'
}

const handleCardMove = (event) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  card.style.setProperty('--mouse-x', `${x}%`)
  card.style.setProperty('--mouse-y', `${y}%`)
}

const handleCardLeave = (event) => {
  event.currentTarget.style.removeProperty('--mouse-x')
  event.currentTarget.style.removeProperty('--mouse-y')
}
</script>

<template>
  <main class="page-view">
    <section class="hero-panel" aria-labelledby="site-title">
      <div class="hero-copy">
        <p class="eyebrow reveal reveal-1">XIRAN DIGITAL LAB</p>
        <h1 id="site-title" class="hero-title reveal reveal-2">希燃呐</h1>
        <p class="intro reveal reveal-3">
          探索底层逻辑，用代码重构世界。这里收纳在线工具、日记、博客、开源项目，也放着你值得关注的内容平台。
        </p>

        <div class="hero-actions reveal reveal-4" aria-label="主要入口">
          <RouterLink class="action primary" to="/projects">浏览项目索引</RouterLink>
          <RouterLink class="action secondary" to="/about">
            关于希燃呐
          </RouterLink>
        </div>

        <dl class="metrics reveal reveal-5" aria-label="站点概览">
          <div v-for="metric in metrics" :key="metric.label">
            <dt>{{ metric.value }}</dt>
            <dd>{{ metric.label }}</dd>
          </div>
        </dl>
      </div>

      <aside class="profile-board reveal reveal-3" aria-label="重点关注平台">
        <div class="avatar-row">
          <div class="avatar-frame">
            <img
              :src="avatarUrl"
              alt="希燃呐的头像"
              width="116"
              height="116"
              loading="eager"
              decoding="async"
              @error="handleAvatarError"
            />
            <span class="avatar-mark">希</span>
          </div>
          <div class="identity">
            <span>Follow Me</span>
            <strong>关注入口</strong>
          </div>
        </div>

        <div class="social-board social-board-featured" aria-label="个人平台">
          <a
            v-for="link in socialLinks"
            :key="link.id"
            class="social-link"
            :class="`is-${link.tone}`"
            :href="link.href"
            target="_blank"
            rel="me noopener noreferrer"
          >
            <span class="social-kicker">{{ link.handle }}</span>
            <strong>{{ link.label }}</strong>
            <span>{{ link.summary }}</span>
          </a>
        </div>

        <div class="signal-board">
          <div v-for="signal in signals" :key="signal" class="signal-row">
            <span class="signal-dot"></span>
            <span>{{ signal }}</span>
          </div>
        </div>
      </aside>
    </section>

    <SectionHeading
      eyebrow="PROJECT INDEX"
      title="项目入口"
      title-id="home-project-title"
    />

    <section class="project-grid" aria-label="项目列表">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.id"
        :project="project"
        :reveal-class="`reveal reveal-${index + 1}`"
        @mousemove="handleCardMove"
        @mouseleave="handleCardLeave"
      />
    </section>

    <section class="focus-grid" aria-label="技术方向">
      <article
        v-for="(area, index) in focusAreas"
        :key="area.title"
        class="focus-card reveal"
        :class="`reveal-${index + 1}`"
      >
        <h3>{{ area.title }}</h3>
        <ul>
          <li v-for="item in area.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>
  </main>
</template>
