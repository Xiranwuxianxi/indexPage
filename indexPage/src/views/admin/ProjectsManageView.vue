<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useProjectStore } from '../../stores/project'

const projectStore = useProjectStore()
const { projects, loading, error } = storeToRefs(projectStore)

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<template>
  <section aria-labelledby="admin-projects-title">
    <div class="section-header">
      <h2 id="admin-projects-title" class="section-title">项目管理</h2>
      <button type="button" class="action primary">新增项目</button>
    </div>

    <ErrorMessage v-if="error" :message="error" @retry="projectStore.fetchProjects" />

    <AppSkeleton v-if="loading" :lines="4" />

    <div v-else-if="projects.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.slug">
            <td>{{ project.name }}</td>
            <td>{{ project.type }}</td>
            <td><span class="status-badge">{{ project.statusText }}</span></td>
            <td>
              <button type="button" class="text-button">编辑</button>
              <button type="button" class="text-button danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState v-else-if="!loading" title="暂无项目" description="点击右上角新增项目。" />
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

.admin-table-wrap {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.admin-table th,
.admin-table td {
  padding: 12px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.admin-table th {
  color: var(--muted);
  font-weight: 800;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 6px;
  color: #17c784;
  background: rgba(23, 199, 132, 0.1);
  font-size: 0.72rem;
  font-weight: 950;
}

.text-button {
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: var(--cyan);
  font-size: 0.85rem;
  cursor: pointer;
}

.text-button.danger {
  color: #ff4f4f;
}
</style>
