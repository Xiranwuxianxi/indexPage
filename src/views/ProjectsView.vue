<script setup>
import { storeToRefs } from 'pinia'

import ProjectCard from '../components/ProjectCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { useSiteStore } from '../stores/site'

const site = useSiteStore()
const { filteredProjects, projectTypes, selectedType } = storeToRefs(site)

const handleCardMove = (event) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  card.style.setProperty('--mouse-x', `${x}%`)
  card.style.setProperty('--mouse-y', `${y}%`)
}

const handleCardLeave = (event) => {
  event.currentTarget.style.removeProperty('--mouse-x')
  event.currentTarget.style.removeProperty('--mouse-y')
}
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

      <div class="filters" aria-label="项目类型筛选">
        <button
          v-for="type in projectTypes"
          :key="type"
          class="filter-button"
          :class="{ 'is-active': selectedType === type }"
          :aria-pressed="selectedType === type"
          type="button"
          @click="site.setSelectedType(type)"
        >
          {{ type }}
        </button>
      </div>

      <div class="store-note">
        <strong>当前筛选</strong>
        <span>{{ selectedType }}，命中 {{ filteredProjects.length }} 个入口。</span>
      </div>

      <TransitionGroup
        tag="section"
        class="project-grid project-board"
        aria-live="polite"
        name="project-board"
      >
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        />
      </TransitionGroup>
    </section>
  </main>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
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
  box-shadow: 0 10px 24px rgba(0, 184, 255, 0.22);
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
