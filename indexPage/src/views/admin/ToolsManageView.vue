<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useToolStore } from '../../stores/tool'

const toolStore = useToolStore()
const { tools, loading, error } = storeToRefs(toolStore)

onMounted(() => {
  toolStore.fetchTools()
})
</script>

<template>
  <section aria-labelledby="admin-tools-title">
    <div class="section-header">
      <h2 id="admin-tools-title" class="section-title">工具管理</h2>
      <button type="button" class="action primary">新增工具</button>
    </div>

    <ErrorMessage v-if="error" :message="error" @retry="toolStore.fetchTools" />

    <AppSkeleton v-if="loading" :lines="4" />

    <div v-else-if="tools.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>分类</th>
            <th>使用次数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tool in tools" :key="tool.slug">
            <td>{{ tool.name }}</td>
            <td>{{ tool.category }}</td>
            <td>{{ tool.usageCount.toLocaleString() }}</td>
            <td>
              <button type="button" class="text-button">编辑</button>
              <button type="button" class="text-button danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState v-else-if="!loading" title="暂无工具" description="点击右上角新增工具。" />
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
