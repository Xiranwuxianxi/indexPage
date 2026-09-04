<script setup>
import { onMounted, ref } from 'vue'

import api from '../../api/client.js'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import ToolFormModal from '../../components/admin/ToolFormModal.vue'

const tools = ref([])
const loading = ref(false)
const error = ref(null)
const saving = ref(false)
const showModal = ref(false)
const editingTool = ref(null)

async function fetchTools() {
  loading.value = true
  error.value = null
  try {
    const data = await api.getAdminTools({ page: 1, size: 50 })
    tools.value = data.records || data.list || []
  } catch (err) {
    error.value = err.message || '加载工具失败'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingTool.value = null
  showModal.value = true
}

function openEdit(tool) {
  editingTool.value = tool
  showModal.value = true
}

async function handleSave(payload) {
  saving.value = true
  error.value = null
  try {
    if (editingTool.value) {
      await api.updateTool(editingTool.value.id, payload)
    } else {
      await api.createTool(payload)
    }
    showModal.value = false
    await fetchTools()
  } catch (err) {
    error.value = err.message || '保存失败'
  } finally {
    saving.value = false
  }
}

async function handleDelete(tool) {
  if (!window.confirm(`确定删除工具「${tool.name}」吗？`)) return
  try {
    await api.deleteTool(tool.id)
    await fetchTools()
  } catch (err) {
    error.value = err.message || '删除失败'
  }
}

function statusLabel(status) {
  return { 0: '已下线', 1: '已发布', 2: '草稿' }[status] ?? '未知'
}

onMounted(fetchTools)
</script>

<template>
  <section aria-labelledby="admin-tools-title">
    <div class="section-header">
      <h2 id="admin-tools-title" class="section-title">工具管理</h2>
      <button type="button" class="action primary" @click="openCreate">发布工具</button>
    </div>

    <ErrorMessage v-if="error" :message="error" @retry="fetchTools" />

    <AppSkeleton v-if="loading" :lines="4" />

    <div v-else-if="tools.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>分类</th>
            <th>状态</th>
            <th>使用次数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tool in tools" :key="tool.id">
            <td>{{ tool.icon }} {{ tool.name }}</td>
            <td>{{ tool.category || '—' }}</td>
            <td>
              <span class="status-badge" :class="{ draft: tool.publishStatus !== 1 }">
                {{ statusLabel(tool.publishStatus) }}
              </span>
            </td>
            <td>{{ (tool.usageCount || 0).toLocaleString() }}</td>
            <td>
              <button type="button" class="text-button" @click="openEdit(tool)">编辑</button>
              <button type="button" class="text-button danger" @click="handleDelete(tool)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState v-else-if="!loading" title="暂无工具" description="点击右上角发布工具。" />

    <ToolFormModal
      v-if="showModal"
      :tool="editingTool"
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

.status-badge {
  padding: 3px 8px;
  border-radius: 6px;
  color: #17c784;
  background: rgba(23, 199, 132, 0.1);
  font-size: 0.72rem;
  font-weight: 950;
}

.status-badge.draft {
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
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
