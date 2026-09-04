<script setup>
import { onMounted, ref } from 'vue'

import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import api from '../../api/client.js'

const history = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const data = await api.getHistory()
    history.value = data
  } catch (err) {
    error.value = err.message || '加载历史失败'
  } finally {
    loading.value = false
  }
})

const clearHistory = () => {
  history.value = []
}
</script>

<template>
  <section aria-labelledby="history-title">
    <div class="section-header">
      <h2 id="history-title" class="section-title">浏览历史</h2>
      <button v-if="history.length" type="button" class="text-button" @click="clearHistory">清空</button>
    </div>

    <ErrorMessage v-if="error" :message="error" />

    <AppSkeleton v-if="loading" :lines="4" />

    <div v-else-if="history.length" class="item-list">
      <RouterLink
        v-for="item in history"
        :key="`${item.type}-${item.slug}`"
        class="item-row"
        :to="item.href"
      >
        <span class="item-type">{{ item.type }}</span>
        <strong>{{ item.title || item.name }}</strong>
        <span class="item-time">{{ new Date(item.visitedAt).toLocaleString('zh-CN') }}</span>
      </RouterLink>
    </div>

    <EmptyState
      v-else-if="!loading"
      title="暂无历史"
      description="你还没有浏览记录。"
    />
  </section>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 950;
}

.text-button {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 0.85rem;
  cursor: pointer;
}

.text-button:hover {
  color: var(--ink);
  border-color: var(--line-strong);
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
  color: var(--brand);
  background: rgba(var(--brand-rgb), 0.08);
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: uppercase;
}

.item-time {
  margin-left: auto;
  color: var(--muted);
  font-size: 0.82rem;
}
</style>
