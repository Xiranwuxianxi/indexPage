<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useArticleStore } from '../../stores/article'

const articleStore = useArticleStore()
const { articles, loading, error } = storeToRefs(articleStore)

onMounted(() => {
  articleStore.fetchArticles()
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="articles-title">
      <SectionHeading
        variant="page"
        eyebrow="TECH ARTICLES"
        title="技术文章"
        title-id="articles-title"
        lead="围绕部署、Java 后端、Vue 前端与 AI 工程化的实战经验与解决方案。"
      />

      <ErrorMessage v-if="error" :message="error" @retry="articleStore.fetchArticles" />

      <AppSkeleton v-if="loading" :lines="6" />

      <section v-else-if="articles.length" class="article-list" aria-label="文章列表">
        <RouterLink
          v-for="article in articles"
          :key="article.slug"
          class="article-row"
          :to="article.href"
        >
          <img :src="article.cover" alt="" width="160" height="100" loading="lazy" />
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

      <EmptyState
        v-else-if="!loading"
        title="暂无文章"
        description="文章列表为空，请稍后再试。"
      />
    </section>
  </main>
</template>

<style scoped>
.article-list {
  display: grid;
  gap: 16px;
  margin-top: 28px;
}

.article-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  transition:
    transform 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out);
}

.article-row:hover {
  transform: translateX(4px);
  border-color: var(--line-strong);
}

.article-row img {
  width: 160px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
}

.article-body {
  display: grid;
  gap: 8px;
}

.article-category {
  justify-self: flex-start;
  padding: 4px 10px;
  border-radius: 6px;
  color: var(--brand);
  background: rgba(var(--brand-rgb), 0.08);
  font-size: 0.74rem;
  font-weight: 950;
}

.article-body strong {
  font-size: 1.15rem;
  font-weight: 950;
}

.article-body p {
  color: var(--muted);
  line-height: 1.7;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--soft);
  font-size: 0.82rem;
}

@media (max-width: 640px) {
  .article-row {
    grid-template-columns: 1fr;
  }

  .article-row img {
    width: 100%;
    height: auto;
  }
}
</style>
