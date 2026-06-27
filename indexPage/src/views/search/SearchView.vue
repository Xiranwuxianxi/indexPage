<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useSearchStore } from '../../stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const { query, results, hotSearches, loading, error } = storeToRefs(searchStore)

onMounted(() => {
  searchStore.fetchHotSearches()
  if (route.query.q) {
    searchStore.setQuery(route.query.q)
    searchStore.search()
  }
})

watch(query, (value) => {
  router.replace({ query: value ? { q: value } : {} })
})

const typeLabelMap = {
  article: '文章',
  error: '错误',
  tool: '工具',
  project: '项目',
}
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="search-title">
      <SectionHeading
        variant="page"
        eyebrow="SEARCH"
        title="全站搜索"
        title-id="search-title"
        lead="搜索工具、错误解决方案、技术文章和开源项目。"
      />

      <form class="search-form" role="search" @submit.prevent="searchStore.search()">
        <input
          v-model="query"
          type="search"
          placeholder="输入错误信息、工具名或技术关键词…"
          aria-label="搜索关键词"
        />
        <button type="submit" class="action primary">搜索</button>
      </form>

      <div v-if="hotSearches.length" class="hot-searches">
        <strong>热门搜索</strong>
        <button
          v-for="term in hotSearches"
          :key="term"
          type="button"
          @click="query = term; searchStore.search()"
        >
          {{ term }}
        </button>
      </div>

      <ErrorMessage v-if="error" :message="error" @retry="searchStore.search" />

      <AppSkeleton v-if="loading" :lines="5" />

      <section v-else-if="results.length" class="search-results" aria-label="搜索结果">
        <RouterLink
          v-for="item in results"
          :key="`${item.type}-${item.slug}`"
          class="search-result"
          :to="item.href || `/${item.type}s/${item.slug}`"
        >
          <span class="result-type">{{ typeLabelMap[item.type] || item.type }}</span>
          <strong>{{ item.title || item.name }}</strong>
          <p>{{ item.summary }}</p>
        </RouterLink>
      </section>

      <EmptyState
        v-else-if="query && !loading"
        title="未找到结果"
        description="尝试更换关键词，或前往错误知识库、工具中心浏览。"
      />
    </section>
  </main>
</template>

<style scoped>
.search-form {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.search-form input {
  flex: 1;
  min-height: 50px;
  padding: 0 18px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.62);
  color: var(--ink);
  font-size: 1rem;
}

.search-form input:focus {
  outline: 3px solid rgba(0, 184, 255, 0.2);
  border-color: rgba(0, 184, 255, 0.4);
}

.hot-searches {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.hot-searches strong {
  color: var(--ink);
}

.hot-searches button {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--paper);
  color: var(--muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out),
    color 0.2s var(--ease-out);
}

.hot-searches button:hover {
  transform: translateY(-1px);
  border-color: var(--line-strong);
  color: var(--ink);
}

.search-results {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

.search-result {
  display: grid;
  gap: 8px;
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

.search-result:hover {
  transform: translateX(4px);
  border-color: var(--line-strong);
}

.result-type {
  justify-self: flex-start;
  padding: 4px 10px;
  border-radius: 6px;
  color: #0078b4;
  background: rgba(0, 184, 255, 0.08);
  font-size: 0.74rem;
  font-weight: 950;
}

.search-result p {
  color: var(--muted);
  line-height: 1.7;
}

@media (max-width: 640px) {
  .search-form {
    flex-direction: column;
  }
}
</style>
