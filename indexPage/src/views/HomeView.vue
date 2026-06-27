<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import ProjectCard from '../components/ProjectCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import ToolCard from '../components/ToolCard.vue'
import AppSkeleton from '../components/common/AppSkeleton.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import { useSiteStore } from '../stores/site.js'
import { useHomeStore } from '../stores/home.js'

const site = useSiteStore()
const home = useHomeStore()
const { hero, hotTools, commonErrors, featuredProjects, latestArticles, focusAreas, loading, error } =
  storeToRefs(home)

onMounted(() => {
  home.fetchHome()
})
</script>

<template>
  <main class="page-view">
    <!-- 首屏 -->
    <section class="hero-panel" aria-labelledby="site-title">
      <div class="hero-copy">
        <template v-if="loading">
          <AppSkeleton :lines="5" />
        </template>
        <template v-else-if="error">
          <ErrorMessage :message="error" @retry="home.fetchHome" />
        </template>
        <template v-else>
          <p class="eyebrow reveal reveal-1">{{ hero.eyebrow }}</p>
          <h1 id="site-title" class="hero-title reveal reveal-2">{{ hero.title }}</h1>
          <p class="hero-subtitle reveal reveal-3">{{ hero.subtitle }}</p>
          <p class="intro reveal reveal-4">{{ hero.description }}</p>

          <div class="hero-actions reveal reveal-5" aria-label="主要入口">
            <RouterLink class="action primary" :to="hero.primaryAction.href">
              {{ hero.primaryAction.text }}
            </RouterLink>
            <RouterLink class="action secondary" :to="hero.secondaryAction.href">
              {{ hero.secondaryAction.text }}
            </RouterLink>
            <RouterLink class="action tertiary" :to="hero.tertiaryAction.href">
              {{ hero.tertiaryAction.text }}
            </RouterLink>
          </div>

          <dl class="metrics reveal reveal-6" aria-label="站点概览">
            <div v-for="metric in site.metrics" :key="metric.label">
              <dt>{{ metric.value }}</dt>
              <dd>{{ metric.label }}</dd>
            </div>
          </dl>
        </template>
      </div>

      <aside class="profile-board reveal reveal-3" aria-label="平台动态">
        <div class="avatar-row">
          <div class="avatar-frame">
            <img :src="site.avatarUrl" alt="希燃呀的头像" width="116" height="116" loading="eager" />
            <span class="avatar-mark">希</span>
          </div>
          <div class="identity">
            <span>Developer Platform</span>
            <strong>工具 · 方案 · 实验</strong>
          </div>
        </div>

        <div class="signal-board">
          <div v-for="signal in site.signals" :key="signal" class="signal-row">
            <span class="status-light"></span>
            <span>{{ signal }}</span>
          </div>
        </div>
      </aside>
    </section>

    <!-- 热门工具 -->
    <SectionHeading
      eyebrow="HOT TOOLS"
      title="热门工具"
      title-id="home-tools-title"
    />

    <section class="tool-grid" aria-labelledby="home-tools-title">
      <AppSkeleton v-if="loading" :lines="4" />
      <ToolCard v-for="tool in hotTools" :key="tool.slug" :tool="tool" />
    </section>

    <!-- 常见开发问题 -->
    <SectionHeading
      eyebrow="COMMON ERRORS"
      title="常见开发问题"
      title-id="home-errors-title"
    />

    <section class="error-list" aria-labelledby="home-errors-title">
      <AppSkeleton v-if="loading" :lines="3" />
      <RouterLink
        v-for="errorItem in commonErrors"
        :key="errorItem.slug"
        class="error-row"
        :to="errorItem.href"
      >
        <span class="error-category">{{ errorItem.category }}</span>
        <strong>{{ errorItem.title }}</strong>
        <p>{{ errorItem.summary }}</p>
      </RouterLink>
    </section>

    <!-- 精选项目 -->
    <SectionHeading
      eyebrow="FEATURED PROJECTS"
      title="精选项目"
      title-id="home-projects-title"
    />

    <section class="project-grid" aria-labelledby="home-projects-title">
      <AppSkeleton v-if="loading" :lines="4" />
      <ProjectCard
        v-for="project in featuredProjects"
        :key="project.slug"
        :project="{
          ...project,
          id: project.slug,
          href: project.href,
          name: project.name,
          status: project.statusText,
          summary: project.summary,
        }"
      />
    </section>

    <!-- 最新文章 -->
    <SectionHeading
      eyebrow="LATEST ARTICLES"
      title="最新文章"
      title-id="home-articles-title"
    />

    <section class="article-list" aria-labelledby="home-articles-title">
      <AppSkeleton v-if="loading" :lines="3" />
      <RouterLink
        v-for="article in latestArticles"
        :key="article.slug"
        class="article-row"
        :to="article.href"
      >
        <img :src="article.cover" alt="" width="120" height="80" loading="lazy" />
        <div class="article-body">
          <span class="article-category">{{ article.category }}</span>
          <strong>{{ article.title }}</strong>
          <p>{{ article.summary }}</p>
          <div class="article-meta">
            <span>{{ article.author }}</span>
            <span>{{ new Date(article.publishedAt).toLocaleDateString('zh-CN') }}</span>
            <span>阅读 {{ article.viewCount.toLocaleString() }}</span>
          </div>
        </div>
      </RouterLink>
    </section>

    <!-- 技术方向 -->
    <SectionHeading
      eyebrow="FOCUS AREAS"
      title="技术方向"
      title-id="home-focus-title"
    />

    <section class="focus-grid" aria-labelledby="home-focus-title">
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

    <!-- 联系与订阅 -->
    <SectionHeading
      eyebrow="CONNECT"
      title="联系与订阅"
      title-id="home-connect-title"
    />

    <section class="connect-grid" aria-labelledby="home-connect-title">
      <a
        class="connect-card"
        href="https://github.com/Xiranwuxianxi"
        target="_blank"
        rel="me noopener noreferrer"
      >
        <span aria-hidden="true">🐙</span>
        <strong>GitHub</strong>
        <p>关注开源仓库与项目实践。</p>
      </a>
      <a class="connect-card" href="mailto:hello@xiranya.cn" rel="noopener noreferrer">
        <span aria-hidden="true">✉️</span>
        <strong>邮箱</strong>
        <p>hello@xiranya.cn</p>
      </a>
      <a
        class="connect-card"
        href="https://halo.xiranya.cn/rss.xml"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span aria-hidden="true">📡</span>
        <strong>RSS 订阅</strong>
        <p>通过 RSS 获取博客与平台更新。</p>
      </a>
      <RouterLink class="connect-card" to="/about">
        <span aria-hidden="true">🤝</span>
        <strong>合作入口</strong>
        <p>了解平台定位与联系方式。</p>
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.hero-subtitle {
  margin-top: 18px;
  color: var(--cyan);
  font-size: clamp(1.1rem, 2.2vw, 1.45rem);
  font-weight: 800;
  line-height: 1.4;
}

.tertiary {
  color: var(--ink);
  border-color: var(--line);
  background: var(--paper);
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.error-list,
.article-list {
  display: grid;
  gap: 12px;
}

.error-row,
.article-row {
  display: grid;
  gap: 10px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  transition:
    transform 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out),
    background 0.25s var(--ease-out);
}

.error-row:hover,
.article-row:hover {
  transform: translateX(4px);
  border-color: var(--line-strong);
  background: rgba(255, 255, 255, 0.95);
}

.error-category,
.article-category {
  justify-self: flex-start;
  padding: 4px 10px;
  border-radius: 6px;
  color: #0078b4;
  background: rgba(0, 184, 255, 0.08);
  font-size: 0.74rem;
  font-weight: 950;
}

.error-row strong,
.article-body strong {
  font-size: 1.1rem;
  font-weight: 950;
}

.error-row p,
.article-body p {
  color: var(--muted);
  line-height: 1.7;
}

.article-row {
  grid-template-columns: 120px 1fr;
  align-items: start;
  gap: 18px;
}

.article-row img {
  width: 120px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.article-body {
  display: grid;
  gap: 8px;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--soft);
  font-size: 0.82rem;
}

.connect-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.connect-card {
  display: grid;
  gap: 8px;
  min-height: 160px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  transition:
    transform 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out);
}

.connect-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-hover);
}

.connect-card span {
  font-size: 1.6rem;
}

.connect-card strong {
  font-size: 1.2rem;
  font-weight: 950;
}

.connect-card p {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

@media (max-width: 1100px) {
  .tool-grid,
  .connect-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .tool-grid,
  .connect-grid,
  .article-row {
    grid-template-columns: 1fr;
  }

  .article-row img {
    width: 100%;
    height: auto;
  }
}
</style>
