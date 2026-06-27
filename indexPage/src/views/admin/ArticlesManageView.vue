<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import AppSkeleton from '../../components/common/AppSkeleton.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useArticleStore } from '../../stores/article'

const articleStore = useArticleStore()
const { articles, loading, error } = storeToRefs(articleStore)

onMounted(() => {
  articleStore.fetchArticles()
})
</script>

<template>
  <section aria-labelledby="admin-articles-title">
    <div class="section-header">
      <h2 id="admin-articles-title" class="section-title">文章管理</h2>
      <button type="button" class="action primary">新增文章</button>
    </div>

    <ErrorMessage v-if="error" :message="error" @retry="articleStore.fetchArticles" />

    <AppSkeleton v-if="loading" :lines="5" />

    <div v-else-if="articles.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>状态</th>
            <th>阅读量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.slug">
            <td>{{ article.title }}</td>
            <td>{{ article.category }}</td>
            <td><span class="status-badge">已发布</span></td>
            <td>{{ article.viewCount }}</td>
            <td>
              <button type="button" class="text-button">编辑</button>
              <button type="button" class="text-button danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState v-else-if="!loading" title="暂无文章" description="点击右上角新增文章。" />
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
