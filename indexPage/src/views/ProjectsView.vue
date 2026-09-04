<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import ProjectCard from '../components/ProjectCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import ProjectFormModal from '../components/admin/ProjectFormModal.vue'
import AppSkeleton from '../components/common/AppSkeleton.vue'
import EmptyState from '../components/common/EmptyState.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import api from '../api/client.js'
import { useProjectStore } from '../stores/project'
import { useUserStore } from '../stores/user'

const projectStore = useProjectStore()
const { filteredProjects, projectTypes, selectedType, loading, error } = storeToRefs(projectStore)
const { isEditor } = storeToRefs(useUserStore())

const showModal = ref(false)
const saving = ref(false)

async function handleCreate(payload) {
  saving.value = true
  try {
    await api.createProject(payload)
    showModal.value = false
    await projectStore.fetchProjects()
  } catch (err) {
    window.alert(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="projects-title">
      <SectionHeading
        variant="page"
        eyebrow="PROJECT INDEX"
        title="项目索引"
        title-id="projects-title"
        lead="这里集中整理工具、文章和开源入口。你可以按类型快速筛选，也可以直接进入对应站点继续探索。"
      />

      <div class="page-head-row">
        <div class="filters" aria-label="项目类型筛选">
          <button
            v-for="type in projectTypes"
            :key="type"
            class="filter-button"
            :class="{ 'is-active': selectedType === type }"
            :aria-pressed="selectedType === type"
            type="button"
            @click="projectStore.setSelectedType(type)"
          >
            {{ type }}
          </button>
        </div>

        <button
          v-if="isEditor"
          type="button"
          class="action primary add-project-btn"
          @click="showModal = true"
        >
          + 新增项目
        </button>
      </div>

      <div class="store-note">
        <strong>当前筛选</strong>
        <span>{{ selectedType }}，命中 {{ filteredProjects.length }} 个入口。</span>
      </div>

      <ErrorMessage v-if="error" :message="error" @retry="projectStore.fetchProjects" />

      <AppSkeleton v-if="loading" :lines="6" />

      <TransitionGroup
        v-else-if="filteredProjects.length"
        tag="section"
        class="project-grid project-board"
        aria-live="polite"
        name="project-board"
      >
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.slug"
          :project="{
            ...project,
            id: project.slug,
            href: project.href,
            name: project.name,
            status: project.statusText,
            summary: project.summary,
          }"
        />
      </TransitionGroup>

      <EmptyState
        v-else-if="!loading"
        title="没有匹配的项目"
        description="当前筛选条件下没有项目，尝试切换其他类型。"
      />

      <ProjectFormModal
        v-if="showModal"
        :saving="saving"
        @close="showModal = false"
        @save="handleCreate"
      />
    </section>
  </main>
</template>

<style scoped>
.page-head-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.add-project-btn {
  min-height: 38px;
  padding: 0 16px;
  font-size: 0.9rem;
}

.filter-button {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.62);
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    color 0.2s var(--ease-out),
    background 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out);
}

.filter-button:hover {
  color: var(--ink);
  transform: translateY(-1px);
}

.filter-button.is-active {
  color: #ffffff;
  border-color: transparent;
  background: var(--cyan);
  box-shadow: 0 10px 24px rgba(var(--brand-rgb), 0.22);
}

.project-board {
  margin-top: 26px;
}

.store-note {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--muted);
  background: var(--paper);
  line-height: 1.7;
}

.store-note strong {
  color: var(--ink);
  font-weight: 950;
}

.error-message {
  margin-top: 24px;
}

html.dark .filter-button {
  color: var(--muted);
  background: rgba(0, 0, 0, 0.2);
}

html.dark .filter-button:hover {
  color: var(--ink);
  background: rgba(0, 0, 0, 0.35);
}

html.dark .store-note {
  background: var(--paper);
}

@media (max-width: 640px) {
  .store-note {
    grid-template-columns: 1fr;
  }
}
</style>
