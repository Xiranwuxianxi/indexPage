<script setup>
import { onMounted } from 'vue'

import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import api from '../../api/client.js'
import { ref } from 'vue'

const bookmarks = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const data = await api.getBookmarks()
    bookmarks.value = data
  } catch (err) {
    error.value = err.message || '加载收藏失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section aria-labelledby="bookmarks-title">
    <h2 id="bookmarks-title" class="section-title">我的收藏</h2>

    <ErrorMessage v-if="error" :message="error" />

    <AppSkeleton v-if="loading" :lines="4" />

    <div v-else-if="bookmarks.length" class="item-list">
      <RouterLink
        v-for="item in bookmarks"
        :key="item.bookmarkId"
        class="item-row"
        :to="item.href"
      >
        <span class="item-type">{{ item.type }}</span>
        <strong>{{ item.title || item.name }}</strong>
      </RouterLink>
    </div>

    <EmptyState
      v-else-if="!loading"
      title="暂无收藏"
      description="你还没有收藏任何文章或工具。"
    />
  </section>
</template>

<style scoped>
.section-title {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 950;
}

.item-list {
  display: grid;
  gap: 10px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  transition:
    transform 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out);
}

.item-row:hover {
  transform: translateX(4px);
  border-color: var(--line-strong);
}

.item-type {
  padding: 3px 8px;
  border-radius: 6px;
  color: #0078b4;
  background: rgba(0, 184, 255, 0.08);
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: uppercase;
}

.item-row strong {
  font-weight: 800;
}
</style>
