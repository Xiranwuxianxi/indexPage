<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useErrorStore } from '../../stores/error'

const errorStore = useErrorStore()
const { errors, categories, loading, error } = storeToRefs(errorStore)

onMounted(() => {
  errorStore.fetchErrors()
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="errors-title">
      <SectionHeading
        variant="page"
        eyebrow="ERROR KNOWLEDGE BASE"
        title="错误知识库"
        title-id="errors-title"
        lead="收录开发、部署、服务器与 AI 工程化中的常见错误，提供原因分析、配置示例与验证方法。"
      />

      <div v-if="categories.length" class="category-tags" aria-label="错误分类">
        <RouterLink
          v-for="category in categories"
          :key="category"
          class="category-tag"
          :to="`/errors/${category}`"
        >
          {{ category }}
        </RouterLink>
      </div>

      <ErrorMessage v-if="error" :message="error" @retry="errorStore.fetchErrors" />

      <AppSkeleton v-if="loading" :lines="5" />

      <section v-else-if="errors.length" class="error-list" aria-label="错误列表">
        <RouterLink
          v-for="errorItem in errors"
          :key="errorItem.slug"
          class="error-row"
          :to="errorItem.href"
        >
          <span class="error-category">{{ errorItem.category }}</span>
          <strong>{{ errorItem.title }}</strong>
          <pre class="error-original">{{ errorItem.original }}</pre>
          <p>{{ errorItem.summary }}</p>
        </RouterLink>
      </section>

      <EmptyState
        v-else-if="!loading"
        title="暂无错误条目"
        description="错误知识库正在建设中。"
      />
    </section>
  </main>
</template>

<style scoped>
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.category-tag {
  padding: 6px 14px;
  border: 1px solid var(--line);
  border-radius: 20px;
  color: var(--muted);
  background: var(--paper);
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out),
    color 0.2s var(--ease-out);
}

.category-tag:hover {
  transform: translateY(-1px);
  border-color: var(--line-strong);
  color: var(--ink);
}

.error-list {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.error-row {
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
    border-color 0.25s var(--ease-out);
}

.error-row:hover {
  transform: translateX(4px);
  border-color: var(--line-strong);
}

.error-original {
  margin: 0;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 79, 195, 0.06);
  color: var(--soft);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
}

.error-row p {
  color: var(--muted);
  line-height: 1.7;
}
</style>
