<script setup>
import { onMounted, ref } from 'vue'

import api from '../../api/client.js'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import ProjectFormModal from '../../components/admin/ProjectFormModal.vue'

const projects = ref([])
const loading = ref(false)
const error = ref(null)
const saving = ref(false)
const showModal = ref(false)
const editingProject = ref(null)

async function fetchProjects() {
  loading.value = true
  error.value = null
  try {
    const data = await api.getAdminProjects({ page: 1, size: 50 })
    projects.value = data.records || data.list || []
  } catch (err) {
    error.value = err.message || '加载项目失败'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingProject.value = null
  showModal.value = true
}

function openEdit(project) {
  editingProject.value = project
  showModal.value = true
}

async function handleSave(payload) {
  saving.value = true
  error.value = null
  try {
    if (editingProject.value) {
      await api.updateProject(editingProject.value.id, payload)
    } else {
      await api.createProject(payload)
    }
    showModal.value = false
    await fetchProjects()
  } catch (err) {
    error.value = err.message || '保存失败'
  } finally {
    saving.value = false
  }
}

async function handleDelete(project) {
  if (!window.confirm(`确定删除项目「${project.name}」吗？`)) return
  try {
    await api.deleteProject(project.id)
    await fetchProjects()
  } catch (err) {
    error.value = err.message || '删除失败'
  }
}

onMounted(fetchProjects)
</script>

<template>
  <section aria-labelledby="admin-projects-title">
    <div class="section-header">
      <h2 id="admin-projects-title" class="section-title">项目管理</h2>
      <button type="button" class="action primary" @click="openCreate">新增项目</button>
    </div>

    <ErrorMessage v-if="error" :message="error" @retry="fetchProjects" />

    <AppSkeleton v-if="loading" :lines="4" />

    <div v-else-if="projects.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>项目网址</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>{{ project.icon }} {{ project.name }}</td>
            <td>{{ project.type || '—' }}</td>
            <td>
              <a
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="url-link"
              >
                {{ project.demoUrl }}
              </a>
              <span v-else>—</span>
            </td>
            <td><span class="status-badge">{{ project.statusText }}</span></td>
            <td>
              <button type="button" class="text-button" @click="openEdit(project)">编辑</button>
              <button type="button" class="text-button danger" @click="handleDelete(project)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState v-else-if="!loading" title="暂无项目" description="点击右上角新增项目。" />

    <ProjectFormModal
      v-if="showModal"
      :project="editingProject"
      :saving="saving"
      @close="showModal = false"
      @save="handleSave"
    />
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

.url-link {
  color: var(--brand);
  font-size: 0.84rem;
  word-break: break-all;
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
  color: var(--brand);
  font-size: 0.85rem;
  cursor: pointer;
}

.text-button.danger {
  color: #ff4f4f;
}
</style>
