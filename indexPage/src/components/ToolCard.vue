<script setup>
defineProps({
  tool: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink class="tool-card" :to="tool.href">
    <span class="tool-icon" aria-hidden="true">{{ tool.icon }}</span>
    <span class="tool-category">{{ tool.category }}</span>
    <h3>{{ tool.name }}</h3>
    <p>{{ tool.summary }}</p>
    <div class="tool-meta">
      <span v-if="tool.usageCount > 0">使用 {{ tool.usageCount.toLocaleString() }} 次</span>
      <span>更新于 {{ new Date(tool.updatedAt).toLocaleDateString('zh-CN') }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.tool-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 16px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(var(--brand-rgb), 0.06);
  transition:
    transform 0.35s var(--ease-out),
    border-color 0.35s var(--ease-out),
    box-shadow 0.35s var(--ease-out);
}

.tool-card:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-hover);
}

.tool-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-bottom: 14px;
  border: 1px solid rgba(var(--brand-rgb), 0.18);
  border-radius: 12px;
  background: rgba(var(--brand-rgb), 0.07);
  font-size: 1.35rem;
  line-height: 1;
}

.tool-category {
  align-self: flex-start;
  padding: 5px 10px;
  border: 1px solid rgba(var(--brand-rgb), 0.26);
  border-radius: 8px;
  color: var(--brand);
  background: rgba(var(--brand-rgb), 0.07);
  font-size: 0.74rem;
  font-weight: 950;
}

.tool-card h3 {
  margin-top: 18px;
  font-size: clamp(1.18rem, 2vw, 1.5rem);
  font-weight: 950;
  line-height: 1.2;
}

.tool-card p {
  margin-top: 12px;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.75;
}

.tool-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
  padding-top: 20px;
  color: var(--soft);
  font-size: 0.78rem;
  font-weight: 700;
}

.tool-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

html.dark .tool-category {
  border-color: rgba(var(--brand-rgb), 0.35);
  color: #4fd1ff;
  background: rgba(var(--brand-rgb), 0.12);
}
</style>
