<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import SectionHeading from '../components/SectionHeading.vue'
import ToolCard from '../components/ToolCard.vue'
import AppSkeleton from '../components/common/AppSkeleton.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import PlatformGrid from '../components/widgets/PlatformGrid.vue'
import QuickLinks from '../components/widgets/QuickLinks.vue'
import MarketTicker from '../components/widgets/MarketTicker.vue'
import WorldClockBoard from '../components/widgets/WorldClockBoard.vue'
import { useHomeStore } from '../stores/home.js'
import { useWidgetStore } from '../stores/widgets.js'

const home = useHomeStore()
const widget = useWidgetStore()
const { hero, hotTools, commonErrors, latestArticles, stats, loading, error } = storeToRefs(home)
const { platforms, worldClock, weather, markets } = storeToRefs(widget)

// 站点数据条：数字滚动动画
const animatedStats = ref({ toolCount: 0, articleCount: 0, errorCount: 0, totalUsage: 0 })

watch(
  stats,
  (val) => {
    if (!val) return
    const duration = 1200
    const start = performance.now()
    const from = { ...animatedStats.value }
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      animatedStats.value = {
        toolCount: Math.round(from.toolCount + (val.toolCount - from.toolCount) * eased),
        articleCount: Math.round(from.articleCount + (val.articleCount - from.articleCount) * eased),
        errorCount: Math.round(from.errorCount + (val.errorCount - from.errorCount) * eased),
        totalUsage: Math.round(from.totalUsage + (val.totalUsage - from.totalUsage) * eased),
      }
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },
  { immediate: true },
)

onMounted(() => {
  home.fetchHome()
  widget.fetchAll()
  // 行情 3 秒轮询，保证与行情源秒级对准
  marketTimer = setInterval(() => widget.fetchMarkets(), 3000)
})

onUnmounted(() => {
  if (marketTimer) clearInterval(marketTimer)
})

let marketTimer = null
</script>

<template>
  <main class="page-view">
    <!-- 首屏：品牌主视觉 -->
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

          <!-- 站点使用数据条 -->
          <dl v-if="stats" class="stats-strip reveal reveal-6" aria-label="站点数据">
            <div class="stat-item">
              <dt>在线工具</dt>
              <dd>{{ animatedStats.toolCount }}</dd>
            </div>
            <div class="stat-item">
              <dt>报错方案</dt>
              <dd>{{ animatedStats.errorCount }}</dd>
            </div>
            <div class="stat-item">
              <dt>技术文章</dt>
              <dd>{{ animatedStats.articleCount }}</dd>
            </div>
            <div class="stat-item">
              <dt>累计使用</dt>
              <dd>{{ animatedStats.totalUsage.toLocaleString() }}</dd>
            </div>
          </dl>
        </template>
      </div>
    </section>

    <!-- 全球时间与天气 -->
    <SectionHeading
      eyebrow="WORLD CLOCK &amp; WEATHER"
      title="全球时间与天气"
      title-id="home-worldclock-title"
    />

    <section class="widget-section" aria-labelledby="home-worldclock-title">
      <WorldClockBoard
        :cities="worldClock.cities"
        :weather="weather"
        :loading="widget.loading"
      />
    </section>

    <!-- 市场指数 -->
    <SectionHeading eyebrow="MARKETS" title="市场指数" title-id="home-markets-title" />

    <section class="widget-section" aria-labelledby="home-markets-title">
      <MarketTicker :markets="markets" :loading="widget.loading" />
    </section>

    <!-- 热门工具 -->
    <SectionHeading eyebrow="HOT TOOLS" title="热门工具" title-id="home-tools-title" />

    <section class="tool-grid" aria-labelledby="home-tools-title">
      <AppSkeleton v-if="loading" :lines="4" />
      <ToolCard v-for="tool in hotTools" :key="tool.slug" :tool="tool" />
    </section>

    <!-- 常见开发问题 -->
    <SectionHeading eyebrow="COMMON ERRORS" title="常见开发问题" title-id="home-errors-title" />

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

    <!-- 最新文章 -->
    <SectionHeading eyebrow="LATEST ARTICLES" title="最新文章" title-id="home-articles-title" />

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

    <!-- 平台入口 -->
    <SectionHeading eyebrow="PLATFORMS" title="平台入口" title-id="home-platforms-title" />

    <section class="widget-section" aria-labelledby="home-platforms-title">
      <ErrorMessage
        v-if="widget.error && !platforms.length"
        :message="widget.error"
        @retry="widget.fetchAll"
      />
      <PlatformGrid :platforms="platforms" :loading="widget.loading" />
    </section>

    <!-- 快捷导航 -->
    <SectionHeading eyebrow="QUICK LINKS" title="快捷导航" title-id="home-links-title" />

    <section class="widget-section" aria-labelledby="home-links-title">
      <QuickLinks />
    </section>
  </main>
</template>

<style scoped>
.hero-subtitle {
  margin-top: 18px;
  color: var(--cyan);
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  font-weight: 800;
  line-height: 1.5;
}

.tertiary {
  color: var(--ink);
  border-color: var(--line);
  background: var(--paper);
}

/* 站点数据条 */
.stats-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(18px, 4vw, 48px);
  margin: 36px 0 0;
  padding: 20px 32px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--paper);
  backdrop-filter: blur(8px);
}

.stat-item {
  display: grid;
  justify-items: center;
  gap: 4px;
}

.stat-item dt {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.stat-item dd {
  margin: 0;
  color: var(--ink);
  font-size: 1.6rem;
  font-weight: 950;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
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
  padding: 20px 22px;
  border: 1px solid var(--line);
  border-radius: 16px;
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
  color: var(--brand);
  background: rgba(var(--brand-rgb), 0.08);
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

/* 首页小组件板块（平台入口 / 全球时间与天气） */
.widget-section {
  margin-top: 8px;
}

@media (max-width: 1100px) {
  .tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .tool-grid,
  .article-row {
    grid-template-columns: 1fr;
  }

  .article-row img {
    width: 100%;
    height: auto;
  }

  .stats-strip {
    gap: 16px;
    padding: 16px 18px;
  }
}
</style>
