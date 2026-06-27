<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useErrorStore } from '../../stores/error'

const errorStore = useErrorStore()
const { errors, loading, error } = storeToRefs(errorStore)

onMounted(() => {
  errorStore.fetchErrors()
})
</script>

<template>
  <section aria-labelledby="admin-errors-title">
    <div class="section-header">
      <h2 id="admin-errors-title" class="section-title">错误知识库管理</h2>
      <button type="button" class="action primary">新增错误</button>
    </div>

    <ErrorMessage v-if="error" :message="error" @retry="errorStore.fetchErrors" />

    <AppSkeleton v-if="loading" :lines="4" />

    <div v-else-if="errors.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="errorItem in errors" :key="errorItem.slug">
            <td>{{ errorItem.title }}</td>
            <td>{{ errorItem.category }}</td>
            <td>
              <button type="button" class="text-button">编辑</button>
              <button type="button" class="text-button danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState v-else-if="!loading" title="暂无错误条目" description="点击右上角新增错误。" />
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
