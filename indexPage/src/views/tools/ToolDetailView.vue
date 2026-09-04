<script setup>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useToolStore } from '../../stores/tool'

const route = useRoute()
const toolStore = useToolStore()

const slug = computed(() => route.params.slug)

onMounted(() => {
  toolStore.fetchTool(slug.value)
})

const toolComponentMap = {
  'nginx-generator': defineAsyncComponent(() => import('./NginxGeneratorForm.vue')),
  'nginx-checker': defineAsyncComponent(() => import('./NginxChecker.vue')),
  'jwt-parser': defineAsyncComponent(() => import('./JwtParser.vue')),
  'cors-generator': defineAsyncComponent(() => import('./CorsGenerator.vue')),
  'cron-generator': defineAsyncComponent(() => import('./CronGenerator.vue')),
  'sitemap-checker': defineAsyncComponent(() => import('./SitemapChecker.vue')),
}

const activeTool = computed(() => toolComponentMap[slug.value])
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="tool-title">
      <AppSkeleton v-if="toolStore.loading" :lines="6" />

      <ErrorMessage
        v-else-if="toolStore.error"
        :message="toolStore.error"
        @retry="toolStore.fetchTool(slug)"
      />

      <template v-else-if="toolStore.currentTool">
        <SectionHeading
          variant="page"
          :eyebrow="toolStore.currentTool.category.toUpperCase() + ' TOOL'"
          :title="toolStore.currentTool.name"
          :title-id="'tool-title'"
          :lead="toolStore.currentTool.summary"
        />

        <component :is="activeTool" v-if="activeTool" />
        <div v-else class="tool-placeholder">
          <p>该工具的交互界面将在后续阶段实现。当前可预览工具元数据与结构。</p>
        </div>
      </template>

      <EmptyState
        v-else-if="!toolStore.loading"
        title="工具不存在"
        description="你访问的工具尚未上线或已被移除。"
      />
    </section>
  </main>
</template>

<style scoped>
.tool-placeholder {
  margin-top: 28px;
  padding: 32px;
  border: 1px dashed var(--line);
  border-radius: 14px;
  color: var(--muted);
  text-align: center;
}
</style>
