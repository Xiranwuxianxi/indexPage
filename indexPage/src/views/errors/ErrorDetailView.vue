<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useErrorStore } from '../../stores/error'

const route = useRoute()
const errorStore = useErrorStore()
const slug = computed(() => route.params.slug)

onMounted(() => {
  errorStore.fetchError(slug.value)
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="error-title">
      <AppSkeleton v-if="errorStore.loading" :lines="8" />

      <ErrorMessage
        v-else-if="errorStore.error"
        :message="errorStore.error"
        @retry="errorStore.fetchError(slug)"
      />

      <article v-else-if="errorStore.currentError">
        <SectionHeading
          variant="page"
          eyebrow="ERROR SOLUTION"
          :title="errorStore.currentError.title"
          title-id="error-title"
        />

        <div class="error-detail">
          <div class="detail-section">
            <h2>错误原文</h2>
            <pre class="error-original">{{ errorStore.currentError.original }}</pre>
          </div>

          <div class="detail-section">
            <h2>中文解释</h2>
            <p>{{ errorStore.currentError.summary }}</p>
          </div>

          <div class="detail-section">
            <h2>产生原因</h2>
            <p>该错误通常由配置不匹配、路径错误或协议不一致导致。完整原因分析与修复步骤将在 Phase 5 补充。</p>
          </div>

          <div class="detail-section">
            <h2>常见场景</h2>
            <ul>
              <li>生产环境首次部署 Nginx 后未正确配置 HTTPS 重定向。</li>
              <li>本地开发使用 HTTP 访问了只监听 HTTPS 的端口。</li>
              <li>负载均衡或 CDN 回源协议配置错误。</li>
            </ul>
          </div>

          <div class="detail-section">
            <h2>验证命令</h2>
            <pre class="code-block">curl -I http://{{ errorStore.currentError.category === 'nginx' ? 'example.com' : 'localhost' }}</pre>
          </div>
        </div>
      </article>

      <EmptyState
        v-else-if="!errorStore.loading"
        title="错误条目不存在"
        description="你访问的错误条目尚未收录。"
      />
    </section>
  </main>
</template>

<style scoped>
.error-detail {
  display: grid;
  gap: 28px;
  margin-top: 28px;
}

.detail-section h2 {
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 950;
}

.detail-section p,
.detail-section ul {
  color: var(--muted);
  line-height: 1.85;
}

.detail-section ul {
  display: grid;
  gap: 8px;
  padding-left: 20px;
}

.error-original,
.code-block {
  margin: 0;
  padding: 14px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  color: var(--soft);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  overflow-x: auto;
}

.error-original {
  background: rgba(255, 79, 195, 0.06);
}

html.dark .error-original,
html.dark .code-block {
  background: rgba(0, 0, 0, 0.25);
}
</style>
