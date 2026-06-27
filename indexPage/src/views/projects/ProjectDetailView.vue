<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useProjectStore } from '../../stores/project'

const route = useRoute()
const projectStore = useProjectStore()
const slug = computed(() => route.params.slug)

onMounted(() => {
  projectStore.fetchProject(slug.value)
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="project-title">
      <AppSkeleton v-if="projectStore.loading" :lines="8" />

      <ErrorMessage
        v-else-if="projectStore.error"
        :message="projectStore.error"
        @retry="projectStore.fetchProject(slug)"
      />

      <article v-else-if="projectStore.currentProject">
        <SectionHeading
          variant="page"
          eyebrow="PROJECT"
          :title="projectStore.currentProject.name"
          title-id="project-title"
          :lead="projectStore.currentProject.summary"
        />

        <img
          class="project-cover"
          :src="projectStore.currentProject.cover"
          alt=""
          width="1200"
          height="630"
          loading="eager"
        />

        <div class="project-meta">
          <span class="project-type">{{ projectStore.currentProject.type }}</span>
          <span class="project-status">{{ projectStore.currentProject.statusText }}</span>
          <span>更新于 {{ new Date(projectStore.currentProject.updatedAt).toLocaleDateString('zh-CN') }}</span>
        </div>

        <div class="project-section">
          <h2>核心技术</h2>
          <ul class="tech-list">
            <li v-for="tech in projectStore.currentProject.techStack" :key="tech">{{ tech }}</li>
          </ul>
        </div>

        <div class="project-actions">
          <a
            v-if="projectStore.currentProject.demoUrl"
            class="action primary"
            :href="projectStore.currentProject.demoUrl"
            target="_blank"
            rel="noreferrer"
          >
            在线体验
          </a>
          <a
            v-if="projectStore.currentProject.repoUrl"
            class="action secondary"
            :href="projectStore.currentProject.repoUrl"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </article>

      <EmptyState
        v-else-if="!projectStore.loading"
        title="项目不存在"
        description="你访问的项目尚未发布或已被移除。"
      />
    </section>
  </main>
</template>

<style scoped>
.project-cover {
  width: 100%;
  height: auto;
  margin-top: 24px;
  border-radius: 14px;
  aspect-ratio: 1200 / 630;
  object-fit: cover;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.project-type {
  padding: 4px 10px;
  border-radius: 6px;
  color: #0078b4;
  background: rgba(0, 184, 255, 0.08);
  font-size: 0.74rem;
  font-weight: 950;
}

.project-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--green);
  font-weight: 800;
}

.project-section {
  margin-top: 28px;
}

.project-section h2 {
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 950;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.tech-list li {
  padding: 6px 12px;
  border-radius: 8px;
  color: var(--soft);
  background: rgba(0, 184, 255, 0.06);
  font-size: 0.85rem;
  font-weight: 800;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}
</style>
