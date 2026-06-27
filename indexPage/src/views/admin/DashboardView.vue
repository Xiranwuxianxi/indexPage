<script setup>
const stats = [
  { label: '今日 UV', value: '—' },
  { label: '今日 PV', value: '—' },
  { label: '热门工具', value: '—' },
  { label: '热门搜索', value: '—' },
  { label: '注册转化', value: '—' },
  { label: '工具成功率', value: '—' },
]
</script>

<template>
  <section aria-labelledby="dashboard-title">
    <h2 id="dashboard-title" class="section-title">仪表盘</h2>

    <div class="stat-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </div>
    </div>

    <div class="dashboard-note">
      <p>仪表盘数据将在 Phase 4/7 接入后端统计服务后动态展示。当前为布局占位。</p>
    </div>
  </section>
</template>

<style scoped>
.section-title {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 950;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  display: grid;
  gap: 8px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
}

.stat-card strong {
  font-size: 1.8rem;
  font-weight: 950;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.9rem;
}

.dashboard-note {
  margin-top: 24px;
  padding: 16px;
  border: 1px dashed var(--line);
  border-radius: 12px;
  color: var(--muted);
}

@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
