<script setup>
import { storeToRefs } from 'pinia'

import SectionHeading from '../components/SectionHeading.vue'
import SocialCard from '../components/SocialCard.vue'
import { useSiteStore } from '../stores/site'

const site = useSiteStore()
const { focusAreas, milestones, socialLinks, timeline } = storeToRefs(site)
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="about-title">
      <SectionHeading
        variant="page"
        eyebrow="ABOUT THE LAB"
        title="关于这个空间"
        title-id="about-title"
        lead="它不是传统意义上的作品集，更像一个持续扩展的数字工作台：工具、文章、日记、代码和内容平台都在这里汇合。"
      />

      <section class="social-grid social-grid-lead" aria-label="个人平台">
        <SocialCard
          v-for="(link, index) in socialLinks"
          :key="link.id"
          :link="link"
          :reveal-class="`reveal reveal-${index + 1}`"
        />
      </section>

      <div class="about-layout">
        <article class="about-panel reveal reveal-2">
          <h2>探索底层逻辑，用代码重构世界。</h2>
          <p>
            我喜欢从“为什么这样工作”开始拆问题，再把答案变成可运行、可验证、可分享的东西。这个主页会继续往工具集、实验模块、技术笔记和内容创作方向生长。
          </p>
          <div class="panel-actions">
            <a
              class="action primary"
              href="https://github.com/Xiranwuxianxi"
              target="_blank"
              rel="me noopener noreferrer"
            >
              关注 GitHub
            </a>
            <a
              class="action secondary"
              href="https://halo.xiranya.cn/"
              target="_blank"
              rel="noreferrer"
            >
              阅读博客
            </a>
          </div>
        </article>

        <div class="timeline" aria-label="建设节奏">
          <div
            v-for="(item, index) in timeline"
            :key="item.label"
            class="timeline-item reveal"
            :class="`reveal-${index + 2}`"
          >
            <strong>{{ item.label }}</strong>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>

      <section class="insight-grid" aria-label="技术方向">
        <article
          v-for="(area, index) in focusAreas"
          :key="area.title"
          class="insight-card reveal"
          :class="`reveal-${index + 1}`"
        >
          <h3>{{ area.title }}</h3>
          <ul>
            <li v-for="item in area.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>

      <section class="milestones" aria-labelledby="milestones-title">
        <h2 id="milestones-title" class="reveal reveal-1">站点里程碑</h2>
        <div class="timeline">
          <div
            v-for="(item, index) in milestones"
            :key="item.title"
            class="timeline-item reveal"
            :class="`reveal-${index + 2}`"
          >
            <strong>{{ item.date }}</strong>
            <span>
              <b>{{ item.title }}</b>
              {{ item.text }}
            </span>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.about-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: 16px;
  margin-top: 26px;
}

.about-panel {
  min-height: 340px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
}

.about-panel h2 {
  font-size: clamp(1.7rem, 4vw, 2.8rem);
  font-weight: 950;
  line-height: 1.1;
}

.about-panel p {
  margin-top: 16px;
  color: var(--muted);
  line-height: 1.85;
}

.timeline {
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
  transition:
    transform 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out),
    background 0.25s var(--ease-out);
}

.timeline-item:hover {
  transform: translateX(4px) scale(1.01);
  border-color: rgba(0, 184, 255, 0.22);
  background: rgba(255, 255, 255, 0.95);
  transition-timing-function: var(--ease-spring);
}

.timeline-item strong {
  color: #0078b4;
  font-weight: 950;
}

.timeline-item span {
  color: var(--muted);
  line-height: 1.7;
}

.milestones {
  margin-top: 28px;
}

.milestones h2 {
  margin-bottom: 16px;
  color: var(--ink);
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 950;
}

.milestones .timeline-item b {
  display: block;
  margin-bottom: 4px;
  color: var(--ink);
  font-weight: 950;
}

html.dark .timeline-item:hover {
  background: rgba(0, 184, 255, 0.08);
}

@media (max-width: 980px) {
  .about-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .timeline-item {
    grid-template-columns: 1fr;
  }
}
</style>
