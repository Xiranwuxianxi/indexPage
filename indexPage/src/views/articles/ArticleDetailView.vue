<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useArticleStore } from '../../stores/article'

const route = useRoute()
const articleStore = useArticleStore()
const slug = computed(() => route.params.slug)

onMounted(() => {
  articleStore.fetchArticle(slug.value)
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="article-title">
      <AppSkeleton v-if="articleStore.loading" :lines="8" />

      <ErrorMessage
        v-else-if="articleStore.error"
        :message="articleStore.error"
        @retry="articleStore.fetchArticle(slug)"
      />

      <article v-else-if="articleStore.currentArticle">
        <SectionHeading
          variant="page"
          eyebrow="TECH ARTICLE"
          :title="articleStore.currentArticle.title"
          title-id="article-title"
          :lead="articleStore.currentArticle.summary"
        />

        <div class="article-meta-bar">
          <span class="article-category">{{ articleStore.currentArticle.category }}</span>
          <span>{{ articleStore.currentArticle.author }}</span>
          <time :datetime="articleStore.currentArticle.publishedAt">
            {{ new Date(articleStore.currentArticle.publishedAt).toLocaleDateString('zh-CN') }}
          </time>
          <span>阅读 {{ articleStore.currentArticle.viewCount.toLocaleString() }}</span>
        </div>

        <img
          class="article-cover"
          :src="articleStore.currentArticle.cover"
          alt=""
          width="1200"
          height="630"
          loading="eager"
        />

        <div class="article-content">
          <p>文章内容将在 Phase 3/4 接入后端 Markdown 内容系统后完整渲染。</p>
          <p>当前为文章详情页结构预览，包含标题、摘要、分类、作者、发布时间、阅读量和封面图。</p>
        </div>
      </article>

      <EmptyState
        v-else-if="!articleStore.loading"
        title="文章不存在"
        description="你访问的文章尚未发布或已被移除。"
      />
    </section>
  </main>
</template>

<style scoped>
.article-meta-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  color: var(--soft);
  font-size: 0.9rem;
}

.article-category {
  padding: 4px 10px;
  border-radius: 6px;
  color: #0078b4;
  background: rgba(0, 184, 255, 0.08);
  font-weight: 950;
}

.article-cover {
  width: 100%;
  height: auto;
  margin-top: 24px;
  border-radius: 14px;
  aspect-ratio: 1200 / 630;
  object-fit: cover;
}

.article-content {
  margin-top: 32px;
  color: var(--muted);
  line-height: 1.9;
}

.article-content p {
  margin-bottom: 16px;
}
</style>
