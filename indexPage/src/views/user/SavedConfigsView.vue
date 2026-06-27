<script setup>
import { onMounted, ref } from 'vue'

import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import api from '../../api/client.js'

const configs = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const data = await api.getSavedConfigs()
    configs.value = data
  } catch (err) {
    error.value = err.message || '加载配置失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section aria-labelledby="configs-title">
    <h2 id="configs-title" class="section-title">保存的配置</h2>

    <ErrorMessage v-if="error" :message="error" />

    <AppSkeleton v-if="loading" :lines="3" />

    <div v-else-if="configs.length" class="item-list">
      <RouterLink
        v-for="config in configs"
        :key="config.id"
        class="item-row"
        :to="`/tools/${config.toolSlug}`"
      >
        <span class="item-type">{{ config.toolName }}</span>
        <strong>{{ config.name }}</strong>
        <span class="item-time">{{ new Date(config.createdAt).toLocaleString('zh-CN') }}</span>
      </RouterLink>
    </div>

    <EmptyState
      v-else-if="!loading"
      title="暂无保存配置"
      description="使用 Nginx 配置生成器等工具后，登录即可保存配置。"
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
}

.item-time {
  margin-left: auto;
  color: var(--muted);
  font-size: 0.82rem;
}
</style>
