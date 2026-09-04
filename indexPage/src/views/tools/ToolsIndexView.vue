<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import SectionHeading from '../../components/SectionHeading.vue'
import ToolCard from '../../components/ToolCard.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import UtilitiesBoard from '../../components/widgets/UtilitiesBoard.vue'
import { useToolStore } from '../../stores/tool'
import { useWidgetStore } from '../../stores/widgets'

const toolStore = useToolStore()
const { tools, loading, error } = storeToRefs(toolStore)
const widgetStore = useWidgetStore()
const { utilities } = storeToRefs(widgetStore)

onMounted(() => {
  toolStore.fetchTools()
  widgetStore.fetchWidgets()
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="tools-title">
      <SectionHeading
        variant="page"
        eyebrow="ONLINE TOOLS"
        title="在线工具"
        title-id="tools-title"
        lead="为开发者准备的实用工具，覆盖 Nginx、CORS、JWT、Sitemap、Cron 等常见场景。"
      />

      <ErrorMessage v-if="error" :message="error" @retry="toolStore.fetchTools" />

      <AppSkeleton v-if="loading" :lines="6" />

      <section v-else-if="tools.length" class="tool-grid" aria-label="工具列表">
        <ToolCard v-for="tool in tools" :key="tool.slug" :tool="tool" />
      </section>

      <EmptyState
        v-else-if="!loading"
        title="暂无工具"
        description="工具列表为空，请稍后再试。"
      />

      <!-- 实用小工具：纯前端即时可用 -->
      <div class="utilities-block">
        <h2 class="utilities-title">实用小工具</h2>
        <p class="utilities-lead">无需跳转，点击卡片即可展开使用。</p>
        <UtilitiesBoard :utilities="utilities" :loading="widgetStore.loading" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;
}

.utilities-block {
  margin-top: clamp(40px, 6vw, 64px);
}

.utilities-title {
  font-size: 1.5rem;
  font-weight: 950;
}

.utilities-lead {
  margin: 8px 0 18px;
  color: var(--muted);
  font-size: 0.92rem;
}

@media (max-width: 1100px) {
  .tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
