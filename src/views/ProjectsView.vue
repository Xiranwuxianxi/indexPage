<script setup>
import { storeToRefs } from 'pinia'

import { useSiteStore } from '../stores/site'

const site = useSiteStore()
const { filteredProjects, projectTypes, selectedType } = storeToRefs(site)
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="projects-title">
      <div class="page-heading">
        <div>
          <p class="eyebrow">PROJECT INDEX</p>
          <h1 id="projects-title">项目索引</h1>
          <p class="page-lead">
            这里集中整理工具、文章和开源入口。你可以按类型快速筛选，也可以直接进入对应站点继续探索。
          </p>
        </div>
      </div>

      <div class="filters" aria-label="项目类型筛选">
        <button
          v-for="type in projectTypes"
          :key="type"
          class="filter-button"
          :class="{ 'is-active': selectedType === type }"
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

      <section class="project-grid project-board" aria-live="polite">
        <a
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
          :href="project.href"
          target="_blank"
          rel="noreferrer"
        >
          <span class="project-type">{{ project.type }}</span>
          <h3>{{ project.name }}</h3>
          <p>{{ project.summary }}</p>
          <span class="project-status">
            <span class="status-light"></span>
            {{ project.status }}
          </span>
        </a>
      </section>
    </section>
  </main>
</template>
